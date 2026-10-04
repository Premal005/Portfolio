import React, { useRef, useEffect, useCallback } from 'react';
import { useMousePosition } from '../../hooks/useMousePosition';

const SplitTextHover = ({ text, className = '', repelRadius = 100, repelStrength = 30 }) => {
  const containerRef = useRef(null);
  const charsRef = useRef([]);
  const { x: mouseX, y: mouseY } = useMousePosition();
  const rafRef = useRef(null);

  const animate = useCallback(() => {
    charsRef.current.forEach((char) => {
      if (!char) return;
      const rect = char.getBoundingClientRect();
      const charX = rect.left + rect.width / 2;
      const charY = rect.top + rect.height / 2;
      const dx = charX - mouseX;
      const dy = charY - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < repelRadius) {
        const force = (1 - distance / repelRadius) * repelStrength;
        const angle = Math.atan2(dy, dx);
        char.style.transform = `translate(${Math.cos(angle) * force}px, ${Math.sin(angle) * force}px)`;
      } else {
        char.style.transform = 'translate(0, 0)';
      }
    });
    rafRef.current = requestAnimationFrame(animate);
  }, [mouseX, mouseY, repelRadius, repelStrength]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return (
    <span ref={containerRef} className={className}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          ref={(el) => (charsRef.current[i] = el)}
          className="inline-block transition-transform duration-300 ease-out"
          style={{ willChange: 'transform' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
};

export default SplitTextHover;
