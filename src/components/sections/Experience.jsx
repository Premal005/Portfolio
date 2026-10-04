import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EXPERIENCE } from '../../utils/constants';

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.experience-card');
      const totalScroll = (cards.length - 1) * window.innerWidth;

      const scrollTween = gsap.to(trackRef.current, {
        x: -totalScroll,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: `+=${totalScroll + 600}`,
        },
      });

      // Timeline progress line draws itself
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          transformOrigin: 'left center',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${totalScroll + 600}`,
            scrub: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className="h-screen bg-black overflow-hidden relative">
      {/* Fixed Section Header */}
      <div className="absolute top-12 left-8 md:top-20 md:left-20 z-20">
        <span className="text-accent uppercase tracking-[0.3em] text-xs font-mono font-semibold mb-3 block">
          ✦ 03 // CAREER TRAJECTORY
        </span>
        <h2 className="text-4xl md:text-7xl font-display font-black text-white tracking-tight uppercase">
          Work History
        </h2>
      </div>

      {/* Large Background Faded Typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden select-none">
        <span className="text-[14vw] font-display font-black text-white/[0.02] whitespace-nowrap">
          EXPERIENCE
        </span>
      </div>

      {/* Horizontal Moving Track */}
      <div className="relative h-full flex items-center w-max z-10" ref={trackRef}>
        {/* Timeline Center Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-full bg-white/10" />
        <div ref={lineRef} className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-full bg-accent" />

        {EXPERIENCE.map((exp, index) => {
          const isAbove = index % 2 === 0;
          return (
            <div key={index} className="experience-card w-screen h-full flex flex-col justify-center relative px-6 md:px-20">
              {/* Dot Beacon on timeline */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-accent z-20 shadow-[0_0_20px_#0071e3]">
                <div className="absolute inset-0 rounded-full border-2 border-accent animate-ping opacity-60" />
              </div>

              {/* Card Container */}
              <div className={`absolute left-1/2 -translate-x-1/2 w-[90%] sm:w-[540px] md:w-[620px] ${isAbove ? 'bottom-[56%]' : 'top-[56%]'}`}>
                <div className="p-8 sm:p-10 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl hover:border-accent/40 transition-colors duration-500 relative overflow-hidden group">
                  <span className="text-5xl sm:text-7xl font-display font-black text-white/[0.05] absolute top-4 right-8 select-none pointer-events-none">
                    {exp.year}
                  </span>

                  <span className="text-accent text-xs font-mono font-semibold tracking-widest uppercase block mb-3">
                    {exp.year}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-1.5">{exp.role}</h3>
                  <h4 className="text-lg text-white/70 font-sans mb-4">{exp.company}</h4>
                  <p className="text-white/50 text-sm sm:text-base leading-relaxed font-light">{exp.description}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* End spacing */}
        <div className="w-[30vw] h-full" />
      </div>
    </section>
  );
};

export default Experience;
