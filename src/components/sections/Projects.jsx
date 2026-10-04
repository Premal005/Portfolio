import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '../../utils/constants';
import { useAppContext } from '../../context/AppContext';
import SplitTextHover from '../ui/SplitTextHover';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const { setCursorVariant, setCursorLabel } = useAppContext();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(headerRef.current, 
        { y: 100, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 85%' },
        }
      );

      // Each stacking card
      gsap.utils.toArray('.project-stack-card').forEach((card, i) => {
        const content = card.querySelector('.card-content');
        const number = card.querySelector('.card-number');
        const image = card.querySelector('.card-image');

        // Content slides up
        gsap.fromTo(content,
          { y: 120, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 55%', toggleActions: 'play none none reverse' },
          }
        );

        // Number fades in
        gsap.fromTo(number,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 60%', toggleActions: 'play none none reverse' },
          }
        );

        // Parallax on image
        gsap.fromTo(image,
          { yPercent: -15, scale: 1.15 },
          {
            yPercent: 15, ease: 'none',
            scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="relative">
      {/* Section header - sticky intro */}
      <div className="h-screen flex flex-col justify-center items-center text-center sticky top-0 z-0">
        <div ref={headerRef}>
          <span className="text-accent uppercase tracking-[0.3em] text-xs font-semibold mb-6 block">
            ✦ Selected Work
          </span>
          <SplitTextHover
            text="Featured Projects"
            className="text-5xl md:text-7xl lg:text-9xl font-black text-white tracking-tight"
            repelRadius={80}
            repelStrength={15}
          />
          <p className="text-white/30 text-lg mt-6 max-w-md mx-auto">
            A curated selection of my recent work
          </p>
        </div>
      </div>

      {/* Stacking cards */}
      <div className="relative z-10">
        {PROJECTS.map((project, i) => (
          <div
            key={project.id}
            className="project-stack-card sticky top-0 h-screen flex items-center justify-center px-4"
            style={{ zIndex: i + 10 }}
          >
            <div
              className="relative w-[92vw] md:w-[85vw] lg:w-[80vw] h-[85vh] rounded-[2rem] overflow-hidden group"
              style={{
                transform: `scale(${1 - (PROJECTS.length - 1 - i) * 0.03})`,
                transformOrigin: 'top center',
                boxShadow: '0 25px 80px rgba(0,0,0,0.8)',
              }}
              onMouseEnter={() => { setCursorVariant('hover'); setCursorLabel('View'); }}
              onMouseLeave={() => { setCursorVariant('default'); setCursorLabel(''); }}
            >
              {/* Image with parallax */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="card-image absolute inset-0 w-full h-[130%] object-cover transition-transform duration-1000 group-hover:scale-105"
                />
              </div>

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

              {/* Animated border on hover */}
              <div className="absolute inset-0 rounded-[2rem] border border-white/0 group-hover:border-white/10 transition-colors duration-700" />

              {/* Large number */}
              <span className="card-number text-white/[0.04] text-[12rem] md:text-[18rem] lg:text-[22rem] font-black absolute -top-8 right-4 md:right-12 leading-none select-none pointer-events-none">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Content */}
              <div className="card-content absolute bottom-0 left-0 p-8 md:p-16 lg:p-20 w-full md:w-2/3">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-[1px] bg-accent" />
                  <span className="text-accent text-xs uppercase tracking-[0.2em] font-semibold">
                    {project.category}
                  </span>
                </div>
                
                <h3 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-6">
                  {project.title}
                </h3>
                
                <div className="flex gap-2 flex-wrap">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium text-white/80 bg-white/10 backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5 hover:bg-white/20 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Explore link */}
                <div className="mt-8 flex items-center gap-2 text-white/50 group-hover:text-white transition-colors duration-500">
                  <span className="text-sm font-medium tracking-wide">Explore Project</span>
                  <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute top-8 left-8 md:top-12 md:left-12">
                <div className="w-3 h-3 border-t border-l border-white/20" />
              </div>
              <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
                <div className="w-3 h-3 border-b border-r border-white/20" />
              </div>
            </div>
          </div>
        ))}

        {/* End spacer */}
        <div className="h-[50vh]" />
      </div>
    </section>
  );
};

export default Projects;
