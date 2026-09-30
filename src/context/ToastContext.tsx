import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastContextType {
  toasts: ToastMessage[];
  showToast: (message: string, type?: ToastMessage['type'], title?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastMessage['type'] = 'info', title?: string) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastMessage = { id, message, type, title };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3 ${
              toast.type === 'success'
                ? 'bg-slate-900/95 border-emerald-500/40 text-emerald-200'
                : toast.type === 'error'
                ? 'bg-slate-900/95 border-rose-500/40 text-rose-200'
                : toast.type === 'warning'
                ? 'bg-slate-900/95 border-amber-500/40 text-amber-200'
                : 'bg-slate-900/95 border-indigo-500/40 text-indigo-200'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-indigo-400" />}
            </div>

            <div className="flex-1 min-w-0">
              {toast.title && <h5 className="font-semibold text-sm text-slate-100">{toast.title}</h5>}
              <p className="text-xs text-slate-300 leading-relaxed break-words">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 p-1 text-slate-400 hover:text-slate-100 rounded-md transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
