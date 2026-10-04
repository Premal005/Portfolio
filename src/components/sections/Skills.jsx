import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SKILL_DOMAINS = [
  {
    category: '01 // CREATIVE 3D & MOTION',
    description: 'Engineering spatial graphics, custom GLSL shaders, and buttery 60fps micro-animations.',
    skills: [
      { name: 'Three.js', tag: 'Core WebGL', level: '96%' },
      { name: 'React Three Fiber', tag: 'R3F / Drei', level: '94%' },
      { name: 'GLSL Shaders', tag: 'Vertex & Fragment', level: '90%' },
      { name: 'GSAP ScrollTrigger', tag: 'Choreography', level: '98%' },
      { name: 'Framer Motion', tag: 'Spring Physics', level: '95%' },
      { name: 'Lenis', tag: 'Inertia Smoothing', level: '92%' },
    ],
  },
  {
    category: '02 // FRONTEND & UI SYSTEMS',
    description: 'Crafting responsive, accessible, ultra-performant client-side architectures.',
    skills: [
      { name: 'React 18', tag: 'Concurrent Mode', level: '98%' },
      { name: 'TypeScript', tag: 'Type Safety', level: '95%' },
      { name: 'Next.js 14', tag: 'App Router / SSR', level: '92%' },
      { name: 'Tailwind CSS', tag: 'Design Tokens', level: '99%' },
      { name: 'Vite', tag: 'ESM Tooling', level: '94%' },
      { name: 'Figma to Code', tag: 'Pixel Perfection', level: '96%' },
    ],
  },
  {
    category: '03 // BACKEND & CLOUD SYSTEMS',
    description: 'Building secure, scalable API backbones and distributed database architectures.',
    skills: [
      { name: 'Node.js', tag: 'Runtime Engine', level: '92%' },
      { name: 'Express / REST', tag: 'API Gateway', level: '90%' },
      { name: 'PostgreSQL', tag: 'Relational DB', level: '88%' },
      { name: 'MongoDB', tag: 'NoSQL Schema', level: '90%' },
      { name: 'Docker', tag: 'Containerization', level: '85%' },
      { name: 'Git & CI/CD', tag: 'Automated Deploy', level: '94%' },
    ],
  },
];

const Skills = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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

      gsap.utils.toArray('.domain-card').forEach((card) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-32 bg-black relative">
      <div className="max-w-7xl mx-auto px-6 md:px-14 lg:px-20">
        {/* Header */}
        <div ref={headerRef} className="mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-accent" />
            <span className="text-accent text-xs font-mono uppercase tracking-[0.3em] font-semibold">
              ✦ 02 // TECHNICAL ARSENAL
            </span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-white tracking-tight uppercase">
            Specialized Skills
          </h2>

          <p className="text-white/40 text-lg font-light mt-4 max-w-xl">
            A comprehensive overview of production-tested technologies, libraries, and frameworks deployed across modern applications.
          </p>
        </div>

        {/* Domain Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SKILL_DOMAINS.map((domain, i) => (
            <div
              key={i}
              className="domain-card p-8 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-xl flex flex-col justify-between hover:border-accent/40 transition-colors duration-500 group"
            >
              <div>
                <span className="text-accent text-xs font-mono tracking-widest uppercase block mb-3 font-semibold">
                  {domain.category}
                </span>
                <p className="text-white/50 text-xs leading-relaxed mb-8 font-light">
                  {domain.description}
                </p>

                {/* Skill Items */}
                <div className="space-y-3">
                  {domain.skills.map((skill, j) => (
                    <div
                      key={j}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between group/item hover:bg-white/[0.06] hover:border-white/15 transition-all duration-300"
                    >
                      <div>
                        <div className="text-white font-medium text-sm group-hover/item:text-accent transition-colors">
                          {skill.name}
                        </div>
                        <div className="text-[10px] text-white/40 font-mono tracking-wider">
                          {skill.tag}
                        </div>
                      </div>
                      <span className="text-xs font-mono text-accent font-semibold px-2 py-0.5 rounded bg-accent/10">
                        {skill.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-white/30">
                <span>BENCHMARK // VERIFIED</span>
                <span className="text-emerald-400">READY</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
