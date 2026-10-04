import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SKILL_ROWS = [
  [
    { name: 'React', icon: '⚛️' }, { name: 'Node.js', icon: '🟢' }, { name: 'Three.js', icon: '🔺' }, 
    { name: 'TypeScript', icon: '📘' }, { name: 'Next.js', icon: '▲' }, { name: 'Python', icon: '🐍' }, 
    { name: 'GraphQL', icon: '🕸️' }, { name: 'Docker', icon: '🐳' }, { name: 'Rust', icon: '🦀' }, { name: 'Go', icon: '🐹' }
  ],
  [
    { name: 'GSAP', icon: '💚' }, { name: 'Framer Motion', icon: '🌊' }, { name: 'Tailwind CSS', icon: '💨' }, 
    { name: 'Figma', icon: '🎨' }, { name: 'PostgreSQL', icon: '🐘' }, { name: 'Redis', icon: '🔴' }, 
    { name: 'AWS', icon: '☁️' }, { name: 'Kubernetes', icon: '☸️' }, { name: 'Terraform', icon: '🏗️' }, { name: 'Linux', icon: '🐧' }
  ],
  [
    { name: 'WebGL', icon: '🧊' }, { name: 'GLSL', icon: '✨' }, { name: 'React Native', icon: '📱' }, 
    { name: 'Vue.js', icon: '💚' }, { name: 'Svelte', icon: '🔥' }, { name: 'Express', icon: '🚂' }, 
    { name: 'MongoDB', icon: '🍃' }, { name: 'Firebase', icon: '🔥' }, { name: 'Prisma', icon: '💎' }, { name: 'tRPC', icon: '🔄' }
  ]
];

const Skills = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Velocity-based scroll speed
      let scrollVelocity = 0;
      let lastScroll = window.scrollY;

      const updateScrollVelocity = () => {
        const currentScroll = window.scrollY;
        scrollVelocity = Math.abs(currentScroll - lastScroll);
        lastScroll = currentScroll;
        
        // Map velocity to speed factor
        const speedFactor = 1 + Math.min(scrollVelocity * 0.05, 5);
        
        gsap.to('.skill-row-inner', {
          timeScale: speedFactor,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto'
        });

        // Reset speed to normal when scroll stops
        gsap.to('.skill-row-inner', {
          timeScale: 1,
          duration: 1.5,
          delay: 0.1,
          ease: 'power2.out',
          overwrite: 'auto'
        });
      };

      window.addEventListener('scroll', updateScrollVelocity);
      
      // Initial infinite scroll animations for rows
      const rows = gsap.utils.toArray('.skill-row-inner');
      rows.forEach((row, i) => {
        const direction = i % 2 !== 0 ? 1 : -1;
        const duration = i === 0 ? 30 : i === 1 ? 25 : 35;
        
        gsap.to(row, {
          xPercent: direction * -50,
          ease: "none",
          duration: duration,
          repeat: -1,
        });
      });
      
      return () => {
        window.removeEventListener('scroll', updateScrollVelocity);
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={sectionRef} className="py-40 bg-black overflow-hidden relative">
      <div className="container mx-auto px-6 mb-24 text-center">
        <p className="text-accent uppercase tracking-widest text-sm font-semibold mb-4">Capabilities</p>
        <h2 className="text-5xl md:text-7xl font-bold text-white">Skills & Arsenal</h2>
      </div>

      <div className="flex flex-col gap-8 relative z-10 w-full overflow-hidden">
        {SKILL_ROWS.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className={`flex whitespace-nowrap overflow-visible py-4 hover:[&_.skill-row-inner]:[animation-play-state:paused]`}
          >
            <div className="skill-row-inner flex gap-6 w-max" style={{ width: 'fit-content' }}>
              {[...Array(4)].map((_, i) => (
                <React.Fragment key={i}>
                  {row.map((skill, j) => (
                    <div 
                      key={`${i}-${j}`} 
                      className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-8 py-4 flex items-center gap-4 transition-all duration-300 hover:scale-115 hover:border-accent hover:bg-white/10 cursor-pointer relative"
                    >
                      <span className="text-2xl">{skill.icon}</span>
                      <span className="text-white text-xl font-medium">{skill.name}</span>
                      
                      {/* Tooltip */}
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1.5 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        Expert
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
