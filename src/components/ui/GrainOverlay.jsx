import React, { useEffect, useRef } from 'react';

const GrainOverlay = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 250;
    canvas.height = 250;
    const ctx = canvas.getContext('2d');
    
    // Generate noise
    const imgData = ctx.createImageData(canvas.width, canvas.height);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const color = Math.floor(Math.random() * 255);
      imgData.data[i] = color;
      imgData.data[i + 1] = color;
      imgData.data[i + 2] = color;
      imgData.data[i + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
    
    const bgUrl = canvas.toDataURL('image/png');
    
    if (containerRef.current) {
      containerRef.current.style.backgroundImage = `url(${bgUrl})`;
    }
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes grain-animation {
            0%, 100% { background-position: 0 0; }
            10% { background-position: -5% -10%; }
            20% { background-position: -15% 5%; }
            30% { background-position: 7% -25%; }
            40% { background-position: -5% 25%; }
            50% { background-position: -15% 10%; }
            60% { background-position: 15% 0%; }
            70% { background-position: 0% 15%; }
            80% { background-position: 3% 35%; }
            90% { background-position: -10% 10%; }
          }
        `}
      </style>
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-[9998]"
        style={{
          opacity: 0.035,
          mixBlendMode: 'overlay',
          animation: 'grain-animation 8s steps(10) infinite'
        }}
      />
    </>
  );
};

export default GrainOverlay;
