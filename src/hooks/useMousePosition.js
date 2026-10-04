import { useState, useEffect } from 'react';

export const useMousePosition = () => {
  const [position, setPosition] = useState({ x: null, y: null });

  useEffect(() => {
    const update = (e) => setPosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', update, { passive: true });
    return () => window.removeEventListener('mousemove', update);
  }, []);

  return position;
};
