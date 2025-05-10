<<<<<<< Updated upstream
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MenuItem } from '../types/MenuData'

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
=======
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { MenuItem } from '../types/MenuData';
import { createOrderApi, fetchOrdersApi, deleteOrderApi } from '../services/ordersApi';
import type { Order, OrderType, OrderStatus, OrderItem } from '../types/order';
import config from '../config/api.config';

export interface OrderState {
  currentOrder: Partial<Order>;
  activeOrders: Order[];
  isLoading: boolean;
  isProcessing: boolean;
  error: string | null;
  taxRate: number;
}

export const useOrderStore = defineStore('order', () => {
  const state = ref<OrderState>({
    currentOrder: {
      items: [],
      status: 'pending',
      tax: 0,
      total: 0,
    },
    activeOrders: [],
    isLoading: false,
    isProcessing: false,
    error: null,
    taxRate: 8,
  });

  const subtotal = computed((): number => {
    return (
      state.value.currentOrder.items?.reduce((total, item) => {
        return total + item.price * item.quantity;
>>>>>>> Stashed changes
      }, 0) || 0
    )
  })

<<<<<<< Updated upstream
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
=======
  const tax = computed((): number => subtotal.value * (state.value.taxRate / 100));
  const total = computed((): number => subtotal.value + tax.value);

  // Methods for current order
  const handleSetTaxRate = (rate: number): void => {
    state.value.taxRate = rate;
    handleUpdateOrderTotals();
  };

  const handleAddItemToOrder = (item: MenuItem): void => {
    if (!state.value.currentOrder.items) {
      state.value.currentOrder.items = [];
    }

    const existingItem = state.value.currentOrder.items.find(i => i.id === item.id);
>>>>>>> Stashed changes
    if (existingItem) {
      existingItem.quantity++
    } else {
<<<<<<< Updated upstream
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
=======
      const newItem: OrderItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        available: item.available,
        currency: item.currency,
        description: item.description,
        imageUrl: item.imageUrl,
        itemNumber: item.itemNumber?.toString(),
        category_id: item.category_id,
        organization_id: item.organization_id,
      };
      state.value.currentOrder.items.push(newItem);
    }
    handleUpdateOrderTotals();
  };

  const handleRemoveItemFromOrder = (itemId: string): void => {
    if (!state.value.currentOrder.items) return;

    const index = state.value.currentOrder.items.findIndex(item => item.id === itemId);
    if (index !== -1) {
      if (state.value.currentOrder.items[index].quantity > 1) {
        state.value.currentOrder.items[index].quantity--;
      } else {
        state.value.currentOrder.items.splice(index, 1);
      }
      handleUpdateOrderTotals();
>>>>>>> Stashed changes
    }
  };

<<<<<<< Updated upstream
  function updateOrderTotals() {
    currentOrder.value.tax = tax.value
    currentOrder.value.total = total.value
  }

  function setTable(tableNumber: number) {
    currentOrder.value.tableNumber = tableNumber
  }
=======
  const handleUpdateOrderTotals = (): void => {
    if (state.value.currentOrder) {
      state.value.currentOrder.tax = tax.value;
      state.value.currentOrder.total = total.value;
    }
  };

  const handleSetTable = (tableNumber: number): void => {
    if (state.value.currentOrder) {
      state.value.currentOrder.tableNumber = tableNumber;
    }
  };
>>>>>>> Stashed changes

  const handleClearOrder = (): void => {
    state.value.currentOrder = {
      items: [],
      status: 'pending',
      tax: 0,
      total: 0,
<<<<<<< Updated upstream
      tableNumber: null
=======
      tableNumber: null,
    };
  };

  // Methods for active orders
  const handleFetchOrders = async (): Promise<void> => {
    state.value.isLoading = true;
    try {
      const response = await fetchOrdersApi({
        organization_id: config.defaultParams.organization_id,
      });

      state.value.activeOrders = response.orders.map(order => ({
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
          currency: item.item.currency,
          description: item.item.description,
          imageUrl: item.item.image_url,
          itemNumber: item.item.item_number.toString(),
          category_id: '',
          organization_id: config.defaultParams.organization_id,
        })),
        status: order.status,
        total: order.total_amount,
        tax: 0,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      }));
    } catch (err) {
      state.value.error = err instanceof Error ? err.message : 'Failed to fetch orders';
      throw err;
    } finally {
      state.value.isLoading = false;
>>>>>>> Stashed changes
    }
  };

<<<<<<< Updated upstream
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
      orderType: currentOrder.value.orderType || 'takeaway',
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
=======
  const handlePlaceOrder = async (): Promise<void> => {
    if (!state.value.currentOrder.items?.length) {
      state.value.error = 'Cannot place order without items';
      throw new Error(state.value.error);
    }

    state.value.isProcessing = true;
    state.value.error = null;

    try {
      const now = new Date().toISOString();
      const newOrder: Order = {
        id: `#${Math.floor(Math.random() * 90000) + 10000}`,
        tableNumber:
          state.value.currentOrder.orderType === 'dine-in'
            ? (state.value.currentOrder.tableNumber ?? null)
            : null,
        orderType: state.value.currentOrder.orderType || 'takeaway',
        items: state.value.currentOrder.items,
        status: 'pending',
        total: state.value.currentOrder.total!,
        tax: state.value.currentOrder.tax!,
        createdAt: now,
        updatedAt: now,
      };

      const response = await createOrderApi({
        organization_id: config.defaultParams.organization_id,
        flags: {
          is_takeout: newOrder.orderType === 'takeaway',
        },
        table_number: newOrder.tableNumber || 0,
        items: newOrder.items.map(item => ({
          item_id: item.id,
          quantity: item.quantity,
        })),
        notes: '',
      });

      const createdOrder: Order = {
        ...newOrder,
        id: response.orders[0].id,
        status: response.orders[0].status as OrderStatus,
      };

      state.value.activeOrders.push(createdOrder);
      handleClearOrder();
    } catch (err) {
      state.value.error = err instanceof Error ? err.message : 'Failed to place order';
      throw err;
    } finally {
      state.value.isProcessing = false;
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: OrderStatus): void => {
    const order = state.value.activeOrders.find(o => o.id === orderId);
>>>>>>> Stashed changes
    if (order) {
      order.status = status
    }
<<<<<<< Updated upstream
  }

  function updateItemComment(itemId: string, comment: string) {
    if (!currentOrder.value.items) return

    const item = currentOrder.value.items.find(i => i.id === itemId)
    if (item) {
      item.comment = comment
=======
  };

  const handleUpdateItemComment = (itemId: string, comment: string): void => {
    const item = state.value.currentOrder.items?.find(i => i.id === itemId);
    if (item) {
      item.comment = comment;
    }
  };

  const handleDeleteOrder = async (orderId: string): Promise<void> => {
    try {
      await deleteOrderApi({
        order_id: orderId,
        organization_id: config.defaultParams.organization_id,
      });
      state.value.activeOrders = state.value.activeOrders.filter(order => order.id !== orderId);
    } catch (err) {
      state.value.error = err instanceof Error ? err.message : 'Failed to delete order';
      throw err;
>>>>>>> Stashed changes
    }
  };

  const handleUpdateOrderType = (type: OrderType): void => {
    state.value.currentOrder.orderType = type;
  };

  const handleUpdateItemQuantity = (itemId: string, quantity: number): void => {
    const item = state.value.currentOrder.items?.find(i => i.id === itemId);
    if (item) {
      item.quantity = quantity;
    }
  };

  return {
    currentOrder: computed(() => state.value.currentOrder),
    activeOrders: computed(() => state.value.activeOrders),
    isLoading: computed(() => state.value.isLoading),
    subtotal,
    tax,
    total,
<<<<<<< Updated upstream
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
=======
    taxRate: computed(() => state.value.taxRate),
    isProcessing: computed(() => state.value.isProcessing),
    error: computed(() => state.value.error),
    handleSetTaxRate,
    handleAddItemToOrder,
    handleRemoveItemFromOrder,
    handleUpdateOrderTotals,
    handleSetTable,
    handleClearOrder,
    handleFetchOrders,
    handlePlaceOrder,
    handleUpdateOrderStatus,
    handleUpdateItemComment,
    handleDeleteOrder,
    handleUpdateOrderType,
    handleUpdateItemQuantity,
  };
});
>>>>>>> Stashed changes
