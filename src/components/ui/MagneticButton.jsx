import React, { useRef } from 'react';
import { motion, useSpring } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';

const MagneticButton = ({ children, className = '', variant = 'primary', ...props }) => {
  const ref = useRef(null);
  const { setCursorVariant } = useAppContext();

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(0, springConfig);
  const springY = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    springX.set((clientX - (left + width / 2)) * 0.4);
    springY.set((clientY - (top + height / 2)) * 0.4);
  };

  const handleMouseLeave = () => {
    springX.set(0);
    springY.set(0);
    setCursorVariant('default');
  };

  const variants = {
    primary: 'px-10 py-4 bg-white text-black rounded-full font-semibold text-base hover:bg-white/90',
    secondary: 'px-10 py-4 bg-transparent text-white border-2 border-white/30 rounded-full font-semibold text-base hover:border-white hover:bg-white/5',
    accent: 'px-10 py-4 bg-accent text-white rounded-full font-semibold text-base hover:bg-accent/80',
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setCursorVariant('hover')}
      style={{ x: springX, y: springY }}
      className={`relative group inline-flex items-center justify-center transition-all duration-300 active:scale-95 ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {/* Glow effect behind button */}
      <div className="absolute inset-0 rounded-full bg-accent/30 blur-2xl scale-0 group-hover:scale-125 transition-transform duration-500 pointer-events-none" />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

export default MagneticButton;
