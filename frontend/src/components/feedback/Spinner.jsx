import React from 'react';

export function Spinner({ size = 'md', className = '', color = 'purple' }) {
  const sizeMap = {
    xs: 'w-3.5 h-3.5 border-2',
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
    xl: 'w-12 h-12 border-4',
  };

  const colorMap = {
    purple: 'border-[#7C5CFC]/30 border-t-[#7C5CFC]',
    white: 'border-white/30 border-t-white',
    emerald: 'border-[#22C55E]/30 border-t-[#22C55E]',
    amber: 'border-[#F59E0B]/30 border-t-[#F59E0B]',
  };

  const sizeClass = sizeMap[size] || sizeMap.md;
  const colorClass = colorMap[color] || colorMap.purple;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block rounded-full animate-spin ${sizeClass} ${colorClass} ${className}`}
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default Spinner;
