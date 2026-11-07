import React from 'react';
import Card from './Card.jsx';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export function StatCard({
  title,
  value,
  icon,
  change,
  trend = 'neutral',
  subtitle,
  className = '',
  iconBg = 'bg-[#7C5CFC]/15 text-[#A78BFA] border-[#7C5CFC]/30',
}) {
  return (
    <Card className={`p-6 relative overflow-hidden group hover:border-[#7C5CFC]/40 transition-all ${className}`}>
      {/* Background ambient glow effect */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#7C5CFC]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#7C5CFC]/20 transition-all" />

      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[#94A3B8] tracking-wide uppercase">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] mt-2 tracking-tight">
            {value}
          </h3>
        </div>

        {icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-sm shrink-0 ${iconBg}`}>
            {icon}
          </div>
        )}
      </div>

      {(change || subtitle) && (
        <div className="mt-4 pt-3 border-t border-[#27324A]/40 flex items-center gap-2 text-xs">
          {change && (
            <span
              className={`inline-flex items-center gap-0.5 font-medium px-2 py-0.5 rounded-md ${
                trend === 'up'
                  ? 'bg-[#22C55E]/15 text-[#22C55E]'
                  : trend === 'down'
                  ? 'bg-[#EF4444]/15 text-[#EF4444]'
                  : 'bg-[#27324A]/50 text-[#CBD5E1]'
              }`}
            >
              {trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5" />}
              {trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5" />}
              {trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
              {change}
            </span>
          )}
          {subtitle && (
            <span className="text-[#94A3B8] truncate">{subtitle}</span>
          )}
        </div>
      )}
    </Card>
  );
}

export default StatCard;

