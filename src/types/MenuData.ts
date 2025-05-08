export interface MenuItemDetails {
  ingredients: string[]
  meats: string[]
  sauces: string[]
  sizes: string[]
  tags: string[]
}

export interface MenuItem {
  available: boolean
  is_available?: boolean
  currency: string
  description: string
  details: MenuItemDetails
  id: string
  imageUrl: string
  itemNumber: number
  name: string
  price: number
  organization_id: string
  category_id: string
}

export interface Category {
  categoryId: string
  categoryName: string
  sortOrder: number
  categoryItems: MenuItem[]
}

export interface MenuData {
  menu: Category[]
  organizationId: string
}
