import { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useAppDispatch } from '../../hooks/useAppDispatch.js';
import { useAppSelector } from '../../hooks/useAppSelector.js';
import { dismissToast, selectToasts } from '../../store/slices/uiSlice.js';
import { cn } from '../../utils/classNames.js';

const config = {
  success: { icon: CheckCircle, bar: 'bg-success',  text: 'text-success-text' },
  warning: { icon: AlertTriangle, bar: 'bg-warning', text: 'text-warning-text' },
  error:   { icon: XCircle,       bar: 'bg-error',   text: 'text-error-text'   },
  info:    { icon: Info,          bar: 'bg-primary-500', text: 'text-primary-700' },
};

const ToastItem = ({ toast }) => {
  const dispatch = useAppDispatch();
  const { icon: Icon, bar, text } = config[toast.type] || config.info;

  useEffect(() => {
    const t = setTimeout(() => dispatch(dismissToast(toast.id)), toast.duration ?? 4000);
    return () => clearTimeout(t);
  }, [toast.id, toast.duration, dispatch]);

  return (
    <div className="pointer-events-auto flex w-80 overflow-hidden rounded-lg bg-white shadow-md border border-neutral-200">
      <div className={cn('w-1 flex-shrink-0', bar)} aria-hidden="true" />
      <div className="flex flex-1 items-start gap-3 p-3">
        <Icon className={cn('mt-0.5 h-5 w-5 flex-shrink-0', text)} aria-hidden="true" />
        <p className="flex-1 text-small text-neutral-800">{toast.message}</p>
        <button
          onClick={() => dispatch(dismissToast(toast.id))}
          className="text-neutral-400 hover:text-neutral-600 transition-colors"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

const ToastContainer = () => {
  const toasts = useAppSelector(selectToasts);
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed top-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map((t) => <ToastItem key={t.id} toast={t} />)}
    </div>
  );
};

export default ToastContainer;
