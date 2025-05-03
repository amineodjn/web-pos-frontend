export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface FetchOptions<T = any> {
  method?: HttpMethod
  body?: T
  headers?: Record<string, string>
}

export async function fetchApi<T = any, R = any>(
  url: string,
  options: FetchOptions<T> = {}
): Promise<R> {
  const { method = 'GET', body, headers = {} } = options

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers
  }

  const response = await fetch(url, {
    method,
    headers: defaultHeaders,
    body: body ? JSON.stringify(body) : undefined
  })

  if (!response.ok) {
    const errorData = await response.json()
    const errorMessage = errorData.message || 'Unknown error'
    throw new Error(errorMessage)
  }

  return response.json()
}
