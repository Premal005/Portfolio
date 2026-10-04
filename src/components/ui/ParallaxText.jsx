import { useRef } from 'react';
import { motion, useScroll, useVelocity, useTransform, useAnimationFrame, useMotionValue } from 'framer-motion';

function wrap(min, max, v) {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
}

const ParallaxText = ({ children, baseVelocity = 3, className = '' }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useTransform(scrollVelocity, [0, 1000], [0, 5], { clamp: false });
  const directionFactor = useRef(1);

  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);
    
    if (scrollVelocity.get() < -1) {
      directionFactor.current = -1;
    } else if (scrollVelocity.get() > 1) {
      directionFactor.current = 1;
    }
    
    moveBy += directionFactor.current * smoothVelocity.get() * (delta / 1000);
    
    baseX.set(baseX.get() + moveBy);
  });

  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  return (
    <div className={`overflow-hidden whitespace-nowrap flex-nowrap ${className}`}>
      <motion.div className="flex whitespace-nowrap gap-8" style={{ x }}>
        {[...Array(4)].map((_, i) => (
          <span key={i} className="block">{children}</span>
        ))}
      </motion.div>
    </div>
  );
};

export default ParallaxText;
