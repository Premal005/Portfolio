import gsap from 'gsap';

export const fadeInUp = (target, options = {}) =>
  gsap.fromTo(target,
    { opacity: 0, y: options.y || 50 },
    { opacity: 1, y: 0, duration: options.duration || 1, ease: 'power3.out', delay: options.delay || 0 }
  );

export const staggerFadeIn = (targets, options = {}) =>
  gsap.fromTo(targets,
    { opacity: 0, y: options.y || 30 },
    { opacity: 1, y: 0, duration: 0.8, stagger: options.stagger || 0.1, ease: 'power3.out' }
  );
