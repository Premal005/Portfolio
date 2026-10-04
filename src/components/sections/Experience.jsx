import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { EXPERIENCE } from '../../utils/constants';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.experience-card');
      
      // Horizontal scroll timeline
      const totalWidth = cards.length * window.innerWidth;
      
      const scrollTween = gsap.to(trackRef.current, {
        x: -totalWidth + window.innerWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: `+=${totalWidth}`,
        }
      });

      // Line draws itself
      gsap.fromTo(lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${totalWidth}`,
            scrub: true,
          }
        }
      );

      // Cards animate in
      cards.forEach((card, index) => {
        gsap.from(card, {
          x: 100,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: scrollTween,
            start: 'left 80%',
            toggleActions: 'play none none reverse',
          }
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="h-screen bg-black overflow-hidden relative">
      <div className="absolute top-20 left-20 z-20">
        <p className="text-accent uppercase tracking-widest text-sm font-semibold mb-4">Journey</p>
        <h2 className="text-5xl md:text-7xl font-bold text-white">Experience</h2>
      </div>

      {/* Large Background Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <span className="text-[12rem] md:text-[20rem] font-bold text-white opacity-[0.02] whitespace-nowrap">
          WORK HISTORY
        </span>
      </div>

      {/* Horizontal Track */}
      <div className="relative h-full flex items-center w-max z-10" ref={trackRef}>
        {/* Timeline Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-full bg-white/10" />
        <div ref={lineRef} className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-full bg-accent" />

        {EXPERIENCE.map((exp, index) => {
          const isAbove = index % 2 === 0;
          return (
            <div key={index} className="experience-card w-screen h-full flex flex-col justify-center relative">
              
              {/* Dot on timeline */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-accent z-20">
                <div className="absolute inset-0 rounded-full border-2 border-accent animate-ping opacity-50" />
              </div>

              {/* Card Content */}
              <div className={`absolute left-1/2 -translate-x-1/2 w-[90%] md:w-[600px] ${isAbove ? 'bottom-[55%]' : 'top-[55%]'}`}>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:bg-white/10 transition-colors duration-500 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-8">
                    <span className="text-6xl md:text-8xl font-bold text-white/5 transition-transform duration-500 group-hover:scale-110 group-hover:text-white/10">
                      {exp.year}
                    </span>
                  </div>
                  
                  <span className="text-accent font-bold text-xl mb-4 block">{exp.year}</span>
                  <h3 className="text-4xl font-bold text-white mb-2 relative z-10">{exp.role}</h3>
                  <h4 className="text-2xl text-white/70 mb-6 relative z-10">{exp.company}</h4>
                  <p className="text-white/50 text-lg leading-relaxed relative z-10">{exp.description}</p>
                </div>
              </div>

            </div>
          );
        })}
        
        {/* Padding at end */}
        <div className="w-[50vw] h-full" />
      </div>
    </section>
  );
};

export default Experience;
