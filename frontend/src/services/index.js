import api from './api'

// Auth service for admin authentication
export const authService = {
  // Login admin
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    return response
  },

  // Logout admin
  async logout() {
    const response = await api.post('/auth/logout')
    return response
  },

  // Get current user info
  async getMe() {
    const response = await api.get('/auth/me')
    return response
  },

  // Check authentication status
  async checkStatus() {
    const response = await api.get('/auth/status')
    return response
  },
}

// Hostel service for hostel management
export const hostelService = {
  // Get all hostels with filters and pagination
  async getHostels(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/hostels?${queryString}`)
    return response
  },

  // Get single hostel by ID or slug
  async getHostel(id) {
    const response = await api.get(`/hostels/${id}`)
    return response
  },

  // Get featured hostels
  async getFeaturedHostels(limit = 6) {
    const response = await api.get(`/hostels/featured?limit=${limit}`)
    return response
  },

  // Get popular hostels
  async getPopularHostels(limit = 6) {
    const response = await api.get(`/hostels/popular?limit=${limit}`)
    return response
  },

  // Create new hostel (admin only)
  async createHostel(hostelData) {
    const response = await api.post('/hostels', hostelData)
    return response
  },

  // Update hostel (admin only)
  async updateHostel(id, hostelData) {
    const response = await api.put(`/hostels/${id}`, hostelData)
    return response
  },

  // Delete hostel (admin only)
  async deleteHostel(id) {
    const response = await api.delete(`/hostels/${id}`)
    return response
  },

  // Toggle featured status (admin only)
  async toggleFeatured(id) {
    const response = await api.put(`/hostels/${id}/featured`)
    return response
  },

  // Get hostel statistics (admin only)
  async getHostelStats() {
    const response = await api.get('/hostels/admin/stats')
    return response
  },

  // Aliases for backward compatibility
  async getAll(params = {}) {
    return this.getHostels(params)
  },

  async getById(id) {
    return this.getHostel(id)
  },

  async create(hostelData) {
    return this.createHostel(hostelData)
  },

  async update(id, hostelData) {
    return this.updateHostel(id, hostelData)
  },

  async delete(id) {
    return this.deleteHostel(id)
  },

  async trackClick(hostelId) {
    const response = await api.post('/track/click', { hostelId })
    return response
  },
}

// Track service for analytics
export const trackService = {
  // Track hostel click
  async trackClick(hostelId) {
    const response = await api.post('/track/click', { hostelId })
    return response
  },

  // Get click analytics (admin only)
  async getClickAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const response = await api.get(`/track/analytics?${queryString}`)
    return response
  },
}

// Admin service for dashboard and metrics
export const adminService = {
  // Get dashboard data (alias for getDashboardMetrics)
  async getDashboard() {
    const response = await api.get('/admin/metrics')
    return response
  },

  // Get dashboard metrics
  async getDashboard() {
    console.log('AdminService: Making dashboard API call to /admin/metrics')
    try {
      const response = await api.get('/admin/metrics')
      console.log('AdminService: Dashboard API response:', response)
      return response
    } catch (error) {
      console.error('AdminService: Dashboard API error:', error)
      throw error
    }
  },

  // Get system information
  async getSystemInfo() {
    const response = await api.get('/admin/system-info')
    return response
  },
}

// Combined export for easier imports
export default {
  auth: authService,
  hostels: hostelService,
  track: trackService,
  admin: adminService,
}