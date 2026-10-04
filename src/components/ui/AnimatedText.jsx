import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const AnimatedText = ({ text = '', className = '', delay = 0, once = true, as = 'h1' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: '-10%' });
  const MotionTag = motion[as];

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.02, delayChildren: delay * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: '0%',
      rotateX: '0deg',
      transition: {
        type: 'tween',
        ease: [0.16, 1, 0.3, 1],
        duration: 0.8
      },
    },
    hidden: {
      opacity: 0,
      y: '100%',
      rotateX: '-90deg',
    },
  };

  if (!text) return null;

  return (
    <MotionTag
      ref={ref}
      style={{ overflow: 'hidden', display: 'flex', flexWrap: 'wrap', perspective: '1000px' }}
      variants={container}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {text.split(' ').map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block mr-[0.3em] pb-1" style={{ overflow: 'visible' }}>
          {word.split('').map((char, charIndex) => (
            <motion.span variants={child} key={charIndex} className="inline-block" style={{ transformOrigin: 'bottom' }}>
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </MotionTag>
  );
};

export default AnimatedText;
