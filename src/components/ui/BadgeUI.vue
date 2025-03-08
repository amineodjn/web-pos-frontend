<template>
  <span
    :class="[
      'text-lg font-bold me-2 px-4 py-1 rounded-lg border cursor-pointer relative',
      `bg-${color}-100 text-black dark:bg-gray-700 dark:text-white border-${color}-600`
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
    default: 'red'
  }
})

const emit = defineEmits(['click'])

function handleClick() {
  emit('click')
}
</script>

<style scoped>
span {
  position: relative;
  overflow: hidden;
  z-index: 1;
}

span::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 192, 203, 0.9);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: -1;
}

span:hover::before {
  transform: translateX(0);
}

span:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}
</style>
