import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { PageLoader } from '../ui/LoadingSpinner'

// Component to protect admin routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, checkAuthStatus } = useAuth()
  const location = useLocation()

  useEffect(() => {
    // Check auth status when component mounts
    checkAuthStatus()
  }, [])

  // Show loading while checking authentication
  if (isLoading) {
    return <PageLoader message="Verifying authentication..." />
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate 
        to="/webapp/admin" 
        state={{ from: location.pathname }} 
        replace 
      />
    )
  }

  // Return children if authenticated
  return children
}

export default ProtectedRoute