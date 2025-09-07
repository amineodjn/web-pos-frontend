import type { MenuItem } from './MenuData'

export interface OrderItem extends MenuItem {
  quantity: number
  comment?: string
}

export type OrderStatus =
  | 'pending'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled'

export interface Order {
  id: string
  tableNumber: number | null
  orderType: 'dine-in' | 'takeaway'
  items: OrderItem[]
  status: OrderStatus
  total: number
  tax: number
  createdAt: Date
  comments?: string
}

/**
 * Details for a menu item in the API response
 */
export interface OrderApiMenuItemDetails {
  ingredients: string[]
  meats: string[]
  sauces: string[]
  sizes: string[]
  tags: string[]
}

/**
 * Menu item object in the API response
 */
export interface OrderApiMenuItem {
  available: boolean
  currency: string
  description: string
  details: OrderApiMenuItemDetails
  id: string
  imageUrl: string
  itemNumber: number
  name: string
  price: number
  created_at: string
  updated_at: string
  is_available: boolean
  image_url: string
  item_number: number
}

/**
 * Order item in the API response
 */
export interface OrderApiOrderItem {
  item: OrderApiMenuItem
  quantity: number
}

/**
 * Order object in the API response
 */
export interface OrderApiOrder {
  id: string
  table_number: number
  is_takeout: boolean
  items: OrderApiOrderItem[]
  status: OrderStatus
  total_amount: number
  created_at: string
  updated_at: string
  notes: string
}

/**
 * Response schema for GET /orders
 */
export interface OrderApiResponse {
  orders: OrderApiOrder[]
  orders_per_page: number
  organization_id: string
  page: number
  total_orders: number
  total_pages: number
}

/**
 * Request body for POST /orders (create new order)
 */
export interface OrderCreateRequest {
  organization_id: string
  flags: {
    is_takeout: boolean
  }
  table_number: number
  items: Array<{
    item_id: string
    quantity: number
  }>
  notes: string
}

/**
 * Request body for PUT /orders (update order by ID)
 */
export interface OrderUpdateRequest {
  order_id: string
  organization_id: string
  flags: {
    is_takeout: boolean
  }
  table_number: number
  items: Array<{
    item_id: string
    quantity: number
  }>
  notes: string
  status: OrderStatus
}

/**
 * Request body for DELETE /orders (delete order by ID)
 */
export interface OrderDeleteRequest {
  order_id: string
  organization_id: string
}
