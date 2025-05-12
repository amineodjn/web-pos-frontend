import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MenuItem } from '../types/MenuData'
import type { Order, OrderApiResponse, OrderApiOrder } from '../types/order'
import {
  createOrderApi,
  fetchOrdersApi,
  deleteOrderApi,
  updateOrderApi
} from '../services/ordersApi'
import config from '../config/api.config'

export interface OrderItem extends MenuItem {
  quantity: number
  comment?: string
}

export const useOrderStore = defineStore('order', () => {
  const currentOrder = ref<Partial<Order>>({
    items: [],
    status: 'pending',
    tax: 0,
    total: 0
  })

  const activeOrders = ref<Order[]>([])
  const isLoading = ref(false)

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

  const isProcessing = ref(false)
  const error = ref<string | null>(null)

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

  function removeItemFromOrder(itemId: string) {
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
  async function fetchOrders() {
    isLoading.value = true
    try {
      const response: OrderApiResponse = await fetchOrdersApi({
        organization_id: config.defaultParams.organization_id
      })

      activeOrders.value = response.orders.map((order: OrderApiOrder) => ({
        id: order.id,
        tableNumber: order.table_number || null,
        orderType: order.is_takeout ? 'takeaway' : 'dine-in',
        items: order.items.map(item => ({
          id: item.item.id,
          name: item.item.name,
          price: item.item.price,
          quantity: item.quantity,
          comment: '',
          available: item.item.is_available,
          currency: 'PLN',
          description: item.item.description,
          details: item.item.details,
          imageUrl: item.item.image_url,
          itemNumber: item.item.item_number,
          category_id: '',
          organization_id: config.defaultParams.organization_id
        })),
        status: order.status,
        total: order.total_amount,
        tax: 0,
        createdAt: new Date(order.created_at)
      }))
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to fetch orders'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function placeOrder() {
    if (!currentOrder.value.items?.length) {
      error.value = 'Cannot place order without items'
      throw new Error(error.value)
    }

    isProcessing.value = true
    error.value = null

    try {
      const newOrder: Order = {
        id: `#${Math.floor(Math.random() * 90000) + 10000}`,
        tableNumber:
          currentOrder.value.orderType === 'dine-in'
            ? (currentOrder.value.tableNumber ?? null)
            : null,
        orderType: currentOrder.value.orderType || 'takeaway',
        items: currentOrder.value.items,
        status: 'pending',
        total: currentOrder.value.total!,
        tax: currentOrder.value.tax!,
        createdAt: new Date()
      }

      const response = await createOrderApi({
        organization_id: config.defaultParams.organization_id,
        flags: {
          is_takeout: newOrder.orderType === 'takeaway'
        },
        table_number: newOrder.tableNumber || 0,
        items: newOrder.items.map(item => ({
          item_id: item.id,
          quantity: item.quantity
        })),
        notes: '' // TODO: Add support for order notes
      })

      const createdOrder: Order = {
        ...newOrder,
        id: response.orders[0].id,
        status: response.orders[0].status as Order['status']
      }

      activeOrders.value.push(createdOrder)
      clearOrder()
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to place order'
      throw err
    } finally {
      isProcessing.value = false
    }
  }

  async function updateOrderStatus(orderId: string, status: Order['status']) {
    try {
      const order = activeOrders.value.find(o => o.id === orderId)
      if (!order) {
        throw new Error('Order not found')
      }

      await updateOrderApi({
        order_id: orderId,
        organization_id: config.defaultParams.organization_id,
        flags: {
          is_takeout: order.orderType === 'takeaway'
        },
        table_number: order.tableNumber || 0,
        items: order.items.map(item => ({
          item_id: item.id,
          quantity: item.quantity
        })),
        notes: '',
        status: status
      })
      order.status = status
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to update order status'
      throw err
    }
  }

  function updateItemComment(itemId: string, comment: string) {
    if (!currentOrder.value.items) return

    const item = currentOrder.value.items.find(i => i.id === itemId)
    if (item) {
      item.comment = comment
    }
  }

  async function deleteOrder(orderId: string) {
    try {
      await deleteOrderApi({
        order_id: orderId,
        organization_id: config.defaultParams.organization_id
      })
      activeOrders.value = activeOrders.value.filter(
        order => order.id !== orderId
      )
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : 'Failed to delete order'
      throw err
    }
  }

  return {
    currentOrder,
    activeOrders,
    subtotal,
    tax,
    total,
    taxRate,
    isProcessing,
    error,
    isLoading,
    setTaxRate,
    addItemToOrder,
    removeItemFromOrder,
    setTable,
    clearOrder,
    placeOrder,
    updateOrderStatus,
    updateItemComment,
    fetchOrders,
    deleteOrder
  }
})
