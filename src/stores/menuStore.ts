import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import type { MenuItem, MenuData, Category } from '../types/MenuData'
import { menuApi } from '../services/menuApi'
import { categoryApi } from '../services/categoryApi'
import { itemApi } from '../services/itemApi'
import config from '../config/api.config'

export const useMenuStore = defineStore('menu', () => {
  const categories = ref<Category[]>([])
  const items = ref<Record<string, MenuItem[]>>({})
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)

  const allItems = computed((): MenuItem[] => {
    let result: MenuItem[] = []
    for (const categoryId in items.value) {
      result = [...result, ...items.value[categoryId]]
    }
    return result
  })

  async function fetchMenuData() {
    isLoading.value = true
    error.value = null

    try {
      const data: MenuData = await menuApi.getMenu()
      categories.value = data.menu
      items.value = {}
      for (const cat of data.menu) {
        items.value[cat.categoryId] = cat.categoryItems.map(
          (item: MenuItem) => ({
            ...item,
            available: Boolean(item.is_available ?? item.available ?? true)
          })
        ) as MenuItem[]
      }
    } catch (err) {
      console.error('Error fetching menu data:', err)
      error.value = err instanceof Error ? err.message : 'Unknown error'
      categories.value = []
      items.value = {}
    } finally {
      isLoading.value = false
    }
  }

  async function addMenuItem(
    categoryId: string,
    item: Omit<
      MenuItem,
      'id' | 'itemNumber' | 'category_id' | 'organization_id'
    >
  ) {
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
        sizes: Array.isArray(item.details?.sizes)
          ? item.details.sizes.join(', ')
          : 'Regular',
        tags: Array.isArray(item.details?.tags)
          ? item.details.tags.join(', ')
          : 'New'
      }

      const data = await itemApi.addItem(requestBody)
      categories.value = data.menu
      items.value = {}
      for (const cat of data.menu) {
        items.value[cat.categoryId] = cat.categoryItems
      }
    } catch (err) {
      console.error('Error adding menu item:', err)
      throw err
    }
  }

  async function updateMenuItem(categoryId: string, updatedItem: MenuItem) {
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
          : 'New'
      }

      const data = await itemApi.updateItem(requestBody)

      if (items.value[categoryId]) {
        const itemIndex = items.value[categoryId].findIndex(
          item => item.id === updatedItem.id
        )
        if (itemIndex !== -1) {
          items.value[categoryId][itemIndex] = {
            ...updatedItem,
            available: updatedItem.available
          }
        }
      }

      categories.value = data.menu
      items.value = {}
      for (const cat of data.menu) {
        items.value[cat.categoryId] = cat.categoryItems.map(
          (item: MenuItem) => ({
            ...item,
            available: Boolean(item.is_available ?? item.available ?? true)
          })
        ) as MenuItem[]
      }
    } catch (err) {
      console.error('Error updating menu item:', err)
      throw err
    }
  }

  async function deleteMenuItem(categoryId: string, id: string) {
    try {
      const data = await itemApi.deleteItem({
        category_id: categoryId,
        item_id: id,
        organization_id: config.defaultParams.organization_id
      })
      categories.value = data.menu
      items.value = {}
      for (const cat of data.menu) {
        items.value[cat.categoryId] = cat.categoryItems
      }
    } catch (err) {
      console.error('Error deleting menu item:', err)
      throw err
    }
  }

  async function addCategory(categoryName: string) {
    if (!categories.value.some(cat => cat.categoryName === categoryName)) {
      try {
        const data = await categoryApi.addCategory(categoryName)
        const newCategory = data.menu.find(
          cat => cat.categoryName === categoryName
        )
        if (newCategory) {
          categories.value.push(newCategory)
          items.value[newCategory.categoryId] = []
        }
      } catch (err) {
        console.error('Error adding category:', err)
        throw err
      }
    }
  }

  async function deleteCategory(categoryId: string) {
    try {
      await categoryApi.deleteCategory(categoryId)
      categories.value = categories.value.filter(
        cat => cat.categoryId !== categoryId
      )
      delete items.value[categoryId]
    } catch (err) {
      console.error('Error deleting category:', err)
      throw err
    }
  }

  onMounted(() => {
    fetchMenuData()
  })

  return {
    categories,
    items,
    allItems,
    isLoading,
    error,
    fetchMenuData,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory,
    deleteCategory
  }
})
