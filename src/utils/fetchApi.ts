import config from '../config/api.config';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

export const fetchApi = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  const { params, ...fetchOptions } = options;
  const queryString = params
    ? '?' + new URLSearchParams(params as Record<string, string>).toString()
    : '';
  const url = `${config.baseUrl}${endpoint}${queryString}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
    });

    if (!response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format: Expected JSON');
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`API request failed: ${error.message}`);
    }
    throw error;
  }
};
