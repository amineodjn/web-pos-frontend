import useSWR from 'swr';

// Set up the base URL for the API
const API_URL = "http://localhost:5000/api";

// Fetch API fetcher for SWR
const fetcher = async (url: string) => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch(`${API_URL}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    
    if (!response.ok) {
      const error = new Error('An error occurred while fetching the data');
      // Add response info to error
      const errorData = await response.json().catch(() => ({}));
      (error as any).status = response.status;
      (error as any).info = errorData;
      throw error;
    }
    
    return response.json();
  } catch (error) {
    throw error;
  }
};

export const useApi = (url: string) => {
  const token = localStorage.getItem('token');
  const { data, error, mutate, isValidating } = useSWR([url, token], fetcher, {
    revalidateOnFocus: true,
    shouldRetryOnError: false
  });

  return {
    data,
    error,
    isLoading: !error && !data && isValidating,
    isValidating,
    mutate,
  };
};

export const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const data = await response.json();
      localStorage.setItem('token', data.access_token);
      return data.access_token;
    } catch (error) {
      throw error;
    }
  };
