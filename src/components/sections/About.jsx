import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TextReveal from '../ui/TextReveal';
import ParallaxText from '../ui/ParallaxText';

gsap.registerPlugin(ScrollTrigger);

const Stat = ({ number, label, suffix = '' }) => {
  const numberRef = useRef(null);

  useEffect(() => {
    const el = numberRef.current;
    const counter = { val: 0 };

    const tween = gsap.to(counter, {
      val: number,
      duration: 2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
      },
      onUpdate: () => {
        if (el) el.innerText = Math.ceil(counter.val) + suffix;
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [number, suffix]);

  return (
    <div className="flex flex-col gap-2">
      <span ref={numberRef} className="text-5xl sm:text-6xl md:text-7xl font-display font-black text-white tracking-tight">
        0{suffix}
      </span>
      <span className="text-white/40 text-xs sm:text-sm font-mono uppercase tracking-widest">{label}</span>
    </div>
  );
};

const About = () => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section id="about" ref={sectionRef} className="relative min-h-screen py-36 px-6 md:px-14 lg:px-20 bg-black">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div ref={headerRef} className="mb-20">
            <span className="text-accent uppercase tracking-[0.3em] text-xs font-mono font-semibold mb-4 block">
              ✦ 01 // ABOUT ME
            </span>
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black text-white tracking-tight leading-[1.05]">
              Engineering things <br />
              <span className="gradient-text">for the modern web.</span>
            </h2>
          </div>

          {/* Word-by-Word Scroll Reveal Statement */}
          <div className="mb-24 max-w-4xl">
            <TextReveal
              text="I am a Full Stack Developer & Creative Technologist specializing in building exceptional, ultra-responsive digital products. I combine computational engineering with cinematic 3D motion to turn complex challenges into seamless, unforgettable web experiences."
              className="text-2xl sm:text-3xl md:text-4xl font-light text-white leading-relaxed"
            />
          </div>

          {/* Stats Quad */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-14 border-y border-white/10 mb-24">
            <Stat number={5} suffix="+" label="Years Experience" />
            <Stat number={48} suffix="+" label="Products Shipped" />
            <Stat number={100} suffix="+" label="Shader & Motion Tests" />
            <Stat number={60} suffix=" FPS" label="Performance Standard" />
          </div>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
              <span className="text-accent text-xs font-mono tracking-widest block mb-4">01 // CREATIVE MOTION</span>
              <h3 className="text-2xl font-bold text-white mb-3">Fluid Physics</h3>
              <p className="text-white/50 text-sm leading-relaxed font-light">
                Choreographing silky smooth transitions, spring physics, and natural kinetic feedback with GSAP and Framer Motion.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
              <span className="text-accent text-xs font-mono tracking-widest block mb-4">02 // SPATIAL GRAPHICS</span>
              <h3 className="text-2xl font-bold text-white mb-3">3D WebGL</h3>
              <p className="text-white/50 text-sm leading-relaxed font-light">
                Crafting custom GLSL vertex/fragment shaders, procedural geometries, and optimized particle systems with Three.js.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl">
              <span className="text-accent text-xs font-mono tracking-widest block mb-4">03 // ARCHITECTURE</span>
              <h3 className="text-2xl font-bold text-white mb-3">Clean Code</h3>
              <p className="text-white/50 text-sm leading-relaxed font-light">
                Building scalable, maintainable frontends and robust API systems with React 18, Next.js, TypeScript, and Node.js.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Divider */}
      <div className="w-full py-10 border-y border-white/5 bg-black overflow-hidden relative z-20">
        <ParallaxText baseVelocity={-2.5} className="text-5xl md:text-8xl font-display font-black text-white/[0.07] uppercase tracking-tighter">
          CREATIVE • ARCHITECTURE • THREE.JS • GLSL • REACT • SYSTEM DESIGN •
        </ParallaxText>
      </div>
    </>
  );
};

export default About;
