import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
import { useAppContext } from '../../context/AppContext';
import MagneticButton from '../ui/MagneticButton';
import { NAV_LINKS } from '../../utils/constants';

const Footer = () => {
  const { setCursorVariant, setCursorLabel } = useAppContext();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMouseEnter = () => setCursorVariant('hover');
  const handleMouseLeave = () => {
    setCursorVariant('default');
    if (setCursorLabel) setCursorLabel('');
  };

  const marqueeText = "LET'S WORK TOGETHER • LET'S WORK TOGETHER • LET'S WORK TOGETHER • ";

  return (
    <footer ref={ref} className="relative bg-black text-white overflow-hidden pt-20 border-t border-white/5">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

      {/* Horizontal Marquee */}
      <div
        className="group relative flex overflow-hidden whitespace-nowrap py-10 cursor-default"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
          className="flex whitespace-nowrap group-hover:[animation-play-state:paused]"
        >
          <h1 className="text-[7rem] md:text-[11rem] font-display font-black text-white/[0.03] group-hover:text-white/10 transition-colors duration-500 pr-8">
            {marqueeText}
          </h1>
          <h1 className="text-[7rem] md:text-[11rem] font-display font-black text-white/[0.03] group-hover:text-white/10 transition-colors duration-500 pr-8">
            {marqueeText}
          </h1>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-6 pb-12 pt-10"
      >
        {/* CTA Block */}
        <div className="mb-24 text-center flex flex-col items-center">
          <span className="text-accent text-xs font-mono tracking-widest uppercase mb-4 font-semibold">
            ✦ DIRECT DISPATCH
          </span>
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6 tracking-tight">
            Have a project in mind?
          </h2>
          <a
            href="mailto:premal.goyal@gmail.com"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="text-2xl sm:text-4xl md:text-5xl font-light text-white hover:text-accent transition-colors relative group inline-block font-sans"
          >
            premal.goyal@gmail.com
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-current origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left transition-transform duration-500 ease-out" />
          </a>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 text-center md:text-left border-t border-white/10 pt-16">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xs uppercase tracking-widest text-white/40 mb-6 font-mono font-bold">Directory</h3>
            <div className="flex flex-col gap-3">
              {NAV_LINKS?.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="text-white/60 hover:text-white transition-colors text-sm font-mono tracking-wide"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-xs uppercase tracking-widest text-white/40 mb-6 font-mono font-bold">Networks</h3>
            <div className="flex gap-4">
              {[
                { icon: FaGithub, href: 'https://github.com/Premal005' },
                { icon: FaLinkedin, href: '#' },
                { icon: FaTwitter, href: '#' },
              ].map((social, i) => (
                <div key={i} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <MagneticButton>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="w-12 h-12 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                    >
                      <social.icon size={18} />
                    </a>
                  </MagneticButton>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end justify-center md:justify-start">
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <MagneticButton onClick={scrollToTop}>
                <div className="w-20 h-20 rounded-full border border-white/20 flex flex-col items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer group">
                  <FiArrowUpRight size={20} className="-rotate-45 group-hover:-translate-y-1 transition-transform" />
                  <span className="text-[10px] font-mono uppercase tracking-widest mt-1">Top</span>
                </div>
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4 text-xs font-mono text-white/30">
          <p>© {new Date().getFullYear()} Premal Goyal. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <span>Built with React 18, Three.js & Tailwind</span>
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
