import { fetchApi } from '../utils/fetchApi'
import { buildApiUrl } from '../config/api.config'
import { ORGANIZATION_ID } from '../constants/urls'
import type { MenuData } from '../types/MenuData'

export const categoryApi = {
  addCategory(categoryName: string): Promise<MenuData> {
    return fetchApi<
      { name: string; organization_id: string; sort_order: number },
      MenuData
    >(buildApiUrl('category'), {
      method: 'POST',
      body: {
        name: categoryName,
        organization_id: ORGANIZATION_ID,
        sort_order: 0
      }
    })
  },
  deleteCategory(categoryId: string): Promise<MenuData> {
    return fetchApi<{ category_id: string; organization_id: string }, MenuData>(
      buildApiUrl('category'),
      {
        method: 'DELETE',
        body: {
          category_id: categoryId,
          organization_id: ORGANIZATION_ID
        }
      }
    )
  }
}
