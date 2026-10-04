import React from 'react';

const Button = ({ children, onClick, className = '', variant = 'primary', href, ...props }) => {
  const baseClasses = "relative overflow-hidden inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 group";
  
  let variantClasses = '';
  switch (variant) {
    case 'primary':
      variantClasses = "bg-white text-black px-8 py-3";
      break;
    case 'secondary':
      variantClasses = "bg-[#0071e3] text-white px-8 py-3";
      break;
    case 'outline':
      variantClasses = "border border-white/20 text-white hover:bg-white/5 px-8 py-3";
      break;
    default:
      variantClasses = "bg-white text-black px-8 py-3";
  }

  const Tag = href ? 'a' : 'button';

  return (
    <Tag
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      <span className="relative z-10 mix-blend-normal group-hover:mix-blend-difference">{children}</span>
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gradient-to-r from-gray-200 to-white transform -translate-x-[120%] skew-x-[-20deg] transition-transform duration-500 ease-out group-hover:translate-x-[120%] z-0" />
      )}
    </Tag>
  );
};

export default Button;
