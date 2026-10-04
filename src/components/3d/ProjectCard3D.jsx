import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

const ProjectCard3D = ({ project }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);

  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ['0%', '100%']);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.2) 0%, transparent 60%)`;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const imageSrc = project?.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      whileHover={{ scale: 1.02 }}
      className={`relative w-[380px] md:w-[450px] h-[520px] rounded-2xl overflow-hidden cursor-pointer border border-transparent transition-colors duration-300 ${isHovered ? 'border-white/30' : ''}`}
    >
      {/* Glare effect */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30 opacity-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: glareBg
        }}
      />

      {/* Image with Chromatic Aberration / RGB Split effect on Hover */}
      <div className="absolute inset-0 z-0 bg-black">
        <img
          src={imageSrc}
          alt={project?.title || 'Project'}
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-[1.08]' : 'scale-100'}`}
        />
        
        {/* RGB Split Layers */}
        <div 
          className={`absolute inset-0 bg-cover bg-center mix-blend-screen transition-all duration-300 ${isHovered ? 'opacity-0 translate-x-0' : 'opacity-0'}`} 
          style={{ 
            backgroundImage: \`url(\${imageSrc})\`, 
            filter: 'hue-rotate(90deg) saturate(200%)',
            transform: isHovered ? 'translate(-4px, 0)' : 'translate(0, 0)',
            opacity: isHovered ? 0.6 : 0,
            transition: 'opacity 0.1s, transform 0.3s ease-out'
          }} 
        />
        <div 
          className={`absolute inset-0 bg-cover bg-center mix-blend-screen transition-all duration-300 ${isHovered ? 'opacity-0 translate-x-0' : 'opacity-0'}`} 
          style={{ 
            backgroundImage: \`url(\${imageSrc})\`, 
            filter: 'hue-rotate(-90deg) saturate(200%)',
            transform: isHovered ? 'translate(4px, 0)' : 'translate(0, 0)',
            opacity: isHovered ? 0.6 : 0,
            transition: 'opacity 0.1s, transform 0.3s ease-out'
          }} 
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/50 to-transparent" />

      {/* Content */}
      <div
        className="absolute inset-0 z-20 p-8 flex flex-col justify-end"
        style={{ transform: 'translateZ(50px)' }}
      >
        <span className="text-accent text-[10px] uppercase tracking-[0.3em] font-semibold mb-3">
          {project?.category || 'WEB DEVELOPMENT'}
        </span>
        <h3 className="text-2xl font-bold text-white mb-4">
          {project?.title || 'Project Title'}
        </h3>
        <div className="flex flex-wrap gap-2">
          {(project?.tags || ['React', 'Three.js', 'GSAP']).map((tag, i) => (
            <span
              key={i}
              className="px-3 py-1 text-xs text-white/80 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard3D;
