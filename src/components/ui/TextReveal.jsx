import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TextReveal = ({ text = '', className = '' }) => {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el || !text) return;

    let ctx = gsap.context(() => {
      const words = el.querySelectorAll('.reveal-word');
      
      gsap.fromTo(words, 
        { opacity: 0.05, y: 5, color: 'rgba(255, 255, 255, 0.05)' },
        {
          opacity: 1,
          y: 0,
          color: 'rgba(255, 255, 255, 0.7)',
          stagger: 0.02,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'bottom 50%',
            scrub: true,
          }
        }
      );
    }, el);

    return () => {
      ctx.revert();
    };
  }, [text]);

  if (!text) return null;

  return (
    <div ref={textRef} className={`flex flex-wrap ${className}`}>
      {text.split(' ').map((word, index) => (
        <span key={index} className="reveal-word inline-block mr-2 mb-2">
          {word}
        </span>
      ))}
    </div>
  );
};

export default TextReveal;
