import { defineStore } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import type { MenuItem, Category } from '../types/MenuData';
import config from '../config/api.config';
import { fetchApi } from '@/utils/fetchApi';

interface MenuResponse {
  categories: Category[];
}

export const useMenuStore = defineStore('menu', () => {
  const categories = ref<Category[]>([]);
  const items = ref<Record<string, MenuItem[]>>({});
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const allItems = computed((): MenuItem[] => {
    let result: MenuItem[] = [];
    for (const categoryId in items.value) {
      result = [...result, ...items.value[categoryId]];
    }
    return result;
  });

  const handleFetchMenuData = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = (await fetchApi('/menu', {
        params: {
          organization_id: config.defaultParams.organization_id,
        },
      })) as MenuResponse;
      categories.value = response.categories;
      items.value = {};
      for (const cat of response.categories) {
        items.value[cat.categoryId] = cat.categoryItems.map((item: MenuItem) => ({
          ...item,
          available: Boolean(item.is_available ?? item.available ?? true),
        })) as MenuItem[];
      }
    } catch (err) {
      console.error('Error fetching menu data:', err);
      error.value = err instanceof Error ? err.message : 'Failed to fetch menu data';
      categories.value = [];
      items.value = {};
    } finally {
      isLoading.value = false;
    }
  };

  const handleAddMenuItem = async (
    categoryId: string,
    item: Omit<MenuItem, 'id' | 'itemNumber' | 'category_id' | 'organization_id'>
  ): Promise<void> => {
    try {
      const requestBody = {
        category_id: categoryId,
        description: item.description || '',
        image_url: item.imageUrl || '',
        ingredients: Array.isArray(item.details?.ingredients)
          ? item.details.ingredients.join(', ')
          : 'No ingredients specified',
        is_available: item.available,
        item_number: 0,
        meats: Array.isArray(item.details?.meats)
          ? item.details.meats.join(', ')
          : 'No meats specified',
        name: item.name,
        organization_id: config.defaultParams.organization_id,
        price: item.price || 0,
        sauces: Array.isArray(item.details?.sauces)
          ? item.details.sauces.join(', ')
          : 'No sauces specified',
        sizes: Array.isArray(item.details?.sizes) ? item.details.sizes.join(', ') : 'Regular',
        tags: Array.isArray(item.details?.tags) ? item.details.tags.join(', ') : 'New',
        currency: item.currency || 'PLN',
      };

      const response = (await fetchApi('/menu/items', {
        method: 'POST',
        body: JSON.stringify(requestBody),
      })) as MenuResponse;
      categories.value = response.categories;
      items.value = {};
      for (const cat of response.categories) {
        items.value[cat.categoryId] = cat.categoryItems;
      }
    } catch (err) {
      console.error('Error adding menu item:', err);
      error.value = err instanceof Error ? err.message : 'Failed to add menu item';
      throw err;
    }
  };

  const handleUpdateMenuItem = async (categoryId: string, updatedItem: MenuItem): Promise<void> => {
    try {
      const requestBody = {
        category_id: categoryId,
        description: updatedItem.description || '',
        image_url: updatedItem.imageUrl || '',
        ingredients: Array.isArray(updatedItem.details?.ingredients)
          ? updatedItem.details.ingredients.join(', ')
          : 'No ingredients specified',
        is_available: updatedItem.available,
        item_id: updatedItem.id,
        item_number: updatedItem.itemNumber || 0,
        meats: Array.isArray(updatedItem.details?.meats)
          ? updatedItem.details.meats.join(', ')
          : 'No meats specified',
        name: updatedItem.name,
        organization_id: updatedItem.organization_id,
        price: updatedItem.price || 0,
        sauces: Array.isArray(updatedItem.details?.sauces)
          ? updatedItem.details.sauces.join(', ')
          : 'No sauces specified',
        sizes: Array.isArray(updatedItem.details?.sizes)
          ? updatedItem.details.sizes.join(', ')
          : 'Regular',
        tags: Array.isArray(updatedItem.details?.tags)
          ? updatedItem.details.tags.join(', ')
          : 'New',
        currency: updatedItem.currency || 'PLN',
      };

      const response = (await fetchApi(`/menu/items/${updatedItem.id}`, {
        method: 'PUT',
        body: JSON.stringify(requestBody),
      })) as MenuResponse;

      if (items.value[categoryId]) {
        const itemIndex = items.value[categoryId].findIndex(item => item.id === updatedItem.id);
        if (itemIndex !== -1) {
          items.value[categoryId][itemIndex] = {
            ...updatedItem,
            available: updatedItem.available,
          };
        }
      }

      categories.value = response.categories;
      items.value = {};
      for (const cat of response.categories) {
        items.value[cat.categoryId] = cat.categoryItems.map((item: MenuItem) => ({
          ...item,
          available: Boolean(item.is_available ?? item.available ?? true),
        })) as MenuItem[];
      }
    } catch (err) {
      console.error('Error updating menu item:', err);
      error.value = err instanceof Error ? err.message : 'Failed to update menu item';
      throw err;
    }
  };

  const handleDeleteMenuItem = async (categoryId: string, itemId: string): Promise<void> => {
    try {
      await fetchApi(`/menu/items/${itemId}`, {
        method: 'DELETE',
      });
      categories.value = categories.value.filter(cat => cat.categoryId !== categoryId);
      delete items.value[categoryId];
    } catch (err) {
      console.error('Error deleting menu item:', err);
      error.value = err instanceof Error ? err.message : 'Failed to delete menu item';
      throw err;
    }
  };

  const handleAddCategory = async (categoryName: string): Promise<void> => {
    if (!categories.value.some(cat => cat.categoryName === categoryName)) {
      try {
        const response = (await fetchApi('/menu/categories', {
          method: 'POST',
          body: JSON.stringify({ categoryName }),
        })) as MenuResponse;
        const newCategory = response.categories.find(
          (cat: Category) => cat.categoryName === categoryName
        );
        if (newCategory) {
          categories.value.push(newCategory);
          items.value[newCategory.categoryId] = [];
        }
      } catch (err) {
        console.error('Error adding category:', err);
        error.value = err instanceof Error ? err.message : 'Failed to add category';
        throw err;
      }
    }
  };

  const handleDeleteCategory = async (categoryId: string): Promise<void> => {
    try {
      await fetchApi(`/menu/categories/${categoryId}`, {
        method: 'DELETE',
      });
      categories.value = categories.value.filter(cat => cat.categoryId !== categoryId);
      delete items.value[categoryId];
    } catch (err) {
      console.error('Error deleting category:', err);
      error.value = err instanceof Error ? err.message : 'Failed to delete category';
      throw err;
    }
  };

  onMounted(() => {
    handleFetchMenuData();
  });

  return {
    categories: computed(() => categories.value),
    items,
    allItems,
    isLoading: computed(() => isLoading.value),
    error: computed(() => error.value),
    handleFetchMenuData,
    handleAddMenuItem,
    handleUpdateMenuItem,
    handleDeleteMenuItem,
    handleAddCategory,
    handleDeleteCategory,
  };
});
