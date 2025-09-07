<template>
  <div :id="`category-section-${category}`" class="category-section mb-8" ref="sectionRef">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

interface ViewportConfig {
  threshold: number
  rootMargin: string
}

const props = defineProps<{
  category: string
  onIntersect: (category: string) => void
}>()

const sectionRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

const getViewportConfig = (width = window.innerWidth): ViewportConfig => ({
  threshold: width <= 768 ? 0.2 : width <= 1024 ? 0.15 : 0.1,
  rootMargin: width <= 768 
    ? '-10% 0px' 
    : width <= 1024 
      ? '-15% 0px -50% 0px' 
      : '-10% 0px -65% 0px'
})

const setupObserver = () => {
  const { threshold, rootMargin } = getViewportConfig()
  
  observer?.disconnect()
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting && entry.intersectionRatio > threshold) {
        props.onIntersect(props.category)
      }
    },
    { root: null, rootMargin, threshold: [0, threshold, 0.5, 1] }
  )

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
}

onMounted(() => {
  setupObserver()
  window.addEventListener('resize', setupObserver)
})

onUnmounted(() => {
  window.removeEventListener('resize', setupObserver)
  observer?.disconnect()
})
</script>

<style scoped>
.category-section {
  scroll-margin-top: var(--header-height, 80px);
  scroll-snap-align: start;
}

@media (max-width: 768px) {
  .category-section {
    scroll-margin-top: var(--header-height-mobile, 60px);
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .category-section {
    scroll-margin-top: var(--header-height-tablet, 70px);
  }
}
</style> 