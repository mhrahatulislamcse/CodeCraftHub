import React from 'react';
import { useNotification } from '../../contexts/NotificationContext.jsx';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  if (!toasts || toasts.length === 0) return null;

  const typeConfig = {
    success: {
      icon: CheckCircle2,
      border: 'border-[#22C55E]/40',
      bg: 'bg-[#151C31]/95',
      iconColor: 'text-[#22C55E]',
      shadow: 'shadow-[0_4px_20px_rgba(34,197,94,0.15)]',
    },
    error: {
      icon: AlertCircle,
      border: 'border-[#EF4444]/40',
      bg: 'bg-[#151C31]/95',
      iconColor: 'text-[#EF4444]',
      shadow: 'shadow-[0_4px_20px_rgba(239,68,68,0.15)]',
    },
    warning: {
      icon: AlertTriangle,
      border: 'border-[#F59E0B]/40',
      bg: 'bg-[#151C31]/95',
      iconColor: 'text-[#F59E0B]',
      shadow: 'shadow-[0_4px_20px_rgba(245,158,11,0.15)]',
    },
    info: {
      icon: Info,
      border: 'border-[#7C5CFC]/40',
      bg: 'bg-[#151C31]/95',
      iconColor: 'text-[#A78BFA]',
      shadow: 'shadow-[0_4px_20px_rgba(124,92,252,0.15)]',
    },
  };

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const config = typeConfig[toast.type] || typeConfig.info;
        const IconComponent = config.icon;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-2 ${config.bg} ${config.border} ${config.shadow}`}
            role="alert"
          >
            <div className={`mt-0.5 shrink-0 ${config.iconColor}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-sm font-semibold text-[#F8FAFC] tracking-tight">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs text-[#CBD5E1] mt-0.5 leading-relaxed break-words">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#94A3B8] hover:text-[#F8FAFC] transition p-1 rounded-md hover:bg-[#27324A]/40 shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;

