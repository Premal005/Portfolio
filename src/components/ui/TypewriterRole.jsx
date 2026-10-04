import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const ROLES = [
  'Next-Gen 3D WebGL Experiences',
  'Ultra-Scalable Full Stack Architectures',
  'Bespoke Procedural GLSL Shaders',
  'Reactive & Performant Digital Products',
];

const TypewriterRole = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const { sound } = useAppContext();

  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    let speed = isDeleting ? 30 : 65;

    // Slight variation for realistic typing feel
    speed += Math.random() * 20;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing forward
        const nextText = currentRole.slice(0, displayText.length + 1);
        setDisplayText(nextText);
        if (sound) sound.playKey();

        if (nextText === currentRole) {
          // Pause at full word
          setTimeout(() => setIsDeleting(true), 2200);
        }
      } else {
        // Deleting backward
        const nextText = currentRole.slice(0, displayText.length - 1);
        setDisplayText(nextText);

        if (nextText === '') {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % ROLES.length);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, sound]);

  return (
    <div className="inline-flex items-center font-mono text-sm sm:text-base md:text-lg text-white/80 py-1 px-4 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
      <span className="text-accent font-bold mr-2">&gt;</span>
      <span className="text-white/40 mr-1.5 uppercase tracking-wider text-xs">DEVELOPING:</span>
      <span className="text-neon font-medium">{displayText}</span>
      <span className="inline-block w-2 h-4 bg-accent ml-1 animate-pulse" />
    </div>
  );
};

export default TypewriterRole;
