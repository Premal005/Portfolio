import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
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
        start: 'top 80%',
      },
      onUpdate: () => {
        el.innerText = Math.ceil(counter.val) + suffix;
      }
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [number, suffix]);

  return (
    <div className="flex flex-col gap-1">
      <span ref={numberRef} className="text-6xl md:text-7xl font-bold text-white">0</span>
      <span className="text-white/50 text-sm uppercase tracking-wider">{label}</span>
    </div>
  );
};

const About = () => {
  const sectionRef = useRef(null);
  const stickyRef = useRef(null);
  const imageContainerRef = useRef(null);
  const contentRef = useRef(null);
  const textWordsRef = useRef([]);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
        }
      });

      // Phase 1 (0-40%): Image reveals from invisible point to fully visible
      tl.fromTo(imageContainerRef.current,
        { clipPath: 'inset(50% 50% 50% 50%)', scale: 1.2 },
        { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 0.4, ease: 'none' },
        0
      );

      // Phase 2 (40-70%): Image scales down and moves left. Text fades in on right.
      tl.to(imageContainerRef.current, {
        width: '40vw',
        x: '-25vw',
        duration: 0.3,
        ease: 'power2.inOut'
      }, 0.4);

      tl.fromTo(contentRef.current, {
        opacity: 0,
        x: 50,
      }, {
        opacity: 1,
        x: 0,
        duration: 0.3,
        ease: 'power2.out'
      }, 0.45);

      // Words reveal inside the paragraph
      tl.fromTo(textWordsRef.current, {
        opacity: 0,
        y: 20
      }, {
        opacity: 1,
        y: 0,
        stagger: 0.01,
        duration: 0.2,
        ease: 'power1.out'
      }, 0.5);

      // Phase 3 (70-100%): Stats and remainder fully visible
      // (Stats will trigger their own counters when they enter viewport, 
      // but their container fades in here)
    }, sectionRef);
    
    return () => ctx.revert();
  }, []);

  const bioText = "I am a passionate frontend developer specializing in building premium, interactive digital experiences. With a strong foundation in modern web technologies and a keen eye for design, I transform complex problems into elegant, user-friendly solutions.";
  const words = bioText.split(" ");

  return (
    <>
      <section id="about" ref={sectionRef} className="min-h-[200vh] relative bg-black">
        <div ref={stickyRef} className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          
          {/* Image Placeholder */}
          <div 
            ref={imageContainerRef} 
            className="absolute z-10 w-[60vw] aspect-video md:aspect-square md:w-[60vw] max-h-[80vh] bg-gradient-to-br from-accent/30 to-purple-500/30 rounded-2xl flex items-center justify-center"
          >
            <span className="text-white font-bold text-4xl tracking-widest">YOUR PHOTO</span>
          </div>

          {/* Right Content Area (Hidden initially, slides in) */}
          <div 
            ref={contentRef} 
            className="absolute right-[5vw] w-[45vw] opacity-0 flex flex-col justify-center z-20"
          >
            <span className="uppercase tracking-widest text-accent text-sm font-semibold mb-4 block">
              About Me
            </span>
            
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
              I build things for the web.
            </h2>

            <div className="text-xl md:text-3xl text-white/70 font-light leading-relaxed mb-16 flex flex-wrap gap-x-2">
              {words.map((word, i) => (
                <span 
                  key={i} 
                  ref={el => textWordsRef.current[i] = el}
                  className="opacity-0 inline-block"
                >
                  {word}
                </span>
              ))}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-8 w-full border-t border-white/10 pt-8">
              <Stat number={5} label="Years Exp." suffix="+" />
              <Stat number={50} label="Projects" suffix="+" />
              <Stat number={10} label="Awards" />
            </div>
          </div>

        </div>
      </section>

      {/* Marquee Divider */}
      <div className="w-full py-8 border-y border-white/5 bg-black overflow-hidden relative z-30">
        <ParallaxText baseVelocity={-2}>
          CREATIVE • DEVELOPER • DESIGNER • ENGINEER • 
        </ParallaxText>
      </div>
    </>
  );
};

export default About;
