<template>
  <div>
    <div
      v-for="position in positions"
      :key="position"
      class="toast-container"
      :class="getPositionClass(position)"
    >
      <div
        v-for="toast in getToastsByPosition(position)"
        :key="toast.id"
        class="mb-2"
      >
        <ToastUI
          :type="toast.type"
          :message="toast.message"
          :position="position"
          :duration="toast.duration"
          @close="removeToast(toast.id)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '../../composables/useToast'
import ToastUI from './ToastUI.vue'

const { activeToasts: toasts, removeToast } = useToast()

const positions = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right'
] as const
type Position = (typeof positions)[number]

function getToastsByPosition(position: Position) {
  return toasts.value.filter(
    toast =>
      toast.position === position ||
      (!toast.position && position === 'bottom-right')
  )
}

function getPositionClass(position: Position) {
  switch (position) {
    case 'top-left':
      return 'top-left'
    case 'top-right':
      return 'top-right'
    case 'bottom-left':
      return 'bottom-left'
    case 'bottom-right':
    default:
      return 'bottom-right'
  }
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  z-index: 50;
  display: flex;
  flex-direction: column;
}

.top-left {
  top: 1rem;
  left: 1rem;
}

.top-right {
  top: 1rem;
  right: 1rem;
}

.bottom-left {
  bottom: 1rem;
  left: 1rem;
}

.bottom-right {
  bottom: 1rem;
  right: 1rem;
}
</style>
