import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import ToastViewport from '../components/ui/Toast';

const ToastContext = createContext(null);

let idCounter = 0;
const nextId = () => `t_${Date.now()}_${idCounter++}`;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timers = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (opts) => {
      const payload =
        typeof opts === 'string' ? { message: opts } : opts || {};
      const id = nextId();
      const toast = {
        id,
        type: payload.type ?? 'info',
        title: payload.title,
        message: payload.message ?? '',
        duration: payload.duration ?? 3200,
      };
      setToasts((prev) => [...prev, toast]);
      if (toast.duration > 0) {
        const timer = setTimeout(() => dismiss(id), toast.duration);
        timers.current.set(id, timer);
      }
      return id;
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      toasts,
      show,
      dismiss,
      success: (msg, title) => show({ type: 'success', message: msg, title }),
      error: (msg, title) => show({ type: 'error', message: msg, title }),
      warning: (msg, title) => show({ type: 'warning', message: msg, title }),
      info: (msg, title) => show({ type: 'info', message: msg, title }),
    }),
    [toasts, show, dismiss]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} onClose={dismiss} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast harus dipakai di dalam <ToastProvider>');
  return ctx;
}

export default ToastContext;