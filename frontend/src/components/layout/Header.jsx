import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon, HomeIcon } from '@heroicons/react/24/outline'
import { useScroll, useDebounce } from '../../hooks'
import { cn } from '../../utils/helpers'
import SearchBar from '../common/SearchBar'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { scrollDirection, isAtTop } = useScroll()
  const navigate = useNavigate()
  const location = useLocation()

  // Hide header on scroll down, show on scroll up
  const shouldHideHeader = scrollDirection === 'down' && !isAtTop && !isMobileMenuOpen

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setIsSearchOpen(false)
    }
  }

  const isSearchPage = location.pathname === '/search'

  return (
    <motion.header
      className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        isAtTop 
          ? 'bg-white/95 backdrop-blur-sm shadow-soft' 
          : 'bg-white/98 backdrop-blur-md shadow-nepali',
        shouldHideHeader && '-translate-y-full'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={closeMobileMenu}
          >
            <div className="relative">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-nep rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-105">
                <HomeIcon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              {/* Decorative pattern */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-500 rounded-full opacity-75" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-display font-bold text-gradient">
                Nep Stay
              </h1>
              <p className="text-xs text-neutral-500 mt-0.5" style={{ fontFamily: '"Noto Sans Devanagari", serif' }}>
                अतिथि देवो भव:
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/"
              className={cn(
                'relative px-4 py-2 text-sm font-medium transition-colors duration-200',
                location.pathname === '/' 
                  ? 'text-primary-700' 
                  : 'text-neutral-700 hover:text-primary-700'
              )}
            >
              Home
              {location.pathname === '/' && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-700"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
            <Link
              to="/search"
              className={cn(
                'relative px-4 py-2 text-sm font-medium transition-colors duration-200',
                isSearchPage
                  ? 'text-primary-700' 
                  : 'text-neutral-700 hover:text-primary-700'
              )}
            >
              Browse Hostels
              {isSearchPage && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-700"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </Link>
          </nav>

          {/* Search and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <div className="hidden lg:block">
              <SearchBar 
                onSearch={handleSearch}
                placeholder="Search hostels..."
                className="w-80"
              />
            </div>

            {/* Mobile Search Button */}
            <button
              onClick={toggleSearch}
              className="lg:hidden p-2 text-neutral-600 hover:text-primary-700 focus-nepali rounded-lg"
            >
              <MagnifyingGlassIcon className="w-6 h-6" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-neutral-600 hover:text-primary-700 focus-nepali rounded-lg"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              className="lg:hidden pb-4 border-t border-neutral-100 mt-4 pt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <SearchBar 
                onSearch={(query) => {
                  handleSearch(query)
                  setIsSearchOpen(false)
                }}
                placeholder="Search hostels..."
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />

            {/* Menu Panel */}
            <motion.div
              className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-neutral-100 lg:hidden"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <nav className="container-custom py-6">
                <div className="space-y-4">
                  <Link
                    to="/"
                    className={cn(
                      'block px-4 py-3 text-base font-medium rounded-lg transition-colors',
                      location.pathname === '/' 
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-700' 
                        : 'text-neutral-700 hover:bg-neutral-50'
                    )}
                    onClick={closeMobileMenu}
                  >
                    🏠 Home
                  </Link>
                  <Link
                    to="/search"
                    className={cn(
                      'block px-4 py-3 text-base font-medium rounded-lg transition-colors',
                      isSearchPage
                        ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-700' 
                        : 'text-neutral-700 hover:bg-neutral-50'
                    )}
                    onClick={closeMobileMenu}
                  >
                    🔍 Browse Hostels
                  </Link>
                </div>

                {/* Mobile Menu Footer */}
                <div className="mt-8 pt-6 border-t border-neutral-100">
                  <p className="text-center text-sm text-neutral-500">
                    Discover the best hostels in Kathmandu
                  </p>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Header