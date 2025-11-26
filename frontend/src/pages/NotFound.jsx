import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HomeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { useDocumentTitle } from '../hooks'
import { Button } from '../components/ui'

const NotFound = () => {
  useDocumentTitle('Page Not Found')

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="mx-auto w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mb-6">
            <ExclamationTriangleIcon className="w-12 h-12 text-primary-600" />
          </div>
          
          <h1 className="text-6xl font-bold text-primary-700 mb-4">404</h1>
          <h2 className="text-2xl lg:text-3xl font-semibold text-neutral-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-neutral-600 max-w-md mx-auto mb-8">
            Oops! The page you're looking for seems to have wandered off like a trekker in the Himalayas.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center"
        >
          <Link to="/">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <HomeIcon className="w-5 h-5 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <Link to="/search">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Browse Hostels
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-12"
        >
          <p className="text-sm text-neutral-500">
            Looking for something specific? Try our search or browse all hostels.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound