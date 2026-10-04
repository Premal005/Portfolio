import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [stage, setStage] = useState(0); // 0: studio tag, 1: title reveal, 2: lens flash & exit
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Stage 0 -> 1 transition
    const t1 = setTimeout(() => setStage(1), 600);

    // Fast cinematic timecode counter 0 -> 100
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStage(2); // trigger lens flare flash and letterbox open
          setTimeout(() => {
            setIsFinished(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 600);
          }, 700);
          return 100;
        }
        return prev + Math.floor(Math.random() * 6) + 3;
      });
    }, 45);

    return () => {
      clearTimeout(t1);
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black flex flex-col justify-between overflow-hidden select-none"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* 1. Cinematic Anamorphic Top Letterbox Bar */}
          <motion.div
            initial={{ height: '14vh' }}
            animate={{ height: stage === 2 ? '0vh' : '14vh' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="w-full bg-black z-30 flex items-center justify-between px-8 border-b border-white/[0.04]"
          >
            <div className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase">
              CINEMA // 2.39:1 ANAMORPHIC
            </div>
            <div className="text-[10px] font-mono tracking-[0.3em] text-accent/80 uppercase">
              REC ● [RAW 8K]
            </div>
          </motion.div>

          {/* 2. Central Movie Title Stage */}
          <div className="relative flex-1 flex flex-col items-center justify-center px-6">
            {/* Ambient Background Glow */}
            <div className="absolute w-[500px] h-[500px] rounded-full bg-accent/10 blur-[140px] pointer-events-none" />

            {/* Sub-header credit */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: stage >= 1 ? 1 : 0, y: stage >= 1 ? 0 : 15 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-xs sm:text-sm font-mono tracking-[0.45em] text-white/40 uppercase mb-6"
            >
              ✦ A CREATIVE DIGITAL PRODUCTION ✦
            </motion.div>

            {/* Monumental Hero Name Title */}
            <div className="relative overflow-hidden py-3">
              <motion.h1
                initial={{ opacity: 0, scale: 1.15, filter: 'blur(12px)' }}
                animate={{
                  opacity: stage >= 1 ? 1 : 0,
                  scale: stage >= 1 ? 1 : 1.15,
                  filter: stage >= 1 ? 'blur(0px)' : 'blur(12px)',
                }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-7xl md:text-9xl font-display font-black tracking-[-0.03em] text-white uppercase text-center relative z-10"
              >
                PREMAL GOYAL
              </motion.h1>

              {/* Anamorphic Light Streak Shimmer across Title */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: stage >= 1 ? '200%' : '-100%' }}
                transition={{ duration: 1.6, ease: 'easeInOut', delay: 0.3 }}
                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent skew-x-[-25deg] pointer-events-none z-20"
              />
            </div>

            {/* Tagline */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: stage >= 1 ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-6 text-xs sm:text-base font-light font-sans text-white/50 tracking-[0.25em] uppercase text-center"
            >
              FULL STACK ARCHITECTURE & BESPOKE 3D WEBGL
            </motion.div>
          </div>

          {/* 3. Cinematic Anamorphic Bottom Letterbox Bar */}
          <motion.div
            initial={{ height: '14vh' }}
            animate={{ height: stage === 2 ? '0vh' : '14vh' }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="w-full bg-black z-30 flex items-center justify-between px-8 border-t border-white/[0.04]"
          >
            {/* Live Timecode & Frame Counter */}
            <div className="flex items-center gap-4 text-[10px] font-mono text-white/40 tracking-widest">
              <span>TC: 00:00:{String(Math.floor(count / 10)).padStart(2, '0')}:{String(count % 24).padStart(2, '0')}</span>
              <span className="hidden sm:inline-block text-white/20">|</span>
              <span className="hidden sm:inline-block">24.000 FPS</span>
            </div>

            {/* Progress Percentage */}
            <div className="flex items-center gap-3">
              <div className="w-24 sm:w-40 h-[2px] bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent to-neon"
                  animate={{ width: `${Math.min(count, 100)}%` }}
                  transition={{ ease: 'easeOut' }}
                />
              </div>
              <span className="text-xs font-mono font-bold text-white/80 w-10 text-right">
                {Math.min(count, 100)}%
              </span>
            </div>
          </motion.div>

          {/* 4. Full-Screen Anamorphic Lens Flare Flash at Exit */}
          {stage === 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.85, 0] }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute inset-0 bg-white pointer-events-none z-50 mix-blend-screen"
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
