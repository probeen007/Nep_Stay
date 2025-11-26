import { useState, useEffect } from 'react'
import { hostelService } from '../services'
import { debounce } from '../utils/helpers'

/**
 * Hook for fetching hostels with search, filters, and pagination
 * @param {Object} initialParams - Initial search parameters
 * @returns {Object} Search state and actions
 */
export const useHostelSearch = (initialParams = {}) => {
  const [hostels, setHostels] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  })
  
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    facilities: '',
    featured: false,
    sortBy: '-clicks',
    ...initialParams
  })

  // Debounced search function
  const debouncedSearch = debounce(async (searchParams) => {
    try {
      setLoading(true)
      setError(null)
      
      // Remove empty values
      const cleanParams = Object.entries(searchParams).reduce((acc, [key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          acc[key] = value
        }
        return acc
      }, {})
      
      const response = await hostelService.getHostels(cleanParams)
      
      if (response.success) {
        setHostels(response.data.hostels)
        setPagination(response.pagination)
      } else {
        throw new Error(response.error?.message || 'Failed to fetch hostels')
      }
    } catch (err) {
      setError(err.message)
      setHostels([])
      setPagination(prev => ({ ...prev, total: 0, totalPages: 0 }))
    } finally {
      setLoading(false)
    }
  }, 500)

  // Effect to trigger search when filters change
  useEffect(() => {
    debouncedSearch({ ...filters, page: pagination.page })
  }, [filters, pagination.page])

  // Update search term
  const updateSearch = (search) => {
    setFilters(prev => ({ ...prev, search }))
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }

  // Update sorting
  const updateSort = (sortBy) => {
    setFilters(prev => ({ ...prev, sortBy }))
    setPagination(prev => ({ ...prev, page: 1 })) // Reset to first page
  }

  // Go to specific page
  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }))
    }
  }

  // Go to next page
  const nextPage = () => {
    if (pagination.hasNextPage) {
      goToPage(pagination.page + 1)
    }
  }

  // Go to previous page
  const prevPage = () => {
    if (pagination.hasPrevPage) {
      goToPage(pagination.page - 1)
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      facilities: '',
      featured: false,
      sortBy: '-clicks'
    })
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  return {
    // State
    hostels,
    loading,
    error,
    filters,
    pagination,
    
    // Actions
    updateSearch,
    updateFilters,
    updateSort,
    goToPage,
    nextPage,
    prevPage,
    clearFilters,
  }
}