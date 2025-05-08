import type { MenuItemDetails } from './MenuData'

export interface MenuItemForm {
  name: string
  category_id: string
  price: string
  currency: string
  description: string
  imageUrl: string
  available: boolean
  details: MenuItemDetails
}

export interface ItemFormData {
  category_id: string
  name: string
  description: string
  price: number
  imageUrl?: string
  details?: Partial<MenuItemDetails>
  available?: boolean
  currency?: string
}

export interface CategoryOption {
  label: string
  value: string
}

export interface TabConfig {
  label: string
  value: string
}

export interface HeaderConfig {
  title: string
  items: any[]
  itemsCountSingular: string
  itemsCountPlural: string
  searchPlaceholder: string
  addButtonLabel: string
}

export interface StateConfig {
  isProcessing: boolean
  initialSearchQuery: string
}

export interface CategoryConfig {
  title: string
  addNewLabel: string
  placeholder: string
  savingLabel: string
  addLabel: string
  emptyMessage: string
}
