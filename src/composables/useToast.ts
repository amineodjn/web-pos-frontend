import { ref, computed } from 'vue'

interface ToastNotification {
  id: number
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration: number
  position: string
}

const toasts = ref<ToastNotification[]>([])
let nextId = 0

export function useToast() {
  const activeToasts = computed(() => toasts.value)

  function showToast(
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    duration = 3000,
    position = 'bottom-right'
  ) {
    const id = nextId++
    const toast: ToastNotification = {
      id,
      type,
      message,
      duration,
      position
    }
    toasts.value.push(toast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  function removeToast(id: number) {
    const index = toasts.value.findIndex(toast => toast.id === id)
    if (index !== -1) {
      toasts.value.splice(index, 1)
    }
  }

  function success(
    message: string,
    duration = 3000,
    position = 'bottom-right'
  ) {
    return showToast('success', message, duration, position)
  }

  function error(message: string, duration = 3000, position = 'bottom-right') {
    return showToast('error', message, duration, position)
  }

  function warning(
    message: string,
    duration = 3000,
    position = 'bottom-right'
  ) {
    return showToast('warning', message, duration, position)
  }

  function info(message: string, duration = 3000, position = 'bottom-right') {
    return showToast('info', message, duration, position)
  }

  return {
    activeToasts,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}
