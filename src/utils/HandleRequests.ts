import type { MenuData } from '../types/MenuData'

export async function handleFetchPromise(url: string): Promise<MenuData> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await (response.json() as Promise<MenuData>)
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
