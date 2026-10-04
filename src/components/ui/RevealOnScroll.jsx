import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const RevealOnScroll = ({ 
  children, 
  className = '', 
  direction = 'up', 
  delay = 0, 
  threshold = 0.2 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  const getInitialStyle = () => {
    switch (direction) {
      case 'up': return { y: 80, opacity: 0, rotateX: 5 };
      case 'down': return { y: -80, opacity: 0, rotateX: -5 };
      case 'left': return { x: -80, opacity: 0, rotateY: 5 };
      case 'right': return { x: 80, opacity: 0, rotateY: -5 };
      default: return { y: 80, opacity: 0, rotateX: 5 };
    }
  };

  const initial = getInitialStyle();
  const animate = { y: 0, x: 0, opacity: 1, rotateX: 0, rotateY: 0 };

  return (
    <div 
      ref={ref} 
      className={className} 
      style={{ perspective: '1000px' }}
    >
      <motion.div
        initial={initial}
        animate={isInView ? animate : initial}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 20,
          delay: delay
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default RevealOnScroll;
