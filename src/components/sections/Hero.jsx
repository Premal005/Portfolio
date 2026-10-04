import React, { useRef, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Scene from '../3d/Scene';
import MagneticButton from '../ui/MagneticButton';
import SplitTextHover from '../ui/SplitTextHover';
import { useAppContext } from '../../context/AppContext';
import { useMousePosition } from '../../hooks/useMousePosition';

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
  const containerRef = useRef(null);
  const stickyRef = useRef(null);
  const textRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const overlayRef = useRef(null);

  const mouse = useMousePosition();
  const { setCursorVariant } = useAppContext();

  // Mouse-following orbs with different spring rates
  const orbX1 = useMotionValue(0);
  const orbY1 = useMotionValue(0);
  const orbX2 = useMotionValue(0);
  const orbY2 = useMotionValue(0);
  const orbX3 = useMotionValue(0);
  const orbY3 = useMotionValue(0);

  const s1x = useSpring(orbX1, { stiffness: 20, damping: 15, mass: 2 });
  const s1y = useSpring(orbY1, { stiffness: 20, damping: 15, mass: 2 });
  const s2x = useSpring(orbX2, { stiffness: 12, damping: 12, mass: 3 });
  const s2y = useSpring(orbY2, { stiffness: 12, damping: 12, mass: 3 });
  const s3x = useSpring(orbX3, { stiffness: 8, damping: 10, mass: 4 });
  const s3y = useSpring(orbY3, { stiffness: 8, damping: 10, mass: 4 });

  useEffect(() => {
    const cx = mouse.x - window.innerWidth / 2;
    const cy = mouse.y - window.innerHeight / 2;
    orbX1.set(cx * 0.3);
    orbY1.set(cy * 0.3);
    orbX2.set(cx * 0.5);
    orbY2.set(cy * 0.5);
    orbX3.set(cx * 0.7);
    orbY3.set(cy * 0.7);
  }, [mouse.x, mouse.y]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([line1Ref.current, line2Ref.current, line3Ref.current], {
        scale: 2.5, opacity: 0, y: 60, filter: 'blur(10px)',
      });
      gsap.set(subtitleRef.current, { y: 80, opacity: 0 });
      gsap.set(ctaRef.current, { y: 60, opacity: 0, scale: 0.8 });

      // Main scroll timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '80% top',
          scrub: 0.8,
          pin: false,
        },
      });

      // Phase 1: Text scales in dramatically (0-35%)
      tl.to(line1Ref.current, {
        scale: 1, opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.25, ease: 'power3.out',
      }, 0);
      tl.to(line2Ref.current, {
        scale: 1, opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.25, ease: 'power3.out',
      }, 0.05);
      tl.to(line3Ref.current, {
        scale: 1, opacity: 1, y: 0, filter: 'blur(0px)',
        duration: 0.25, ease: 'power3.out',
      }, 0.1);

      // Phase 2: Subtitle & CTA appear (35-55%)
      tl.to(subtitleRef.current, {
        y: 0, opacity: 1, duration: 0.15, ease: 'power2.out',
      }, 0.35);
      tl.to(ctaRef.current, {
        y: 0, opacity: 1, scale: 1, duration: 0.15, ease: 'back.out(1.7)',
      }, 0.4);

      // Phase 3: Everything exits up (65-100%)
      tl.to(textRef.current, {
        y: -200, opacity: 0, scale: 0.9, filter: 'blur(8px)',
        duration: 0.35, ease: 'power2.in',
      }, 0.65);

      // Scroll indicator
      gsap.to(scrollIndicatorRef.current, {
        y: 15, opacity: 0,
        duration: 1.8, repeat: -1, yoyo: true,
        ease: 'power2.inOut',
      });

      // Parallax overlay
      gsap.to(overlayRef.current, {
        opacity: 0.6,
        scrollTrigger: {
          trigger: containerRef.current,
          start: '60% top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={containerRef} className="h-[300vh] relative">
      <div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* 3D Scene - full background */}
        <div className="absolute inset-0 z-0">
          <Scene />
        </div>

        {/* Dark overlay that fades in on scroll */}
        <div ref={overlayRef} className="absolute inset-0 bg-black/0 z-[1] pointer-events-none" />

        {/* Mouse-following gradient orbs */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-1/2 left-1/2 w-[700px] h-[700px] rounded-full"
            style={{
              x: s1x, y: s1y,
              background: 'radial-gradient(circle, rgba(0,113,227,0.15) 0%, transparent 70%)',
              filter: 'blur(60px)',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full"
            style={{
              x: s2x, y: s2y,
              background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
              filter: 'blur(80px)',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full"
            style={{
              x: s3x, y: s3y,
              background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)',
              filter: 'blur(100px)',
              transform: 'translate(-50%, -50%)',
            }}
          />
        </div>

        {/* Main content */}
        <div
          ref={textRef}
          className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4"
        >
          {/* Line 1 */}
          <div ref={line1Ref} className="origin-center will-change-transform">
            <SplitTextHover
              text="CRAFTING"
              className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[11rem] xl:text-[13rem] font-black leading-[0.85] text-white tracking-tighter"
              repelRadius={120}
              repelStrength={25}
            />
          </div>

          {/* Line 2 */}
          <div ref={line2Ref} className="origin-center will-change-transform">
            <SplitTextHover
              text="DIGITAL"
              className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[11rem] xl:text-[13rem] font-black leading-[0.85] text-white tracking-tighter"
              repelRadius={120}
              repelStrength={25}
            />
          </div>

          {/* Line 3 - Gradient */}
          <div ref={line3Ref} className="origin-center will-change-transform">
            <span className="text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[11rem] xl:text-[13rem] font-black leading-[0.85] tracking-tighter gradient-text">
              EXPERIENCES
            </span>
          </div>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="mt-8 text-lg md:text-xl lg:text-2xl text-white/50 max-w-2xl font-light leading-relaxed"
          >
            Full Stack Developer blending creative design with technical excellence
            to build immersive digital products.
          </p>

          {/* CTA Buttons */}
          <div ref={ctaRef} className="mt-12 flex gap-4 flex-wrap justify-center">
            <MagneticButton
              variant="primary"
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            >
              View My Work →
            </MagneticButton>
            <MagneticButton
              variant="secondary"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Get In Touch
            </MagneticButton>
          </div>
        </div>

        {/* Scroll indicator */}
        <div ref={scrollIndicatorRef} className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-10">
          <span className="text-white/30 text-[10px] tracking-[0.3em] uppercase font-medium">Scroll to explore</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white/50 via-white/20 to-transparent" />
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black to-transparent z-[3] pointer-events-none" />
      </div>
    </section>
  );
};

export default Hero;
