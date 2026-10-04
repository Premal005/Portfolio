import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MagneticButton from '../ui/MagneticButton';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useAppContext } from '../../context/AppContext';

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const { setCursorVariant, sound } = useAppContext();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    sound.playClick();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
          },
        }
      );

      gsap.fromTo(
        formRef.current,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: formRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const inputClass = `
    w-full bg-transparent border-b border-white/15 text-white font-sans text-lg py-4 
    focus:outline-none focus:border-accent transition-colors duration-500 peer
    placeholder-transparent
  `;

  const labelClass = `
    absolute left-0 top-4 text-white/30 text-base font-sans pointer-events-none 
    transition-all duration-300 
    peer-focus:-top-6 peer-focus:text-xs peer-focus:text-accent peer-focus:font-mono peer-focus:font-medium
    peer-[:not(:placeholder-shown)]:-top-6 
    peer-[:not(:placeholder-shown)]:text-xs 
    peer-[:not(:placeholder-shown)]:text-white/40
    peer-[:not(:placeholder-shown)]:font-mono
  `;

  return (
    <section id="contact" ref={sectionRef} className="relative min-h-screen py-36 px-6 md:px-20 overflow-hidden bg-black">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-accent/15 blur-[180px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Heading */}
        <div ref={headingRef} className="text-center mb-20">
          <span className="text-accent uppercase tracking-[0.3em] text-xs font-mono font-semibold mb-6 block">
            ✦ 04 // INITIATE TRANSMISSION
          </span>
          <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-black text-white tracking-tight uppercase leading-[0.9] mb-6">
            Let's Talk <br />
            <span className="gradient-text">Together.</span>
          </h2>
          <p className="text-white/40 text-base sm:text-lg font-light max-w-md mx-auto">
            Available for select engineering contracts, high-impact product architecture, and technical advisory.
          </p>
        </div>

        {/* Transmission Form */}
        <div ref={formRef} className="max-w-xl mx-auto p-8 sm:p-12 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            {/* Name */}
            <div className="relative">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder=" "
                className={inputClass}
                onFocus={() => setCursorVariant('text')}
                onBlur={() => setCursorVariant('default')}
              />
              <label className={labelClass}>Your Name</label>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent scale-x-0 origin-left peer-focus:scale-x-100 transition-transform duration-500" />
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder=" "
                className={inputClass}
                onFocus={() => setCursorVariant('text')}
                onBlur={() => setCursorVariant('default')}
              />
              <label className={labelClass}>Your Email Address</label>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent scale-x-0 origin-left peer-focus:scale-x-100 transition-transform duration-500" />
            </div>

            {/* Message */}
            <div className="relative">
              <textarea
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                required
                placeholder=" "
                className={`${inputClass} resize-none`}
                onFocus={() => setCursorVariant('text')}
                onBlur={() => setCursorVariant('default')}
              />
              <label className={labelClass}>Project Specifications / Brief</label>
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-accent scale-x-0 origin-left peer-focus:scale-x-100 transition-transform duration-500" />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-2">
              <MagneticButton
                variant={submitted ? 'accent' : 'primary'}
                type="submit"
                className="w-full sm:w-auto"
              >
                {submitted ? '✓ Transmission Delivered' : 'Send Transmission →'}
              </MagneticButton>
            </div>
          </form>

          {/* Social Coordinates */}
          <div className="mt-14 pt-8 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono text-white/40 tracking-wider">
              DIRECT PROTOCOL:
            </span>
            <div className="flex items-center gap-6">
              {[
                { Icon: FaGithub, href: 'https://github.com/Premal005' },
                { Icon: FaLinkedin, href: '#' },
                { Icon: FaTwitter, href: '#' },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/40 hover:text-accent text-lg transition-all duration-300 hover:scale-125"
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
