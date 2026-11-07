import React from 'react';

export function Card({
  children,
  className = '',
  hoverable = false,
  glow = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#151C31] border border-[#27324A] rounded-2xl transition-all duration-200 overflow-hidden ${
        hoverable ? 'hover:border-[#7C5CFC]/50 hover:shadow-xl hover:shadow-[#7C5CFC]/5 hover:-translate-y-0.5 cursor-pointer' : ''
      } ${
        glow ? 'border-[#7C5CFC]/60 shadow-[0_0_25px_rgba(124,92,252,0.15)]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={`p-6 pb-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', ...props }) {
  return (
    <h3 className={`text-lg font-semibold text-[#F8FAFC] tracking-tight ${className}`} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={`text-xs text-[#94A3B8] mt-1 leading-relaxed ${className}`} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={`p-6 pt-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={`p-6 pt-0 border-t border-[#27324A]/40 flex items-center justify-between ${className}`} {...props}>
      {children}
    </div>
  );
}

export default Card;
