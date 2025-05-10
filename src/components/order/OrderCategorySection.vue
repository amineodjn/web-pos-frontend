<template>
  <MenuCategoryObserver :category="category" :on-intersect="onIntersect">
    <h2 class="text-xl font-bold mb-4 px-4">{{ category }}</h2>
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 px-4"
    >
      <OrderMenuCard
        v-for="(item, index) in items"
        :key="index"
        :image-url="item.imageUrl"
        :name="item.name"
        :description="item.description"
        :details="item.details"
        :price="item.price"
        :currency="item.currency"
        :item="item"
        class="transform opacity-0 translate-y-4 animate-fadeIn w-full"
      />
    </div>
  </MenuCategoryObserver>
</template>

<script setup lang="ts">
  import type { MenuItem } from '../../types/MenuData';
  import OrderMenuCard from './OrderMenuCard.vue';
  import MenuCategoryObserver from '../menu/MenuCategoryObserver.vue';

  defineProps<{
    category: string;
    items: MenuItem[];
    onIntersect: (category: string) => void;
  }>();
</script>

<style scoped>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(16px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.6s ease-out forwards;
    animation-delay: calc(var(--tw-translate-y) * 50ms);
  }
</style>
