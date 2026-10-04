import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_LINKS } from '../../utils/constants';
import { useAppContext } from '../../context/AppContext';

const ScrambleText = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = '!@#$%&*ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  const handleMouseEnter = () => {
    let iteration = 0;
    const maxIterations = 5;
    const interval = setInterval(() => {
      setDisplayText(text.split('').map((char, index) => {
        if(char === ' ') return ' ';
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      
      iteration++;
      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, 30);
  };

  return (
    <span onMouseEnter={handleMouseEnter} className="relative z-10">
      {displayText}
    </span>
  );
};

const Navbar = () => {
  const { setCursorVariant } = useAppContext();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentScrollY > lastScrollY.current && currentScrollY > 100 && !menuOpen) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;

      // Active section detection
      const sections = NAV_LINKS.map(link => link.href.replace('#', ''));
      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = section;
          }
        }
      }
      if (current) setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: 0 }}
        animate={{ 
          y: hidden ? '-100%' : '0%',
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/60 backdrop-blur-2xl border-b border-white/5 py-2' : 'bg-transparent py-6'}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a
            href="/"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
            className="text-2xl font-bold text-white tracking-tighter z-50 relative"
          >
            <ScrambleText text="YN." />
          </a>

          <div className="hidden md:flex items-center space-x-2 relative bg-white/5 rounded-full px-2 py-1 border border-white/10 backdrop-blur-md">
            {NAV_LINKS?.map((link, i) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <a 
                  key={i} 
                  href={link.href}
                  onMouseEnter={() => setCursorVariant('hover')}
                  onMouseLeave={() => setCursorVariant('default')}
                  className="relative px-4 py-2"
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className={`relative z-10 text-xs font-medium uppercase tracking-widest transition-colors ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}`}>
                    {link.name}
                  </span>
                </a>
              );
            })}
          </div>

          <button
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative w-10 h-10 focus:outline-none z-[60]"
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 flex flex-col items-end gap-1.5">
              <motion.span 
                animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }} 
                className="w-full h-[1px] bg-white block transition-transform origin-center" 
              />
              <motion.span 
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }} 
                className="w-4 h-[1px] bg-white block transition-opacity" 
              />
              <motion.span 
                animate={menuOpen ? { rotate: -45, y: -8, width: '100%' } : { rotate: 0, y: 0, width: '75%' }} 
                className="w-full h-[1px] bg-white block transition-transform origin-center" 
              />
            </div>
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center gap-8 perspective-[1000px]">
              {NAV_LINKS?.map((link, i) => (
                <div key={i} className="overflow-hidden p-2">
                  <motion.a
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ y: '100%', rotateX: -90, opacity: 0 }}
                    animate={{ y: '0%', rotateX: 0, opacity: 1 }}
                    exit={{ y: '-100%', rotateX: 90, opacity: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                    className="text-4xl md:text-6xl font-bold text-white uppercase tracking-tighter block transform-origin-bottom"
                  >
                    {link.name}
                  </motion.a>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
