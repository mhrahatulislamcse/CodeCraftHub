import React from 'react';

export function Badge({
  children,
  variant = 'purple',
  size = 'sm',
  dot = false,
  className = '',
  ...props
}) {
  const variants = {
    purple: {
      container: 'bg-[#7C5CFC]/15 text-[#A78BFA] border-[#7C5CFC]/30',
      dot: 'bg-[#7C5CFC]',
    },
    green: {
      container: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30',
      dot: 'bg-[#22C55E]',
    },
    yellow: {
      container: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
      dot: 'bg-[#F59E0B]',
    },
    red: {
      container: 'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/30',
      dot: 'bg-[#EF4444]',
    },
    blue: {
      container: 'bg-[#38BDF8]/15 text-[#38BDF8] border-[#38BDF8]/30',
      dot: 'bg-[#38BDF8]',
    },
    neutral: {
      container: 'bg-[#27324A]/60 text-[#CBD5E1] border-[#27324A]',
      dot: 'bg-[#94A3B8]',
    },
  };

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5 gap-1 font-semibold tracking-wide uppercase',
    sm: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    md: 'text-sm px-3 py-1.5 gap-2 font-medium',
  };

  const currentVariant = variants[variant] || variants.purple;
  const currentSize = sizes[size] || sizes.sm;

  return (
    <span
      className={`inline-flex items-center rounded-full border leading-none transition-colors ${currentVariant.container} ${currentSize} ${className}`}
      {...props}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentVariant.dot}`} />
      )}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
