import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearAll: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  
  addToast: (toast) => {
    const id = `${Date.now()}-${Math.random()}`;
    const newToast: Toast = {
      id,
      duration: 4000, // 4 segundos por defecto
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-dismiss
    if (newToast.duration) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, newToast.duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearAll: () => {
    set({ toasts: [] });
  },
}));

// Hook simplificado para usar en componentes
export const useToast = () => {
  const { addToast } = useToastStore();

  return {
    success: (message: string, duration?: number) =>
      addToast({ type: 'success', message, duration }),
    
    error: (message: string, duration?: number) =>
      addToast({ type: 'error', message, duration }),
    
    warning: (message: string, duration?: number) =>
      addToast({ type: 'warning', message, duration }),
    
    info: (message: string, duration?: number) =>
      addToast({ type: 'info', message, duration }),
  };
};