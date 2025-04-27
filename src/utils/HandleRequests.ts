import type { MenuData } from '../types/MenuData'

export async function handleFetchPromise(
  url: string,
  organization_id?: string
): Promise<MenuData> {
  try {
    const requestUrl = organization_id
      ? `${url}?organization_id=${organization_id}`
      : url

    const response = await fetch(requestUrl)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await (response.json() as Promise<MenuData>)
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}
