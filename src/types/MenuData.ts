export interface MenuItemDetails {
  ingredients: string[]
  meats: string[]
  sauces: string[]
  sizes: string[]
  tags: string[]
}

export interface MenuItem {
  available: boolean
  currency: string
  description: string
  details: MenuItemDetails
  id: string
  imageUrl: string
  itemNumber: number
  name: string
  price: number
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
