import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import Scene from '../3d/Scene';
import MagneticButton from '../ui/MagneticButton';
import CinematicTitleTyping from '../ui/CinematicTitleTyping';
import TypewriterRole from '../ui/TypewriterRole';
import { useAppContext } from '../../context/AppContext';

const Hero = () => {
  const { setCursorVariant } = useAppContext();

  useEffect(() => {
    // Subtle pulsating scroll indicator
    const tween = gsap.fromTo(
      '.hero-scroll-indicator',
      { y: 0, opacity: 0.3 },
      { y: 8, opacity: 1, repeat: -1, yoyo: true, duration: 1.5, ease: 'power1.inOut', delay: 1 }
    );

    return () => tween.kill();
  }, []);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
      {/* 1. 3D WebGL Canvas Backdrop - Front and Center */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* 2. Soft Bottom Gradient Vignette only */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent pointer-events-none z-[1]" />

      {/* 3. Hero Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col items-center text-center pointer-events-none">
        {/* Status Capsule Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-5 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-xl pointer-events-auto"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-mono tracking-widest text-white/80 uppercase">
            Premal Goyal // Full Stack & Creative 3D Engineer
          </span>
        </motion.div>

        {/* 3D Fly-In Out-of-Screen Words with Typing Effect */}
        <div className="pointer-events-auto">
          <CinematicTitleTyping />
        </div>

        {/* Dynamic Interactive Typewriter Engine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="mt-6 pointer-events-auto"
        >
          <TypewriterRole />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.0 }}
          className="mt-5 text-sm sm:text-base md:text-lg text-white/60 max-w-xl font-light leading-relaxed pointer-events-auto"
        >
          Blending computational engineering with cinematic 3D motion to build bespoke,
          high-performance digital systems.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 2.2 }}
          className="mt-8 flex items-center gap-4 flex-wrap justify-center pointer-events-auto"
        >
          <MagneticButton
            variant="primary"
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View My Work ↓
          </MagneticButton>
          <MagneticButton
            variant="secondary"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Get In Touch ↗
          </MagneticButton>
        </motion.div>
      </div>

      {/* 4. Elegant Scroll Indicator */}
      <div className="hero-scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none">
        <span className="text-white/40 text-[9px] font-mono tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-[1px] h-10 bg-gradient-to-b from-white/60 to-transparent" />
      </div>
    </section>
  );
};

export default Hero;
