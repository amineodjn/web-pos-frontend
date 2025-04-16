import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MenuItem } from '../types/MenuData'

export interface OrderItem extends MenuItem {
  quantity: number
  comment?: string
}

interface Order {
  id: string
  tableNumber: number | null
  orderType: 'dine-in' | 'takeaway'
  items: OrderItem[]
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled'
  total: number
  tax: number
  createdAt: Date
}

export const useOrderStore = defineStore('order', () => {
  // Current order state
  const currentOrder = ref<Partial<Order>>({
    items: [],
    status: 'pending',
    tax: 0,
    total: 0
  })

  // Active orders
  const activeOrders = ref<Order[]>([])

  // Computed properties for current order
  const subtotal = computed(() => {
    return (
      currentOrder.value.items?.reduce((total, item) => {
        return total + item.price * item.quantity
      }, 0) || 0
    )
  })

  const taxRate = ref(8) // Default tax rate
  const tax = computed(() => subtotal.value * (taxRate.value / 100))
  const total = computed(() => subtotal.value + tax.value)

  // Methods for current order
  function setTaxRate(rate: number) {
    taxRate.value = rate
    updateOrderTotals()
  }

  function addItemToOrder(item: MenuItem) {
    if (!currentOrder.value.items) {
      currentOrder.value.items = []
    }

    const existingItem = currentOrder.value.items.find(i => i.id === item.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      currentOrder.value.items.push({ ...item, quantity: 1 })
    }
    updateOrderTotals()
  }

  function removeItemFromOrder(itemId: number) {
    if (!currentOrder.value.items) return

    const index = currentOrder.value.items.findIndex(item => item.id === itemId)
    if (index !== -1) {
      if (currentOrder.value.items[index].quantity > 1) {
        currentOrder.value.items[index].quantity--
      } else {
        currentOrder.value.items.splice(index, 1)
      }
      updateOrderTotals()
    }
  }

  function updateOrderTotals() {
    currentOrder.value.tax = tax.value
    currentOrder.value.total = total.value
  }

  function setTable(tableNumber: number) {
    currentOrder.value.tableNumber = tableNumber
  }

  function clearOrder() {
    currentOrder.value = {
      items: [],
      status: 'pending',
      tax: 0,
      total: 0,
      tableNumber: null
    }
  }

  // Methods for active orders
  async function placeOrder() {
    if (!currentOrder.value.items?.length) {
      throw new Error('Cannot place order without items')
    }

    const newOrder: Order = {
      id: `#${Math.floor(Math.random() * 90000) + 10000}`,
      tableNumber:
        currentOrder.value.orderType === 'dine-in'
          ? (currentOrder.value.tableNumber ?? null)
          : null,
      orderType: currentOrder.value.orderType || 'dine-in',
      items: currentOrder.value.items,
      status: 'in-progress',
      total: currentOrder.value.total!,
      tax: currentOrder.value.tax!,
      createdAt: new Date()
    }

    // In a real app, this would be an API call
    activeOrders.value.push(newOrder)
    clearOrder()
  }

  function updateOrderStatus(orderId: string, status: Order['status']) {
    const order = activeOrders.value.find(o => o.id === orderId)
    if (order) {
      order.status = status
    }
  }

  function updateItemComment(itemId: number, comment: string) {
    if (!currentOrder.value.items) return

    const item = currentOrder.value.items.find(i => i.id === itemId)
    if (item) {
      item.comment = comment
    }
  }

  return {
    currentOrder,
    activeOrders,
    subtotal,
    tax,
    total,
    taxRate,
    setTaxRate,
    addItemToOrder,
    removeItemFromOrder,
    setTable,
    clearOrder,
    placeOrder,
    updateOrderStatus,
    updateItemComment
  }
})
