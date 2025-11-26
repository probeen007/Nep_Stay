import { useState, useRef, useEffect } from 'react'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/helpers'

const SearchBar = ({
  onSearch,
  placeholder = 'Search...',
  className = '',
  autoFocus = false,
  showClearButton = true,
  initialValue = '',
}) => {
  const [query, setQuery] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClear()
      inputRef.current?.blur()
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative', className)}>
      <div className={cn(
        'relative flex items-center transition-all duration-200',
        isFocused ? 'scale-[1.02]' : ''
      )}>
        {/* Search Icon */}
        <div className="absolute left-3 z-10">
          <MagnifyingGlassIcon className="w-5 h-5 text-neutral-400" />
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full pl-10 pr-12 py-3 rounded-lg border transition-all duration-200',
            'bg-white/90 backdrop-blur-sm',
            'text-neutral-900 placeholder-neutral-500',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
            isFocused 
              ? 'border-primary-300 shadow-lg bg-white' 
              : 'border-neutral-200 hover:border-neutral-300'
          )}
        />

        {/* Clear Button */}
        <AnimatePresence>
          {showClearButton && query && (
            <motion.button
              type="button"
              onClick={handleClear}
              className="absolute right-3 p-1 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <XMarkIcon className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Focus Ring Effect */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="absolute inset-0 rounded-lg bg-gradient-nep opacity-10 -z-10"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 0.1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
    </form>
  )
}

export default SearchBar