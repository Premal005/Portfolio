import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InteractiveTerminal from '../ui/InteractiveTerminal';
import ParallaxText from '../ui/ParallaxText';
import SplitTextHover from '../ui/SplitTextHover';

gsap.registerPlugin(ScrollTrigger);

const StatItem = ({ number, label, suffix = '', subtext = '' }) => {
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
    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md flex flex-col justify-between group hover:border-accent/40 transition-colors duration-500">
      <div className="flex items-baseline justify-between mb-4">
        <span ref={numberRef} className="text-4xl md:text-5xl font-black text-white tracking-tight">
          0{suffix}
        </span>
        <span className="w-2 h-2 rounded-full bg-accent/60 group-hover:scale-150 transition-transform duration-300" />
      </div>
      <div>
        <h4 className="text-sm font-bold text-white/90 uppercase tracking-wider">{label}</h4>
        {subtext && <p className="text-xs text-white/40 mt-1 font-mono">{subtext}</p>}
      </div>
    </div>
  );
};

const About = () => {
  const containerRef = useRef(null);
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section id="about" ref={containerRef} className="relative min-h-screen py-32 px-6 md:px-14 lg:px-20">
        {/* Section Header */}
        <div ref={headerRef} className="max-w-4xl mb-20">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-[1px] bg-accent" />
            <span className="text-accent text-xs font-mono uppercase tracking-[0.3em] font-semibold">
              ✦ 01 // ARCHITECTURAL DOSSIER
            </span>
          </div>

          <SplitTextHover
            text="ENGINEERING & CRAFT"
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter block"
            repelRadius={90}
            repelStrength={18}
          />

          <p className="text-white/40 text-lg md:text-xl font-light mt-6 leading-relaxed max-w-2xl">
            Bridging raw computational performance with bespoke creative motion. Every interaction is
            engineered with sub-millisecond precision.
          </p>
        </div>

        {/* BENTO GRID 2.0 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Bento Cell 1: Interactive Cyber Terminal (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <InteractiveTerminal />
          </div>

          {/* Bento Cell 2: Global Telemetry & Radar Beacon (5 cols) */}
          <div className="lg:col-span-5 p-7 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden group hover:border-accent/40 transition-colors duration-500">
            {/* Background Radar Rings */}
            <div className="absolute -right-16 -top-16 w-64 h-64 border border-accent/15 rounded-full pointer-events-none group-hover:border-accent/30 transition-colors" />
            <div className="absolute -right-16 -top-16 w-48 h-48 border border-white/5 rounded-full pointer-events-none" />
            <div className="absolute -right-16 -top-16 w-32 h-32 border border-accent/20 rounded-full pointer-events-none" />

            <div>
              <div className="flex items-center justify-between text-[11px] font-mono text-white/40 tracking-widest uppercase mb-8">
                <span>BEACON // TELEMETRY</span>
                <span className="flex items-center gap-2 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  AVAILABLE
                </span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Global Operations
              </h3>
              <p className="text-sm text-white/50 leading-relaxed font-light mb-6">
                Operating remotely across global timezones. Ready to deploy specialized architecture for world-class
                teams and ambitious design systems.
              </p>
            </div>

            {/* Radar Coordinates Box */}
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs space-y-2">
              <div className="flex justify-between text-white/60">
                <span>BASE COORD:</span>
                <span className="text-accent font-bold">28.6139° N, 77.2090° E</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>DEPLOY STATUS:</span>
                <span className="text-emerald-400">READY_FOR_COMMISSION</span>
              </div>
              <div className="flex justify-between text-white/60">
                <span>PROTOCOL:</span>
                <span>HYBRID_REMOTE_SYNC</span>
              </div>
            </div>
          </div>

          {/* Bento Cell 3: Metrics & Stats Quad (12 cols) */}
          <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <StatItem
              number={5}
              suffix="+"
              label="Years Crafting"
              subtext="Continuous Production Experience"
            />
            <StatItem
              number={48}
              suffix="+"
              label="Products Shipped"
              subtext="Enterprise & High-Impact Startups"
            />
            <StatItem
              number={100}
              suffix="+"
              label="Shader Experiments"
              subtext="Custom GLSL & Procedural Physics"
            />
            <StatItem
              number={60}
              suffix=" FPS"
              label="Fluid Target"
              subtext="Strict Sub-16ms Frame Budgets"
            />
          </div>
        </div>
      </section>

      {/* Marquee Velocity Divider */}
      <div className="w-full py-10 border-y border-white/5 bg-black overflow-hidden relative z-30">
        <ParallaxText baseVelocity={-2.5} className="text-5xl md:text-8xl font-black text-white/[0.08] uppercase tracking-tighter">
          CREATIVE • ARCHITECTURE • THREE.JS • GLSL • REACT • SYSTEM DESIGN •
        </ParallaxText>
      </div>
    </>
  );
};

export default About;
