import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollColorTransition = () => {
  useEffect(() => {
    const sections = [
      { id: 'hero', color: '#000000' },
      { id: 'about', color: '#050510' },
      { id: 'projects', color: '#0a0008' },
      { id: 'skills', color: '#080012' },
      { id: 'experience', color: '#050510' },
      { id: 'contact', color: '#000000' }
    ];

    const triggers = [];

    sections.forEach(({ id, color }) => {
      const el = document.getElementById(id);
      if (el) {
        const trigger = ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => {
            gsap.to(document.documentElement, {
              '--bg-color': color,
              duration: 1,
              ease: 'power2.out'
            });
            gsap.to(document.body, {
              backgroundColor: color,
              duration: 1,
              ease: 'power2.out'
            });
          },
          onEnterBack: () => {
            gsap.to(document.documentElement, {
              '--bg-color': color,
              duration: 1,
              ease: 'power2.out'
            });
            gsap.to(document.body, {
              backgroundColor: color,
              duration: 1,
              ease: 'power2.out'
            });
          }
        });
        triggers.push(trigger);
      }
    });

    return () => {
      triggers.forEach(t => t.kill());
    };
  }, []);

  return null;
};

export default ScrollColorTransition;
