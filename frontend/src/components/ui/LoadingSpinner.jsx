import { motion } from 'framer-motion'

// Loading spinner component
const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '',
  ...props 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }
  
  const colors = {
    primary: 'text-primary-700',
    secondary: 'text-secondary-500',
    white: 'text-white',
    neutral: 'text-neutral-500',
  }

  return (
    <motion.div
      className={`inline-flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <div className={`${sizes[size]} ${colors[color]} spinner`} />
    </motion.div>
  )
}

// Page loading component
export const PageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <motion.p 
          className="mt-4 text-neutral-600 font-medium"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  )
}

// Content loading skeleton
export const ContentLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className="h-4 bg-neutral-200 rounded mb-2 last:mb-0"
          style={{ width: `${85 + Math.random() * 15}%` }}
        />
      ))}
    </div>
  )
}

// Card skeleton loader
export const CardLoader = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="card animate-pulse">
          <div className="aspect-4-3 bg-neutral-200 rounded-lg mb-4" />
          <div className="space-y-3">
            <div className="h-6 bg-neutral-200 rounded w-3/4" />
            <div className="h-4 bg-neutral-200 rounded w-full" />
            <div className="h-4 bg-neutral-200 rounded w-2/3" />
            <div className="flex justify-between items-center mt-4">
              <div className="h-6 bg-neutral-200 rounded w-20" />
              <div className="h-8 bg-neutral-200 rounded w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default LoadingSpinner