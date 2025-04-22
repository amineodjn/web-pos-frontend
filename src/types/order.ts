import type { MenuItem } from './MenuData'

export interface OrderItem extends MenuItem {
  quantity: number
  comment?: string
}

export interface Order {
  id: string
  tableNumber: number | null
  orderType: 'dine-in' | 'takeaway'
  items: OrderItem[]
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  total: number
  tax: number
  createdAt: Date
  comments?: string
}
