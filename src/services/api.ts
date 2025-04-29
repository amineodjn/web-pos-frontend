import type { MenuData, Category } from '../types/MenuData'
import initialMenuData from '../data/MenuData.json'
import { MENU_DATA_URL, ORGANIZATION_ID } from '../constants/urls'

// Simulating localStorage as a simple database
const STORAGE_KEY = 'menu_data'

// For simulating network latency
const SIMULATED_DELAY = 500 // ms

// Mock API implementation
export const api = {
  /**
   * Get menu data
   */
  async getMenu(): Promise<MenuData> {
    const response = await fetch(
      `${MENU_DATA_URL}?organization_id=${ORGANIZATION_ID}`
    )

    if (!response.ok) {
      const errorData = await response.json()
      const errorMessage = errorData.message || 'Failed to fetch menu data'
      throw new Error(errorMessage)
    }

    return response.json()
  },

  /**
   * Save menu data
   */
  async saveMenu(data: MenuData): Promise<MenuData> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY))

    // Simulate random errors (10% chance of error)
    if (Math.random() < 0.1) {
      throw new Error('Network error: Failed to save menu data')
    }

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return data
  },

  async addCategory(categoryName: string): Promise<MenuData> {
    const response = await fetch(`${MENU_DATA_URL}/category`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: categoryName,
        organization_id: ORGANIZATION_ID,
        sort_order: 0
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      const errorMessage = errorData.message || 'Failed to delete category'
      throw new Error(errorMessage)
    }
    return response.json()
  },

  async deleteCategory(categoryId: string): Promise<MenuData> {
    const response = await fetch(`${MENU_DATA_URL}/category`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        category_id: categoryId,
        organization_id: ORGANIZATION_ID
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      const errorMessage = errorData.message || 'Failed to delete category'
      throw new Error(errorMessage)
    }
    return response.json()
  }
}

// Export a function to reset to initial data (for testing/development)
export async function resetMenuData(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY)
  await api.saveMenu(initialMenuData as MenuData)
}
