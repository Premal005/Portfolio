import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS } from '../../utils/constants';
import { useAppContext } from '../../context/AppContext';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const { setCursorVariant, setCursorLabel } = useAppContext();

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header reveal
      gsap.fromTo(
        headerRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 85%',
          },
        }
      );

      // Stacking cards content animation
      gsap.utils.toArray('.project-stack-card').forEach((card) => {
        const content = card.querySelector('.card-content');
        const number = card.querySelector('.card-number');
        const image = card.querySelector('.card-image');

        gsap.fromTo(
          content,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 60%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        gsap.fromTo(
          number,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 65%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        if (image) {
          gsap.fromTo(
            image,
            { yPercent: -10 },
            {
              yPercent: 10,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={sectionRef} className="relative bg-black">
      {/* Sticky Intro Header */}
      <div className="h-screen flex flex-col justify-center items-center text-center sticky top-0 z-0 px-6">
        <div ref={headerRef} className="max-w-4xl">
          <span className="text-accent uppercase tracking-[0.3em] text-xs font-mono font-semibold mb-6 block">
            ✦ 03 // PORTFOLIO ARCHIVES
          </span>
          <h2 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black text-white tracking-tight uppercase leading-[0.9]">
            Featured <br />
            <span className="gradient-text">Productions</span>
          </h2>
          <p className="text-white/40 text-base md:text-xl font-light mt-6 max-w-lg mx-auto">
            Architected for massive scalability, exceptional interaction design, and fluid 3D graphics.
          </p>
        </div>
      </div>

      {/* Stacking Cards Container */}
      <div className="relative z-10 pb-[20vh]">
        {PROJECTS.map((project, i) => (
          <div
            key={project.id || i}
            className="project-stack-card sticky top-0 h-screen flex items-center justify-center px-4 md:px-8"
            style={{ zIndex: i + 10 }}
          >
            <div
              className="relative w-[92vw] md:w-[84vw] lg:w-[80vw] h-[82vh] rounded-[2rem] overflow-hidden group bg-surface border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.9)]"
              style={{
                transform: `scale(${1 - (PROJECTS.length - 1 - i) * 0.025})`,
                transformOrigin: 'top center',
              }}
              onMouseEnter={() => {
                setCursorVariant('hover');
                setCursorLabel('View');
              }}
              onMouseLeave={() => {
                setCursorVariant('default');
                setCursorLabel('');
              }}
            >
              {/* Background Image with Parallax */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="card-image absolute inset-0 w-full h-[125%] object-cover transition-transform duration-1000 group-hover:scale-105 opacity-80"
                />
              </div>

              {/* Multi-layered Vignette & Dark Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

              {/* Hover Highlight Ring */}
              <div className="absolute inset-0 rounded-[2rem] border border-white/0 group-hover:border-accent/40 transition-colors duration-500 pointer-events-none" />

              {/* Massive Project Index Number */}
              <span className="card-number text-white/[0.04] text-[12rem] md:text-[18rem] lg:text-[22rem] font-display font-black absolute -top-10 right-4 md:right-12 leading-none select-none pointer-events-none">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Card Meta & Details */}
              <div className="card-content absolute bottom-0 left-0 p-8 md:p-14 lg:p-16 w-full md:w-3/4 z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-[1px] bg-accent" />
                  <span className="text-accent text-xs font-mono uppercase tracking-[0.25em] font-semibold">
                    {project.category}
                  </span>
                  <span className="text-white/20 text-xs">•</span>
                  <span className="text-white/40 text-xs font-mono">2026 RELEASE</span>
                </div>

                <h3 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
                  {project.title}
                </h3>

                {/* Tech Tags */}
                <div className="flex gap-2.5 flex-wrap mb-8">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono font-medium text-white/80 bg-white/[0.06] backdrop-blur-md border border-white/10 rounded-full px-4 py-1.5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Link */}
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider group-hover:bg-accent group-hover:text-white transition-all duration-300">
                  <span>Explore Case Study</span>
                  <span className="text-sm">↗</span>
                </div>
              </div>

              {/* Precision Corner Accents */}
              <div className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-white/30 font-mono text-[10px] tracking-widest">
                <span className="text-accent">+</span>
                <span>PROJECT // {String(i + 1).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
