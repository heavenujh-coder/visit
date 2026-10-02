import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let bgClass = 'bg-white border-neutral-200 text-neutral-800 shadow-xl';
        let icon = <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />;

        if (toast.type === 'success') {
          bgClass = 'bg-emerald-50 border-emerald-200 text-emerald-950 shadow-emerald-900/10 shadow-lg';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
        } else if (toast.type === 'error') {
          bgClass = 'bg-rose-50 border-rose-200 text-rose-950 shadow-rose-900/10 shadow-lg';
          icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${bgClass}`}
          >
            {icon}
            <div className="flex-1 text-sm">
              <h4 className="font-semibold text-neutral-900 leading-snug">{toast.title}</h4>
              <p className="mt-0.5 text-neutral-600 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{toast.message}</p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="text-neutral-400 hover:text-neutral-600 transition-colors p-1 -mr-1 -mt-1 rounded-lg"
              title="닫기"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
