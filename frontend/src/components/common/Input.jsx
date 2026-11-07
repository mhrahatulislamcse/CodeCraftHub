import React, { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    id,
    type = 'text',
    disabled = false,
    required = false,
    ...props
  },
  ref
) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-medium text-[#CBD5E1] mb-1.5"
        >
          {label} {required && <span className="text-[#EF4444]">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 pointer-events-none text-[#94A3B8] shrink-0">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          className={`w-full bg-[#10182B] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-sm rounded-xl border transition-all duration-150 outline-none ${
            leftIcon ? 'pl-10' : 'pl-3.5'
          } ${rightIcon ? 'pr-10' : 'pr-3.5'} py-2.5 ${
            error
              ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444] focus:border-[#EF4444]'
              : 'border-[#27324A] focus:border-[#7C5CFC] focus:ring-1 focus:ring-[#7C5CFC]'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-[#0B1020]' : ''} ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3.5 flex items-center text-[#94A3B8]">
            {rightIcon}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-[#EF4444] mt-1.5 flex items-center gap-1">
          {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-[#94A3B8] mt-1.5">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Input;
