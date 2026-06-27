import { useAppDispatch } from './useAppDispatch.js';
import { showToast } from '../store/slices/uiSlice.js';

export function useToast() {
  const dispatch = useAppDispatch();
  return {
    success: (message, opts) => dispatch(showToast({ type: 'success', message, ...opts })),
    error:   (message, opts) => dispatch(showToast({ type: 'error',   message, ...opts })),
    warning: (message, opts) => dispatch(showToast({ type: 'warning', message, ...opts })),
    info:    (message, opts) => dispatch(showToast({ type: 'info',    message, ...opts })),
  };
}
