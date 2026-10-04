import React, { useRef, useEffect, useState } from 'react';

const CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

const TextScramble = ({ text, className = '', as: Component = 'span', triggerOnView = false, speed = 30 }) => {
  const elementRef = useRef(null);
  const frameRef = useRef(null);
  const [inView, setInView] = useState(!triggerOnView);
  const queueRef = useRef([]);
  const frameCounterRef = useRef(0);

  useEffect(() => {
    if (triggerOnView) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      if (elementRef.current) {
        observer.observe(elementRef.current);
      }
      return () => observer.disconnect();
    }
  }, [triggerOnView]);

  const scramble = () => {
    if (!text) return;
    
    queueRef.current = [];
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const start = Math.floor(Math.random() * 5); // start frame
      const end = start + Math.floor(Math.random() * 5) + 5; // end frame
      queueRef.current.push({ char, start, end, current: '' });
    }
    
    cancelAnimationFrame(frameRef.current);
    frameCounterRef.current = 0;
    update();
  };

  const update = () => {
    let output = '';
    let complete = 0;
    const frame = frameCounterRef.current;

    for (let i = 0; i < queueRef.current.length; i++) {
      const item = queueRef.current[i];
      if (frame >= item.end) {
        complete++;
        output += item.char;
      } else if (frame >= item.start) {
        if (!item.current || Math.random() < 0.5) {
          item.current = CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        output += item.current;
      } else {
        output += '';
      }
    }

    if (elementRef.current) {
      elementRef.current.innerText = output;
    }

    if (complete === queueRef.current.length) {
      cancelAnimationFrame(frameRef.current);
    } else {
      frameCounterRef.current++;
      setTimeout(() => {
        frameRef.current = requestAnimationFrame(update);
      }, speed);
    }
  };

  useEffect(() => {
    if (inView) {
      scramble();
    }
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, text]);

  const handleMouseEnter = () => {
    if (!triggerOnView) {
      scramble();
    }
  };

  return (
    <Component 
      ref={elementRef} 
      className={className} 
      onMouseEnter={handleMouseEnter}
    >
      {text}
    </Component>
  );
};

export default TextScramble;
