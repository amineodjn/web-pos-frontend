import type { MenuData } from '../types/MenuData'
import initialMenuData from '../data/MenuData.json'

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
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY))
    
    // Attempt to get from localStorage first
    const storedData = localStorage.getItem(STORAGE_KEY)
    
    if (storedData) {
      try {
        return JSON.parse(storedData) as MenuData
      } catch (err) {
        console.error('Error parsing stored menu data:', err)
        // Fall back to initial data if parsing fails
      }
    }
    
    // If no data in localStorage, use initial data
    // In a real app, this would be fetched from a server
    return initialMenuData as MenuData
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
  }
}

// Export a function to reset to initial data (for testing/development)
export async function resetMenuData(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY)
  await api.saveMenu(initialMenuData as MenuData)
}