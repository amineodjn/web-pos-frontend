import { fetchApi } from '../utils/fetchApi'
import { buildApiUrl } from '../config/api.config'
import type {
  OrderApiResponse,
  OrderCreateRequest,
  OrderUpdateRequest,
  OrderDeleteRequest
} from '../types/order'

/**
 * Query parameters for fetching orders
 */
export interface UseOrdersQuery {
  organization_id: string
  status?: string
  start_date?: string
  end_date?: string
  page?: number
  page_size?: number
}

/**
 * Fetch orders from the API
 * @param query - Query parameters for the API call
 * @returns Promise<OrderApiResponse>
 */
export const fetchOrdersApi = async (
  query: UseOrdersQuery
): Promise<OrderApiResponse> => {
  const params: Record<string, string> = {
    organization_id: query.organization_id
  }
  if (query.status) params.status = query.status
  if (query.start_date) params.start_date = query.start_date
  if (query.end_date) params.end_date = query.end_date
  if (query.page) params.page = String(query.page)
  if (query.page_size) params.page_size = String(query.page_size)
  const url = buildApiUrl('orders', params)
  return fetchApi<undefined, OrderApiResponse>(url)
}

/**
 * Create a new order via POST /orders
 * @param order - OrderCreateRequest body
 * @returns Promise<OrderApiResponse>
 */
export const createOrderApi = async (
  order: OrderCreateRequest
): Promise<OrderApiResponse> => {
  const url = buildApiUrl('orders')
  return fetchApi<OrderCreateRequest, OrderApiResponse>(url, {
    method: 'POST',
    body: order
  })
}

/**
 * Update an order via PUT /orders
 * @param order - OrderUpdateRequest body
 * @returns Promise<OrderApiResponse>
 */
export const updateOrderApi = async (
  order: OrderUpdateRequest
): Promise<OrderApiResponse> => {
  const url = buildApiUrl('orders')
  return fetchApi<OrderUpdateRequest, OrderApiResponse>(url, {
    method: 'PUT',
    body: order
  })
}

/**
 * Delete an order via DELETE /orders
 * @param order - OrderDeleteRequest body
 * @returns Promise<OrderApiResponse>
 */
export const deleteOrderApi = async (
  order: OrderDeleteRequest
): Promise<OrderApiResponse> => {
  const url = buildApiUrl('orders')
  return await fetchApi<OrderDeleteRequest, OrderApiResponse>(url, {
    method: 'DELETE',
    body: order
  })
}
