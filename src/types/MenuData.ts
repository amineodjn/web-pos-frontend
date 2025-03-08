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
  id: number
  imageUrl: string
  itemNumber: number
  name: string
  price: number
  tags: string[] | null
}

export interface MenuData {
  categoryBadges: string[]
  categoryItems: Record<string, MenuItem[]>
}
