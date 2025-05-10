import { ref } from 'vue';

const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
type Position = (typeof positions)[number];

interface Toast {
  id?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  position?: Position;
}

export const useToast = (): {
  toasts: { value: Toast[] };
  showToast: (toast: Toast) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
} => {
  const toasts = ref<Toast[]>([]);

  const handleShowToast = (toast: Toast): void => {
    const id = Math.random().toString(36).substring(2, 9);
    toasts.value.push({ ...toast, id });
    if (toast.duration) {
      setTimeout(() => {
        handleRemoveToast(id);
      }, toast.duration);
    }
  };

  const handleRemoveToast = (id: string): void => {
    toasts.value = toasts.value.filter(toast => toast.id !== id);
  };

  const handleSuccess = (message: string, duration = 3000): void => {
    handleShowToast({ type: 'success', message, duration });
  };

  const handleError = (message: string, duration = 3000): void => {
    handleShowToast({ type: 'error', message, duration });
  };

  const handleWarning = (message: string, duration = 3000): void => {
    handleShowToast({ type: 'warning', message, duration });
  };

  const handleInfo = (message: string, duration = 3000): void => {
    handleShowToast({ type: 'info', message, duration });
  };

  return {
    toasts,
    showToast: handleShowToast,
    removeToast: handleRemoveToast,
    success: handleSuccess,
    error: handleError,
    warning: handleWarning,
    info: handleInfo,
  };
};
