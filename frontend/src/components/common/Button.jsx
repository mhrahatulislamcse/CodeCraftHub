import React from 'react';
import Spinner from '../feedback/Spinner.jsx';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7C5CFC]/50 focus:ring-offset-2 focus:ring-offset-[#0B1020] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  const variants = {
    primary: 'bg-gradient-to-r from-[#7C5CFC] to-[#6344E7] hover:from-[#6D4CF0] hover:to-[#5132D6] text-white shadow-md shadow-[#7C5CFC]/25 active:scale-[0.98]',
    secondary: 'bg-[#151C31] hover:bg-[#1D2641] text-[#F8FAFC] border border-[#27324A] hover:border-[#7C5CFC]/60 active:scale-[0.98]',
    outline: 'bg-transparent border border-[#7C5CFC] text-[#A78BFA] hover:bg-[#7C5CFC]/10 hover:text-white active:scale-[0.98]',
    ghost: 'bg-transparent hover:bg-[#151C31] text-[#CBD5E1] hover:text-white',
    danger: 'bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#EF4444] active:scale-[0.98]',
    success: 'bg-[#22C55E]/10 hover:bg-[#22C55E]/20 border border-[#22C55E]/30 text-[#22C55E] active:scale-[0.98]',
  };

  const sizes = {
    xs: 'text-xs px-2.5 py-1 gap-1.5 rounded-lg',
    sm: 'text-xs px-3.5 py-1.5 gap-2 rounded-lg font-medium',
    md: 'text-sm px-4.5 py-2.5 gap-2.5 rounded-xl font-medium',
    lg: 'text-base px-6 py-3 gap-3 rounded-xl font-semibold',
  };

  const currentVariant = variants[variant] || variants.primary;
  const currentSize = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${currentVariant} ${currentSize} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size={size === 'lg' ? 'md' : 'sm'} color={variant === 'primary' ? 'white' : 'purple'} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}

export default Button;
