"use client";

import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { Toast as ToastType, useToastStore } from '@/src/hooks/useToast';

interface ToastProps {
  toast: ToastType;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500',
    textColor: 'text-green-800',
    iconColor: 'text-green-500',
  },
  error: {
    icon: XCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500',
    textColor: 'text-red-800',
    iconColor: 'text-red-500',
  },
  warning: {
    icon: AlertCircle,
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-500',
    textColor: 'text-amber-800',
    iconColor: 'text-amber-500',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-500',
  },
};

export default function Toast({ toast }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const { removeToast } = useToastStore();

  const config = toastConfig[toast.type];
  const Icon = config.icon;

  useEffect(() => {
    // Animación de entrada
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      removeToast(toast.id);
    }, 300); // Duración de la animación de salida
  };

  return (
    <div
      className={`
        flex items-start gap-3 min-w-[320px] max-w-md p-4 mb-3
        ${config.bgColor} ${config.borderColor}
        border-l-4 rounded-lg shadow-lg
        transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      {/* Icono */}
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${config.iconColor}`} />

      {/* Mensaje */}
      <p className={`flex-1 text-sm font-medium ${config.textColor}`}>
        {toast.message}
      </p>

      {/* Botón cerrar */}
      <button
        onClick={handleClose}
        className={`shrink-0 ${config.textColor} hover:opacity-70 transition-opacity`}
        aria-label="Cerrar notificación"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}