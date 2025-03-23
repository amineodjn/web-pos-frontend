import { defineStore } from 'pinia'
import { ref, computed, onMounted } from 'vue'
import type { MenuItem, MenuData } from '../types/MenuData'
import { api } from '../services/api'

export const useMenuStore = defineStore('menu', () => {
  const categories = ref<string[]>([])
  const items = ref<Record<string, MenuItem[]>>({})
  const isLoading = ref<boolean>(false)
  const error = ref<string | null>(null)
  
  const allItems = computed((): MenuItem[] => {
    let result: MenuItem[] = []
    for (const category in items.value) {
      result = [...result, ...items.value[category]]
    }
    return result
  })
  
  async function fetchMenuData() {
    isLoading.value = true
    error.value = null
    
    try {
      const data = await api.getMenu()
      categories.value = data.categoryBadges
      items.value = data.categoryItems
    } catch (err) {
      console.error('Error fetching menu data:', err)
      error.value = err instanceof Error ? err.message : 'Unknown error'
      
      categories.value = []
      items.value = {}
    } finally {
      isLoading.value = false
    }
  }
  
  async function addMenuItem(category: string, item: Omit<MenuItem, 'id' | 'itemNumber'>) {
    if (!items.value[category]) {
      items.value[category] = []
    }
    
    const maxId = Math.max(0, ...allItems.value.map(item => item.id))
    const newItem: MenuItem = {
      ...item as any,
      id: maxId + 1,
      itemNumber: maxId + 1
    }
    
    items.value[category].push(newItem)
    await saveChanges()
  }
  
  async function updateMenuItem(category: string, updatedItem: MenuItem) {
    const index = items.value[category].findIndex(item => item.id === updatedItem.id)
    if (index !== -1) {
      items.value[category][index] = updatedItem
      await saveChanges()
    }
  }
  
  async function deleteMenuItem(category: string, id: number) {
    items.value[category] = items.value[category].filter(item => item.id !== id)
    await saveChanges()
  }
  
  async function addCategory(categoryName: string) {
    if (!categories.value.includes(categoryName)) {
      categories.value.push(categoryName)
      items.value[categoryName] = []
      await saveChanges()
    }
  }
  
  async function deleteCategory(categoryName: string) {
    categories.value = categories.value.filter(cat => cat !== categoryName)
    delete items.value[categoryName]
    await saveChanges()
  }
  
  async function saveChanges() {
    const menuDataToSave: MenuData = {
      categoryBadges: categories.value,
      categoryItems: items.value
    }
    
    try {
      await api.saveMenu(menuDataToSave)
    } catch (err) {
      console.error('Error saving menu data:', err)
      error.value = err instanceof Error ? err.message : 'Failed to save changes'
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