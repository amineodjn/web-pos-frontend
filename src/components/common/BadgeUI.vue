<template>
  <span
    :class="[
      'text-lg font-bold px-4 py-1 rounded-lg border cursor-pointer relative text-center',
      `text-black dark:text-white border-${color}-600`,
    ]"
    @click="handleClick"
  >
    <slot />
  </span>
</template>

<script lang="ts" setup>
  defineProps({
    color: {
      type: String,
      default: 'red',
    },
  });

  const emit = defineEmits(['click']);

  const handleClick = (): void => {
    emit('click');
  };
</script>

<style scoped>
  span {
    position: relative;
    overflow: hidden;
    z-index: 1;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  span::before {
    @apply bg-red-100 dark:bg-red-900;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: -1;
  }

  span:hover::before {
    transform: translateX(0);
  }

  span:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow:
      0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06),
      0 0 0 1px rgba(255, 255, 255, 0.1) inset,
      0 8px 24px rgba(255, 192, 203, 0.2);
  }
</style>
