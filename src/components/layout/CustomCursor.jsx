import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useMousePosition } from '../../hooks/useMousePosition';
import { useAppContext } from '../../context/AppContext';

const CustomCursor = () => {
  const { cursorVariant, cursorLabel } = useAppContext();
  const { x, y } = useMousePosition();

  const motionX = useMotionValue(-100);
  const motionY = useMotionValue(-100);

  useEffect(() => {
    if (x !== null && y !== null) {
      motionX.set(x);
      motionY.set(y);
    }
  }, [x, y, motionX, motionY]);

  // Main dot and outer ring springs
  const mainX = useSpring(motionX, { stiffness: 500, damping: 28 });
  const mainY = useSpring(motionY, { stiffness: 500, damping: 28 });
  const outerX = useSpring(motionX, { stiffness: 150, damping: 20 });
  const outerY = useSpring(motionY, { stiffness: 150, damping: 20 });
  
  // 8 luminous trails
  const t1x = useSpring(motionX, { stiffness: 300, damping: 25 });
  const t1y = useSpring(motionY, { stiffness: 300, damping: 25 });
  const t2x = useSpring(motionX, { stiffness: 250, damping: 24 });
  const t2y = useSpring(motionY, { stiffness: 250, damping: 24 });
  const t3x = useSpring(motionX, { stiffness: 200, damping: 23 });
  const t3y = useSpring(motionY, { stiffness: 200, damping: 23 });
  const t4x = useSpring(motionX, { stiffness: 150, damping: 22 });
  const t4y = useSpring(motionY, { stiffness: 150, damping: 22 });
  const t5x = useSpring(motionX, { stiffness: 120, damping: 21 });
  const t5y = useSpring(motionY, { stiffness: 120, damping: 21 });
  const t6x = useSpring(motionX, { stiffness: 100, damping: 20 });
  const t6y = useSpring(motionY, { stiffness: 100, damping: 20 });
  const t7x = useSpring(motionX, { stiffness: 90, damping: 19 });
  const t7y = useSpring(motionY, { stiffness: 90, damping: 19 });
  const t8x = useSpring(motionX, { stiffness: 80, damping: 18 });
  const t8y = useSpring(motionY, { stiffness: 80, damping: 18 });

  const variants = {
    default: {
      width: 50,
      height: 50,
      backgroundColor: "transparent",
      border: "1px solid rgba(255, 255, 255, 0.5)",
      opacity: 1
    },
    hover: {
      width: 80,
      height: 80,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(255, 255, 255, 1)",
      opacity: 1,
    },
    drag: {
      width: 80,
      height: 80,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      border: "1px solid rgba(255, 255, 255, 1)",
      opacity: 1,
    }
  };

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999]">
      {/* Trails */}
      <motion.div style={{ x: t8x, y: t8y, opacity: 0.1 }} className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full -ml-[2px] -mt-[2px]" />
      <motion.div style={{ x: t7x, y: t7y, opacity: 0.15 }} className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full -ml-[2px] -mt-[2px]" />
      <motion.div style={{ x: t6x, y: t6y, opacity: 0.2 }} className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full -ml-[3px] -mt-[3px]" />
      <motion.div style={{ x: t5x, y: t5y, opacity: 0.25 }} className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full -ml-[3px] -mt-[3px]" />
      <motion.div style={{ x: t4x, y: t4y, opacity: 0.3 }} className="fixed top-0 left-0 w-1.5 h-1.5 bg-white rounded-full -ml-[3px] -mt-[3px]" />
      <motion.div style={{ x: t3x, y: t3y, opacity: 0.4 }} className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full -ml-[4px] -mt-[4px]" />
      <motion.div style={{ x: t2x, y: t2y, opacity: 0.5 }} className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full -ml-[4px] -mt-[4px]" />
      <motion.div style={{ x: t1x, y: t1y, opacity: 0.6 }} className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full -ml-[4px] -mt-[4px]" />

      {/* Outer Ring */}
      <motion.div
        style={{ x: outerX, y: outerY }}
        variants={variants}
        animate={cursorVariant || "default"}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.3 }}
        className="fixed top-0 left-0 rounded-full -ml-[25px] -mt-[25px] flex items-center justify-center pointer-events-none"
      >
        {(cursorVariant === 'hover' || cursorVariant === 'drag') && cursorLabel && (
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-white text-xs font-bold whitespace-nowrap ${(cursorVariant === 'drag') ? 'uppercase tracking-widest' : ''}`}
          >
            {cursorLabel}
          </motion.span>
        )}
      </motion.div>

      {/* Main Dot */}
      <motion.div
        style={{ x: mainX, y: mainY, boxShadow: '0 0 20px rgba(0,113,227,0.5)' }}
        className="fixed top-0 left-0 w-[10px] h-[10px] bg-white rounded-full mix-blend-difference -ml-[5px] -mt-[5px]"
      />
    </div>
  );
};

export default CustomCursor;
