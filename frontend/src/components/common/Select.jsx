import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const Select = forwardRef(function Select(
  {
    label,
    error,
    helperText,
    options = [],
    className = '',
    id,
    disabled = false,
    required = false,
    children,
    ...props
  },
  ref
) {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-medium text-[#CBD5E1] mb-1.5"
        >
          {label} {required && <span className="text-[#EF4444]">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          className={`w-full appearance-none bg-[#10182B] text-[#F8FAFC] text-sm rounded-xl border transition-all duration-150 outline-none pl-3.5 pr-10 py-2.5 cursor-pointer ${
            error
              ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444] focus:border-[#EF4444]'
              : 'border-[#27324A] focus:border-[#7C5CFC] focus:ring-1 focus:ring-[#7C5CFC]'
          } ${disabled ? 'opacity-50 cursor-not-allowed bg-[#0B1020]' : ''} ${className}`}
          {...props}
        >
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-[#151C31] text-[#F8FAFC]">
                  {opt.label}
                </option>
              ))
            : children}
        </select>

        <div className="absolute right-3.5 pointer-events-none text-[#94A3B8]">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error ? (
        <p className="text-xs text-[#EF4444] mt-1.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#94A3B8] mt-1.5">{helperText}</p>
      ) : null}
    </div>
  );
});

export default Select;

