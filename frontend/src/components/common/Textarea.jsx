import React, { forwardRef } from 'react';

export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    className = '',
    id,
    rows = 4,
    disabled = false,
    required = false,
    ...props
  },
  ref
) {
  const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-medium text-[#CBD5E1] mb-1.5"
        >
          {label} {required && <span className="text-[#EF4444]">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        required={required}
        className={`w-full bg-[#10182B] text-[#F8FAFC] placeholder-[#94A3B8]/60 text-sm rounded-xl border transition-all duration-150 outline-none p-3.5 resize-y ${
          error
            ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444] focus:border-[#EF4444]'
            : 'border-[#27324A] focus:border-[#7C5CFC] focus:ring-1 focus:ring-[#7C5CFC]'
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-[#0B1020]' : ''} ${className}`}
        {...props}
      />

      {error ? (
        <p className="text-xs text-[#EF4444] mt-1.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#94A3B8] mt-1.5">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Textarea;
