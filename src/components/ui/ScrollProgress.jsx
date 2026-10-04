import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const [percentage, setPercentage] = useState(0);
  
  useEffect(() => {
    return scrollYProgress.onChange((v) => {
      setPercentage(Math.round(v * 100));
    });
  }, [scrollYProgress]);

  const opacity = useTransform(scrollYProgress, [0, 0.05], [0, 1]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none">
        {/* Glow */}
        <motion.div
          className="absolute top-0 left-0 bottom-0 origin-left bg-gradient-to-r from-[#0071e3] to-purple-500 blur-sm opacity-50 w-full"
          style={{ scaleX }}
        />
        {/* Main Bar */}
        <motion.div
          className="h-full relative bg-gradient-to-r from-[#0071e3] to-purple-500 origin-left"
          style={{ scaleX, boxShadow: '0 0 10px 2px rgba(0, 113, 227, 0.4)' }}
        >
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            style={{ x: '50%' }}
          />
        </motion.div>
      </div>
      
      <motion.div
        className="fixed right-4 top-1/2 -translate-y-1/2 z-[60] text-xs font-mono text-white/50 pointer-events-none mix-blend-difference"
        style={{ opacity, rotate: -90 }}
      >
        {percentage.toString().padStart(3, '0')}%
      </motion.div>
    </>
  );
};

export default ScrollProgress;
