import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

const WORDS = [
  { text: 'CRAFTING', isGradient: false },
  { text: 'DIGITAL', isGradient: false },
  { text: 'EXPERIENCES', isGradient: true },
];

const CinematicTitleTyping = () => {
  // typedCount: how many characters typed for each of the 3 words
  const [typedCounts, setTypedCounts] = useState([0, 0, 0]);
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const [isFullyTyped, setIsFullyTyped] = useState(false);
  const { sound } = useAppContext();

  useEffect(() => {
    // Initial delay before first word starts flying in & typing
    let currentWord = 0;
    let currentChar = 0;

    const interval = setInterval(() => {
      if (currentWord >= WORDS.length) {
        clearInterval(interval);
        setIsFullyTyped(true);
        return;
      }

      const targetWord = WORDS[currentWord].text;

      if (currentChar <= targetWord.length) {
        setTypedCounts((prev) => {
          const next = [...prev];
          next[currentWord] = currentChar;
          return next;
        });
        setActiveWordIndex(currentWord);

        if (sound && currentChar > 0) {
          sound.playKey();
        }

        currentChar++;
      } else {
        // Move to the next word after a slight pause
        currentWord++;
        currentChar = 0;
      }
    }, 70); // typing speed per character

    return () => clearInterval(interval);
  }, [sound]);

  return (
    <div className="flex flex-col items-center justify-center select-none perspective-[1200px] overflow-visible">
      {WORDS.map((item, index) => {
        const isCurrent = activeWordIndex === index && !isFullyTyped;
        const currentTypedText = item.text.slice(0, typedCounts[index]);
        const hasStarted = typedCounts[index] > 0 || activeWordIndex >= index;

        return (
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              scale: 3.2,
              z: 600,
              y: -80,
              filter: 'blur(25px)',
            }}
            animate={
              hasStarted
                ? {
                    opacity: 1,
                    scale: 1,
                    z: 0,
                    y: 0,
                    filter: 'blur(0px)',
                  }
                : {}
            }
            transition={{
              duration: 0.85,
              ease: [0.16, 1, 0.3, 1],
              delay: index * 0.15,
            }}
            className="overflow-visible relative flex items-center justify-center will-change-transform"
          >
            <h1
              className={`font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-[9.5rem] tracking-tight leading-[0.92] text-center uppercase drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] ${
                item.isGradient ? 'gradient-text' : 'text-white'
              }`}
            >
              {currentTypedText}
              {/* Ghost letters to hold layout width while typing */}
              <span className="opacity-0 pointer-events-none select-none">
                {item.text.slice(typedCounts[index])}
              </span>
            </h1>

            {/* Glowing Anamorphic Typing Cursor */}
            {isCurrent && (
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="inline-block w-2 sm:w-3 md:w-4 h-10 sm:h-14 md:h-20 lg:h-24 bg-neon ml-2 rounded-sm shadow-[0_0_20px_#00f2fe]"
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default CinematicTitleTyping;
