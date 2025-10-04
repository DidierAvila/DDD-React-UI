/**
 * useNotifications Hook - Hook para manejo de notificaciones
 * Platform Web Frontend
 */

import { useCallback, useState } from 'react';

/**
 * Hook personalizado para manejo de notificaciones/snackbars
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState([]);

  /**
   * Mostrar una notificación
   */
  const showNotification = useCallback((message, severity = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();

    const notification = {
      id,
      message,
      severity, // 'success', 'error', 'warning', 'info'
      duration,
      open: true,
    };

    setNotifications((prev) => [...prev, notification]);

    // Auto-hide después del duration
    if (duration > 0) {
      setTimeout(() => {
        hideNotification(id);
      }, duration);
    }

    return id;
  }, []);

  /**
   * Ocultar una notificación específica
   */
  const hideNotification = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, open: false } : notification
      )
    );

    // Remover después de la animación
    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, 300);
  }, []);

  /**
   * Limpiar todas las notificaciones
   */
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  /**
   * Métodos de conveniencia
   */
  const showSuccess = useCallback(
    (message, duration) => {
      return showNotification(message, 'success', duration);
    },
    [showNotification]
  );

  const showError = useCallback(
    (message, duration) => {
      return showNotification(message, 'error', duration);
    },
    [showNotification]
  );

  const showWarning = useCallback(
    (message, duration) => {
      return showNotification(message, 'warning', duration);
    },
    [showNotification]
  );

  const showInfo = useCallback(
    (message, duration) => {
      return showNotification(message, 'info', duration);
    },
    [showNotification]
  );

  return {
    notifications,
    showNotification,
    hideNotification,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
