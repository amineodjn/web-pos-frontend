import { fetchApi } from '../utils/fetchApi'
import { buildApiUrl } from '../config/api.config'
import type { MenuData } from '../types/MenuData'

export const menuApi = {
  getMenu(): Promise<MenuData> {
    return fetchApi<never, MenuData>(buildApiUrl('menu'))
  }
}
