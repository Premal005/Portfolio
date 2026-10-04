import React from 'react';
import { motion, useScroll, useVelocity, useTransform, useSpring } from 'framer-motion';

const ScrollSkew = ({ children }) => {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);

  // Map vertical velocity to a subtle skew angle [-2.2deg, 2.2deg]
  const rawSkew = useTransform(scrollVelocity, [-2000, 2000], [2.2, -2.2]);
  const smoothSkew = useSpring(rawSkew, { stiffness: 140, damping: 22, mass: 0.1 });

  return (
    <motion.div
      style={{ skewY: smoothSkew, transformOrigin: 'center center' }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
};

export default ScrollSkew;
