import type { MenuItemDetails } from '../types/MenuData'

export const DEFAULT_DETAILS: MenuItemDetails = {
  ingredients: ['No ingredients specified'],
  meats: ['No meats specified'],
  sauces: ['No sauces specified'],
  sizes: ['Regular'],
  tags: ['New']
}

export const DEFAULT_FORM = {
  name: '',
  category_id: '',
  price: '',
  currency: 'PLN',
  description: '',
  imageUrl: '',
  available: true,
  details: { ...DEFAULT_DETAILS }
}

export const DEFAULT_CURRENCY = 'PLN'
export const DEFAULT_AVAILABLE = true
export const DEFAULT_IMAGE_URL = ''
