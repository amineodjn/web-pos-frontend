export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

export interface FetchOptions<T = unknown> {
  method?: HttpMethod
  body?: T
  headers?: Record<string, string>
}

export async function fetchApi<T = unknown, R = unknown>(
  url: string,
  options: FetchOptions<T> = {}
): Promise<R> {
  const { method = 'GET', body, headers = {} } = options

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...headers
  }

  try {
    const response = await fetch(url, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined
    })

    const responseData = await response.json()

    if (!response.ok) {
      throw new Error(
        responseData.detail ||
          responseData.message ||
          JSON.stringify(responseData)
      )
    }

    return responseData
  } catch (error) {
    console.log(error)
    throw error
  }
}
