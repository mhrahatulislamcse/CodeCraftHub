import React from 'react';

export function ProgressBar({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'purple',
  showLabel = false,
  label = '',
  className = '',
  animated = false,
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  const variantClasses = {
    purple: 'bg-gradient-to-r from-[#7C5CFC] to-[#A78BFA]',
    green: 'bg-gradient-to-r from-[#22C55E] to-[#4ADE80]',
    yellow: 'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]',
    blue: 'bg-gradient-to-r from-[#38BDF8] to-[#818CF8]',
  };

  return (
    <div className={`w-full ${className}`}>
      {(showLabel || label) && (
        <div className="flex items-center justify-between text-xs font-medium text-[#CBD5E1] mb-1.5">
          <span>{label || 'Progress'}</span>
          <span className="font-mono text-[#A78BFA]">{percentage}%</span>
        </div>
      )}

      <div
        className={`w-full bg-[#10182B] rounded-full overflow-hidden border border-[#27324A]/60 ${
          sizeClasses[size] || sizeClasses.md
        }`}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            variantClasses[variant] || variantClasses.purple
          } ${animated ? 'animate-pulse' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;

