import { fetchApi } from '../utils/fetchApi'
import { buildApiUrl } from '../config/api.config'
import type { MenuData } from '../types/MenuData'

const SIMULATED_DELAY = 500 // ms

export const menuApi = {
  getMenu(): Promise<MenuData> {
    return fetchApi<never, MenuData>(buildApiUrl('menu'))
  },
  async saveMenu(data: MenuData): Promise<MenuData> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, SIMULATED_DELAY))
    // Simulate random errors (10% chance of error)
    if (Math.random() < 0.1) {
      throw new Error('Network error: Failed to save menu data')
    }
    // Save to localStorage (if needed for local dev)
    localStorage.setItem('menu_data', JSON.stringify(data))
    return data
  }
}
