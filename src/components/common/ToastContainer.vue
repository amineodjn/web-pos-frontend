<template>
  <div class="fixed inset-0 pointer-events-none z-50">
    <div
      v-for="position in positions"
      :key="position"
      :class="handleGetPositionClass(position)"
      class="fixed p-4"
    >
      <TransitionGroup name="toast">
        <ToastUI
          v-for="toast in handleGetToastsByPosition(position)"
          :key="toast.id"
          :type="toast.type"
          :message="toast.message"
          @close="removeToast(toast.id!)"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useToast } from '@/composables/useToast';
  import ToastUI from './ToastUI.vue';

  interface Toast {
    id?: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
    position?: Position;
  }

  const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const;
  type Position = (typeof positions)[number];

  const { toasts, removeToast } = useToast();

  const handleGetToastsByPosition = (position: Position): Toast[] => {
    return toasts.value.filter(
      toast => toast.position === position || (!toast.position && position === 'bottom-right')
    );
  };

  const handleGetPositionClass = (position: Position): string => {
    switch (position) {
      case 'top-left':
        return 'top-left';
      case 'top-right':
        return 'top-right';
      case 'bottom-left':
        return 'bottom-left';
      case 'bottom-right':
      default:
        return 'bottom-right';
    }
  };
</script>

<style scoped>
  .toast-enter-active,
  .toast-leave-active {
    transition: all 0.3s ease;
  }

  .toast-enter-from {
    opacity: 0;
    transform: translateY(30px);
  }

  .toast-leave-to {
    opacity: 0;
    transform: translateY(-30px);
  }
</style>
