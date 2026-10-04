import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const subtitleRef = useRef(null);
  const lineRef = useRef(null);
  const progressLineRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);

  const name = "YOUR NAME";
  
  useEffect(() => {
    let timeoutId;
    const tl = gsap.timeline({
      onComplete: () => {
        setIsExiting(true);
        timeoutId = setTimeout(() => {
          if (onComplete) onComplete();
        }, 800);
      }
    });

    // Initial setup
    gsap.set(lineRef.current, { scaleX: 0, width: 200 });
    gsap.set(progressLineRef.current, { scaleX: 0 });
    const chars = textRef.current?.querySelectorAll('.char-inner');
    if (chars) gsap.set(chars, { y: '120%' });
    if (subtitleRef.current) gsap.set(subtitleRef.current, { opacity: 0, y: 10 });

    // Stage 1 (0-0.5s): Horizontal line grows
    tl.to(lineRef.current, {
      scaleX: 1,
      duration: 0.5,
      ease: "power2.inOut"
    }, 0);

    // Stage 2 (0.5-2s): Counter and bottom progress bar
    const counterObj = { val: 0 };
    tl.to(counterObj, {
      val: 100,
      duration: 1.5,
      ease: "power2.inOut",
      onUpdate: () => setProgress(Math.round(counterObj.val))
    }, 0.5);

    tl.to(progressLineRef.current, {
      scaleX: 1,
      duration: 1.5,
      ease: "power2.inOut"
    }, 0.5);

    // Stage 3 (2-3s): Line expands, Name and Subtitle appear
    tl.to(lineRef.current, {
      width: '100vw',
      duration: 1,
      ease: "power3.inOut"
    }, 2);

    if (chars) {
      tl.to(chars, {
        y: "0%",
        duration: 0.8,
        stagger: 0.04,
        ease: "power3.out" // or CustomEase if registered
      }, 2.2);
    }

    if (subtitleRef.current) {
      tl.to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, 2.5);
    }

    // Stage 4 (3-4s): Scale up and blur
    tl.to(containerRef.current, {
      scale: 1.1,
      filter: "blur(20px)",
      opacity: 0,
      duration: 1,
      ease: "power2.inOut"
    }, 3);

    return () => {
      tl.kill();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          ref={containerRef}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-black text-white flex flex-col justify-center items-center overflow-hidden"
        >
          {/* Center Line */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] flex justify-center">
            <div ref={lineRef} className="h-full bg-white origin-center" />
          </div>

          {/* Name & Subtitle */}
          <div className="relative z-10 flex flex-col items-center">
            <div ref={textRef} className="flex text-4xl md:text-6xl font-bold uppercase tracking-widest overflow-hidden">
              {name.split('').map((char, i) => (
                <div key={i} className="overflow-hidden">
                  <div className="char-inner inline-block" style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}>
                    {char}
                  </div>
                </div>
              ))}
            </div>
            <div ref={subtitleRef} className="mt-4 text-sm md:text-base font-light tracking-[0.3em] text-white/70">
              CREATIVE DEVELOPER
            </div>
          </div>

          {/* Bottom Right Counter */}
          <div className="absolute bottom-8 right-8 text-[8rem] font-bold text-white font-mono tracking-tighter leading-none">
            {progress}
          </div>

          {/* Bottom Progress Line */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10 origin-left">
            <div
              ref={progressLineRef}
              className="w-full h-full bg-white scale-x-0 origin-left"
            ></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
