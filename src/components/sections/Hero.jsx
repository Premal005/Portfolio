import React, { useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Scene from '../3d/Scene';
import MagneticButton from '../ui/MagneticButton';
import { useAppContext } from '../../context/AppContext';
import { useMousePosition } from '../../hooks/useMousePosition';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const contentRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const title3Ref = useRef(null);
  const badgeRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const metricsRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  const mouse = useMousePosition();
  const { setCursorVariant } = useAppContext();

  // Mouse-following smooth ambient orbs
  const orbX1 = useMotionValue(0);
  const orbY1 = useMotionValue(0);
  const orbX2 = useMotionValue(0);
  const orbY2 = useMotionValue(0);

  const s1x = useSpring(orbX1, { stiffness: 25, damping: 18, mass: 1.5 });
  const s1y = useSpring(orbY1, { stiffness: 25, damping: 18, mass: 1.5 });
  const s2x = useSpring(orbX2, { stiffness: 15, damping: 14, mass: 2.5 });
  const s2y = useSpring(orbY2, { stiffness: 15, damping: 14, mass: 2.5 });

  useEffect(() => {
    const cx = mouse.x - window.innerWidth / 2;
    const cy = mouse.y - window.innerHeight / 2;
    orbX1.set(cx * 0.35);
    orbY1.set(cy * 0.35);
    orbX2.set(cx * 0.55);
    orbY2.set(cy * 0.55);
  }, [mouse.x, mouse.y, orbX1, orbX2, orbY1, orbY2]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Kinetic Entrance Reveal
      const enterTl = gsap.timeline({ delay: 0.2 });
      enterTl.fromTo(
        badgeRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
      enterTl.fromTo(
        [title1Ref.current, title2Ref.current, title3Ref.current],
        { y: 80, opacity: 0, skewY: 4 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.2, stagger: 0.12, ease: 'power4.out' },
        '-=0.5'
      );
      enterTl.fromTo(
        [subtitleRef.current, ctaRef.current, metricsRef.current],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out' },
        '-=0.6'
      );

      // Scroll choreography tied to 250vh scroll distance
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      scrollTl.to(contentRef.current, {
        y: -180,
        opacity: 0,
        scale: 0.94,
        filter: 'blur(10px)',
        ease: 'none',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={containerRef} className="h-[240vh] relative bg-black">
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        {/* 1. 3D WebGL Canvas Layer */}
        <div className="absolute inset-0 z-0">
          <Scene />
        </div>

        {/* 2. Soft Mouse-Reactive Ambient Light Fields */}
        <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-1/2 left-1/2 w-[750px] h-[750px] rounded-full pointer-events-none"
            style={{
              x: s1x,
              y: s1y,
              background: 'radial-gradient(circle, rgba(0,113,227,0.18) 0%, transparent 65%)',
              filter: 'blur(70px)',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-[550px] h-[550px] rounded-full pointer-events-none"
            style={{
              x: s2x,
              y: s2y,
              background: 'radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 65%)',
              filter: 'blur(90px)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        {/* 3. Hero Content */}
        <div
          ref={contentRef}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center will-change-transform pt-12 md:pt-0"
        >
          {/* Status Capsule Badge */}
          <div ref={badgeRef} className="mb-8 inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono tracking-widest text-white/70 uppercase">
              Premal Goyal // Full Stack & Creative 3D Engineer
            </span>
          </div>

          {/* Majestic Display Headline */}
          <h1 className="font-display font-black tracking-[-0.04em] leading-[0.88] text-white flex flex-col items-center">
            <span ref={title1Ref} className="text-5xl sm:text-7xl md:text-9xl lg:text-[10.5rem] xl:text-[12rem] block uppercase">
              ARCHITECTING
            </span>
            <span ref={title2Ref} className="text-5xl sm:text-7xl md:text-9xl lg:text-[10.5rem] xl:text-[12rem] block uppercase">
              THE DIGITAL
            </span>
            <span
              ref={title3Ref}
              className="text-5xl sm:text-7xl md:text-9xl lg:text-[10.5rem] xl:text-[12rem] block uppercase gradient-text"
            >
              EXPERIENCES
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mt-8 text-base sm:text-lg md:text-2xl text-white/50 max-w-2xl font-sans font-light leading-relaxed tracking-normal"
          >
            Engineering bespoke web systems, interactive 3D WebGL experiences, and cloud-native software
            with relentless attention to craft and speed.
          </p>

          {/* Call to Actions */}
          <div ref={ctaRef} className="mt-10 flex items-center gap-4 flex-wrap justify-center">
            <MagneticButton
              variant="primary"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Projects ↓
            </MagneticButton>
            <MagneticButton
              variant="secondary"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Initialize Contact ↗
            </MagneticButton>
          </div>

          {/* Bottom Telemetry Strip in Hero */}
          <div
            ref={metricsRef}
            className="mt-14 hidden md:flex items-center gap-8 text-[11px] font-mono text-white/30 tracking-[0.2em] border-t border-white/10 pt-6"
          >
            <span>[05+ YEARS PRODUCTION]</span>
            <span className="text-white/15">•</span>
            <span>[REACT 18 & THREE.JS CORE]</span>
            <span className="text-white/15">•</span>
            <span>[SUB-16MS 60FPS TARGET]</span>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div ref={scrollIndicatorRef} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 pointer-events-none">
          <div className="w-5 h-9 rounded-full border border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1 h-2 rounded-full bg-accent animate-bounce" />
          </div>
          <span className="text-white/30 text-[9px] font-mono uppercase tracking-[0.25em]">SCROLL</span>
        </div>

        {/* Bottom Fade Gradient */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black to-transparent z-[2] pointer-events-none" />
      </div>
    </section>
  );
};

export default Hero;
