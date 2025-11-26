import axios from 'axios'

// Create axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers or other modifications here
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    // Return the data directly for successful responses
    return response.data
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      if (status === 401) {
        // Handle unauthorized access
        if (window.location.pathname.startsWith('/webapp/admin') && 
            window.location.pathname !== '/webapp/admin') {
          window.location.href = '/webapp/admin'
        }
      }
      
      // Return the error response data
      return Promise.reject(data || { 
        success: false, 
        error: { 
          code: 'UNKNOWN_ERROR', 
          message: 'An error occurred' 
        } 
      })
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject({
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your connection and try again.'
        }
      })
    } else {
      // Something else happened
      return Promise.reject({
        success: false,
        error: {
          code: 'REQUEST_ERROR',
          message: error.message || 'An unexpected error occurred'
        }
      })
    }
  }
)

export default api