import { fetchApi } from '../utils/fetchApi'
import { buildApiUrl } from '../config/api.config'

interface DeleteItemRequest {
  category_id: string
  item_id: string
  organization_id: string
}

interface ItemRequest {
  category_id: string
  description: string
  image_url: string
  ingredients: string
  is_available: boolean
  item_number: number
  meats: string
  name: string
  organization_id: string
  price: number
  sauces: string
  sizes: string
  tags: string
}

export const itemApi = {
  async deleteItem(data: DeleteItemRequest): Promise<any> {
    return fetchApi(buildApiUrl('item'), {
      method: 'DELETE',
      body: data
    })
  },
  async addItem(data: ItemRequest): Promise<any> {
    return fetchApi(buildApiUrl('item'), {
      method: 'POST',
      body: data
    })
  },
  async updateItem(data: ItemRequest): Promise<any> {
    return fetchApi(buildApiUrl('item'), {
      method: 'PUT',
      body: data
    })
  }
}
