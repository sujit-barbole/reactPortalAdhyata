import axios from 'axios';

// Base URL for all API calls
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8081/api/v1';

// Create an axios instance with default configuration
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // This ensures cookies are sent with every request
});

// Common API response type
export interface ApiResponse<T> {
  status: 'SUCCESS' | 'ERROR';
  data?: T;
  error?: string | null;
}

// Helper function to handle API errors
export const handleApiError = (error: any, defaultMessage: string): ApiResponse<any> => {
  console.error('API Error:', error);

  // Try to extract the most meaningful error message
  let errorMessage = defaultMessage;

  if (error.response?.data?.error) {
    // Use the error message from the API response
    errorMessage = error.response.data.error;
  } else if (error.response?.data?.message) {
    // Some APIs use 'message' instead of 'error'
    errorMessage = error.response.data.message;
  } else if (error.message) {
    // Use the error object's message if available
    errorMessage = error.message;
  }

  return {
    status: 'ERROR',
    error: errorMessage
  };
};

// Add an interceptor to include the auth token in requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      // Only redirect if not already on login page to avoid redirect loops
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);