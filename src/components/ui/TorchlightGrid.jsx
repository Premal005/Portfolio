import React from 'react';
import { useMousePosition } from '../../hooks/useMousePosition';

const TorchlightGrid = () => {
  const { x, y } = useMousePosition();

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[1] overflow-hidden"
      style={{
        maskImage: `radial-gradient(circle 380px at ${x}px ${y}px, black 0%, transparent 80%)`,
        WebkitMaskImage: `radial-gradient(circle 380px at ${x}px ${y}px, black 0%, transparent 80%)`,
      }}
    >
      {/* Precision Blueprint Dot Matrix Grid */}
      <div
        className="w-full h-full opacity-35"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(0, 113, 227, 0.45) 1px, transparent 1px),
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 80px 80px, 80px 80px',
        }}
      />
    </div>
  );
};

export default TorchlightGrid;
