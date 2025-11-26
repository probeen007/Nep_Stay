import { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services'
import toast from 'react-hot-toast'

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
}

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }

    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }

    case ActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }

    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }

    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
        error: null,
      }

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      }

    default:
      return state
  }
}

// Create context
const AuthContext = createContext(null)

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check authentication status on app load
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true })
      
      const response = await authService.checkStatus()
      
      if (response.success && response.authenticated) {
        dispatch({ 
          type: ActionTypes.SET_USER, 
          payload: response.data.user 
        })
      } else {
        dispatch({ 
          type: ActionTypes.SET_USER, 
          payload: null 
        })
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      dispatch({ 
        type: ActionTypes.SET_USER, 
        payload: null 
      })
    }
  }

  const login = async (credentials) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true })
      
      const response = await authService.login(credentials)
      
      if (response.success) {
        dispatch({ 
          type: ActionTypes.LOGIN_SUCCESS, 
          payload: response.data 
        })
        
        toast.success('Login successful! Welcome back.')
        return { success: true }
      } else {
        throw new Error(response.error?.message || 'Login failed')
      }
    } catch (error) {
      const errorMessage = error.error?.message || error.message || 'Login failed'
      
      dispatch({ 
        type: ActionTypes.LOGIN_FAILURE, 
        payload: errorMessage 
      })
      
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      dispatch({ type: ActionTypes.LOGOUT })
      toast.success('Logged out successfully')
    } catch (error) {
      // Even if logout request fails, we should still log out locally
      dispatch({ type: ActionTypes.LOGOUT })
      console.error('Logout error:', error)
    }
  }

  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR })
  }

  // Context value
  const contextValue = {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    login,
    logout,
    clearError,
    checkAuthStatus,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

export default AuthContext