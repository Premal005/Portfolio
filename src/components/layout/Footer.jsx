import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
import { useAppContext } from '../../context/AppContext';
import MagneticButton from '../ui/MagneticButton';
import { NAV_LINKS } from '../../utils/constants';

const Footer = () => {
  const { setCursorVariant, setCursorLabel } = useAppContext();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
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
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-white/[0.05] to-transparent pointer-events-none" />

      {/* Horizontal Marquee */}
      <div 
        className="group relative flex overflow-hidden whitespace-nowrap py-10 cursor-default"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
          className="flex whitespace-nowrap group-hover:[animation-play-state:paused]"
        >
          <h1 className="text-[8rem] md:text-[12rem] font-bold text-white/[0.03] group-hover:text-white/10 transition-colors duration-500 pr-8">
            {marqueeText}
          </h1>
          <h1 className="text-[8rem] md:text-[12rem] font-bold text-white/[0.03] group-hover:text-white/10 transition-colors duration-500 pr-8">
            {marqueeText}
          </h1>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-6 pb-8 pt-10"
      >
        {/* CTA Block */}
        <div className="mb-24 text-center flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Have a project in mind?</h2>
          <a 
            href="mailto:hello@yourname.com"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="text-2xl md:text-4xl font-light text-white hover:text-[#0071e3] transition-colors relative group inline-block"
          >
            hello@yourname.com
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-current origin-right scale-x-0 group-hover:scale-x-100 group-hover:origin-left transition-transform duration-500 ease-out"></span>
          </a>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-sm uppercase tracking-widest text-white/40 mb-6 font-bold">Quick Links</h3>
            <div className="flex flex-col gap-3">
              {NAV_LINKS?.map((link, i) => (
                <a 
                  key={i} 
                  href={link.href}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  className="text-white/70 hover:text-white transition-colors text-lg"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-sm uppercase tracking-widest text-white/40 mb-6 font-bold">Socials</h3>
            <div className="flex gap-4">
              {[
                { icon: FaGithub, href: "#" },
                { icon: FaLinkedin, href: "#" },
                { icon: FaTwitter, href: "#" },
                { icon: FaInstagram, href: "#" }
              ].map((social, i) => (
                <div key={i} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <MagneticButton>
                    <a
                      href={social.href}
                      className="w-14 h-14 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
                    >
                      <social.icon size={22} />
                    </a>
                  </MagneticButton>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end justify-center md:justify-start pt-6 md:pt-0">
             <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <MagneticButton onClick={scrollToTop}>
                <div className="w-24 h-24 rounded-full border border-white/20 flex flex-col items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer group">
                  <FiArrowUpRight size={24} className="-rotate-45 group-hover:-translate-y-1 transition-transform" />
                  <span className="text-xs uppercase tracking-wider font-bold mt-2">Top</span>
                </div>
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-6">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Your Name. All rights reserved.
          </p>
          <p className="text-white/40 text-sm">
            Designed & Built with <span className="text-[#0071e3]">♥</span>
          </p>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;
