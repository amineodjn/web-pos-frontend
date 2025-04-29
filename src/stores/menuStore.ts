import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import type { MenuItem, MenuData, Category } from '../types/MenuData'
import { api } from '../services/api'

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
      const data: MenuData = await api.getMenu()
      categories.value = data.menu
      items.value = {}
      for (const cat of data.menu) {
        items.value[cat.categoryId] = cat.categoryItems
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
    item: Omit<MenuItem, 'id' | 'itemNumber'>
  ) {
    if (!items.value[categoryId]) {
      items.value[categoryId] = []
    }

    const newId = Date.now().toString()
    const maxItemNumber = Math.max(
      0,
      ...allItems.value.map(item => item.itemNumber)
    )
    const newItem: MenuItem = {
      ...(item as any),
      id: newId,
      itemNumber: maxItemNumber + 1
    }

    items.value[categoryId].push(newItem)
    await saveChanges()
  }

  async function updateMenuItem(categoryId: string, updatedItem: MenuItem) {
    const index = items.value[categoryId].findIndex(
      item => item.id === updatedItem.id
    )
    if (index !== -1) {
      items.value[categoryId][index] = updatedItem
      await saveChanges()
    }
  }

  async function deleteMenuItem(categoryId: string, id: string) {
    items.value[categoryId] = items.value[categoryId].filter(
      item => item.id !== id
    )
    await saveChanges()
  }

  async function addCategory(categoryName: string) {
    if (!categories.value.some(cat => cat.categoryName === categoryName)) {
      try {
        const data = await api.addCategory(categoryName)
        const newCategory = data.menu.find(
          cat => cat.categoryName === categoryName
        )
        if (newCategory) {
          categories.value.push(newCategory)
          items.value[newCategory.categoryId] = []
        }
      } catch (err) {
        console.error('Error adding category:', err)
        error.value =
          err instanceof Error ? err.message : 'Failed to add category'
        throw err
      }
    }
  }

  async function deleteCategory(categoryId: string) {
    try {
      await api.deleteCategory(categoryId)
      categories.value = categories.value.filter(
        cat => cat.categoryId !== categoryId
      )
      delete items.value[categoryId]
    } catch (err) {
      console.error('Error deleting category:', err)
      error.value =
        err instanceof Error ? err.message : 'Failed to delete category'
      throw err
    }
  }

  async function saveChanges() {
    const menu: Category[] = categories.value.map(cat => ({
      ...cat,
      categoryItems: items.value[cat.categoryId] || []
    }))
    const menuDataToSave: MenuData = {
      menu,
      organizationId: ''
    }

    try {
      await api.saveMenu(menuDataToSave)
    } catch (err) {
      console.error('Error saving menu data:', err)
      error.value =
        err instanceof Error ? err.message : 'Failed to save changes'
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
