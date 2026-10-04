import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../ui/MagneticButton';
import SplitTextHover from '../ui/SplitTextHover';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useAppContext } from '../../context/AppContext';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const { setCursorVariant } = useAppContext();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading scales down dramatically
      gsap.fromTo(headingRef.current,
        { scale: 2, opacity: 0.2, filter: 'blur(5px)' },
        {
          scale: 1, opacity: 1, filter: 'blur(0px)',
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1,
          },
        }
      );

      // Form slides up
      gsap.fromTo(formRef.current,
        { y: 100, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: formRef.current, start: 'top 85%' },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const inputClass = `
    w-full bg-transparent border-b border-white/15 text-white text-lg py-4 
    focus:outline-none focus:border-accent transition-colors duration-500 peer
    placeholder-transparent
  `;

  const labelClass = `
    absolute left-0 top-4 text-white/30 text-lg pointer-events-none 
    transition-all duration-300 
    peer-focus:-top-6 peer-focus:text-xs peer-focus:text-accent peer-focus:font-medium
    peer-[:not(:placeholder-shown)]:-top-6 
    peer-[:not(:placeholder-shown)]:text-xs 
    peer-[:not(:placeholder-shown)]:text-white/40
  `;

  return (
    <section id="contact" ref={sectionRef} className="relative min-h-screen py-32 px-6 md:px-20 overflow-hidden">
      {/* Background orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-accent/10 blur-[200px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-20 origin-center">
          <span className="text-accent uppercase tracking-[0.3em] text-xs font-semibold mb-6 block">
            ✦ Get In Touch
          </span>
          <div className="mb-6">
            <SplitTextHover
              text="LET'S TALK"
              className="text-6xl md:text-8xl lg:text-[10rem] font-black text-white tracking-tighter leading-[0.9]"
              repelRadius={100}
              repelStrength={20}
            />
          </div>
          <p className="text-white/30 text-lg max-w-md mx-auto">
            Have a project in mind? Let's create something extraordinary together.
          </p>
        </div>

        {/* Form */}
        <div ref={formRef} className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-12">
            {/* Name */}
            <div className="relative">
              <input
                type="text" name="name" value={form.name} onChange={handleChange}
                required placeholder=" " className={inputClass}
                onFocus={() => setCursorVariant('text')}
                onBlur={() => setCursorVariant('default')}
              />
              <label className={labelClass}>Your Name</label>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent scale-x-0 origin-left peer-focus:scale-x-100 transition-transform duration-500" />
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                required placeholder=" " className={inputClass}
                onFocus={() => setCursorVariant('text')}
                onBlur={() => setCursorVariant('default')}
              />
              <label className={labelClass}>Your Email</label>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent scale-x-0 origin-left peer-focus:scale-x-100 transition-transform duration-500" />
            </div>

            {/* Message */}
            <div className="relative">
              <textarea
                name="message" rows={4} value={form.message} onChange={handleChange}
                required placeholder=" " className={`${inputClass} resize-none`}
                onFocus={() => setCursorVariant('text')}
                onBlur={() => setCursorVariant('default')}
              />
              <label className={labelClass}>Your Message</label>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent scale-x-0 origin-left peer-focus:scale-x-100 transition-transform duration-500" />
            </div>

            {/* Submit */}
            <div className="flex justify-center mt-4">
              <MagneticButton variant={submitted ? 'accent' : 'primary'} type="submit">
                {submitted ? '✓ Message Sent!' : 'Send Message →'}
              </MagneticButton>
            </div>
          </form>

          {/* Social links */}
          <div className="mt-20 flex justify-center gap-8">
            {[
              { Icon: FaGithub, href: '#' },
              { Icon: FaLinkedin, href: '#' },
              { Icon: FaTwitter, href: '#' },
            ].map(({ Icon, href }, i) => (
              <a
                key={i} href={href}
                className="text-white/30 hover:text-white text-2xl transition-all duration-300 hover:scale-125"
                onMouseEnter={() => setCursorVariant('hover')}
                onMouseLeave={() => setCursorVariant('default')}
              >
                <Icon />
              </a>
            ))}
          </div>

          {/* Bottom text */}
          <p className="text-center text-white/15 text-sm mt-12 tracking-wide">
            Currently available for freelance work
          </p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
