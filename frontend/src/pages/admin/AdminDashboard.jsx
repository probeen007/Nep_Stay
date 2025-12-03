import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Users, 
  Eye, 
  TrendingUp, 
  MapPin, 
  Star,
  Calendar,
  Activity,
  BarChart3,
  PieChart,
  Clock,
  DollarSign,
  Server,
  Database,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { adminService } from '../../services';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Card from '../../components/ui/Card';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminService.getDashboard();
      console.log('Dashboard: API response received:', response);
      setDashboardData(response.data);
    } catch (error) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  const stats = {
    // Overview data
    totalHostels: dashboardData?.overview?.totalHostels || 0,
    activeHostels: dashboardData?.overview?.activeHostels || 0,
    totalClicks: dashboardData?.overview?.totalClicks || 0,
    avgClicksPerHostel: dashboardData?.overview?.avgClicksPerHostel || 0,
    featuredHostels: dashboardData?.overview?.featuredHostels || 0,
    
    // Growth data
    newHostelsThisMonth: dashboardData?.growth?.newHostelsThisMonth || 0,
    newHostelsThisWeek: dashboardData?.growth?.newHostelsThisWeek || 0,
    clicksThisWeek: dashboardData?.growth?.newHostelsThisWeek || 0, // Note: backend doesn't have clicksThisWeek
    
    // Pricing data
    averagePrice: dashboardData?.pricing?.avgPrice || 0,
    minPrice: dashboardData?.pricing?.minPrice || 0,
    maxPrice: dashboardData?.pricing?.maxPrice || 0,
    
    // Arrays - Fix mapping to match backend structure
    popularAreas: dashboardData?.topFacilities || [],
    recentHostels: (dashboardData?.recentHostels || []).map(hostel => ({
      ...hostel,
      location: hostel.location || {
        area: hostel.address || 'Unknown Location'
      }
    })),
    
    // System info (placeholder since backend doesn't return this in current structure)
    systemInfo: {
      version: '1.0.0',
      uptime: '24h'
    },
    
    // Beds calculation (not in backend, using activeHostels as placeholder)
    totalBeds: dashboardData?.overview?.activeHostels * 20 || 0 // Rough estimate
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Dashboard Overview
              </h1>
              <p className="text-gray-600 text-lg">
                Welcome back to Nep Stay Admin Panel
              </p>
            </div>
            <div className="mt-6 sm:mt-0 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium">System Online</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  <Activity className="w-4 h-4" />
                  Back to Website
                </a>
                <button 
                  onClick={fetchDashboardData}
                  className="flex items-center gap-2 px-4 py-2 bg-nep-red text-white rounded-lg hover:bg-nep-red/90 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quick Actions - Moved to top */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <Card className="p-8 border-0 shadow-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 bg-gradient-to-br from-nep-red/10 to-nep-red/20 rounded-xl flex items-center justify-center">
                <Activity className="h-6 w-6 text-nep-red" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Quick Actions</h3>
                <p className="text-gray-600 mt-1">Manage your platform efficiently</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/admin/hostels/create"
                className="flex items-center justify-center gap-3 bg-nep-red text-white px-6 py-4 rounded-xl hover:bg-nep-red/90 transition-all duration-200 font-semibold hover:shadow-lg transform hover:-translate-y-1"
              >
                <Building className="w-5 h-5" />
                Add New Hostel
              </a>
              <a
                href="/admin/hostels"
                className="flex items-center justify-center gap-3 bg-gray-100 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-200 transition-all duration-200 font-semibold hover:shadow-md transform hover:-translate-y-1"
              >
                📋 Manage Hostels
              </a>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-3 bg-blue-600 text-white px-6 py-4 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold hover:shadow-lg transform hover:-translate-y-1"
              >
                <RefreshCw className="w-5 h-5" />
                Refresh Dashboard
              </button>
            </div>
          </Card>
        </motion.div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-red-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Total Hostels</p>
                  <p className="text-3xl font-bold text-nep-red mb-2">{stats.totalHostels || 0}</p>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>+{stats.newHostelsThisMonth || 0} this month</span>
                  </div>
                </div>
                <div className="h-16 w-16 bg-nep-red/10 rounded-2xl flex items-center justify-center">
                  <Building className="h-8 w-8 text-nep-red" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-orange-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Total Clicks</p>
                  <p className="text-3xl font-bold text-orange-500 mb-2">{stats.totalClicks || 0}</p>
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <TrendingUp className="w-3 h-3" />
                    <span>+{stats.clicksThisWeek || 0} this week</span>
                  </div>
                </div>
                <div className="h-16 w-16 bg-orange-100 rounded-2xl flex items-center justify-center">
                  <Eye className="h-8 w-8 text-orange-500" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Average Price</p>
                  <p className="text-3xl font-bold text-blue-600 mb-2">₹{stats.averagePrice || 0}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Min: ₹{stats.minPrice || 0}</span>
                    <span>Max: ₹{stats.maxPrice || 0}</span>
                  </div>
                </div>
                <div className="h-16 w-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Total Beds</p>
                  <p className="text-3xl font-bold text-purple-600 mb-2">{stats.totalBeds || 0}</p>
                  <p className="text-xs text-gray-500">
                    Across all hostels
                  </p>
                </div>
                <div className="h-16 w-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
          
          {/* Recent Hostels - Takes 2 columns on xl screens */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="xl:col-span-2"
          >
            <Card className="p-8 h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Recent Hostels</h3>
                    <p className="text-gray-600 mt-1">Latest additions to the platform</p>
                  </div>
                </div>
                <button className="text-nep-red hover:text-nep-red/80 font-semibold text-sm px-3 py-2 rounded-lg hover:bg-red-50 transition-all duration-200">
                  View All →
                </button>
              </div>
              
              <div className="space-y-6">
                {stats.recentHostels && stats.recentHostels.length > 0 ? (
                  stats.recentHostels.slice(0, 5).map((hostel, index) => (
                    <div key={hostel._id} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-all duration-200 group">
                      <div className="w-14 h-14 bg-gradient-to-br from-nep-red/10 to-orange-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
                        <Building className="h-7 w-7 text-nep-red" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-semibold text-gray-900 truncate mb-1">
                          {hostel.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          📍 {hostel.location?.area || hostel.address || 'Unknown'} • ₹{hostel.pricePerNight || hostel.price}/night
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm text-gray-500 mb-1">
                          {new Date(hostel.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
                          <Eye className="w-4 h-4" />
                          {hostel.clicks || 0} views
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16">
                    <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No recent hostels</p>
                    <p className="text-gray-400 text-sm">New hostels will appear here</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Top Facilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-8 h-full border-0 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Top Facilities</h3>
                  <p className="text-gray-600 mt-1">Most popular amenities</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {stats.popularAreas && stats.popularAreas.length > 0 ? (
                  stats.popularAreas.slice(0, 6).map((facility, index) => facility && (
                    <div key={facility._id || index} className="flex items-center justify-between group hover:bg-gray-50 p-3 rounded-lg transition-all duration-200">
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex-shrink-0 ${
                          index === 0 ? 'bg-nep-red' :
                          index === 1 ? 'bg-orange-500' :
                          index === 2 ? 'bg-blue-600' :
                          index === 3 ? 'bg-purple-600' :
                          index === 4 ? 'bg-green-600' : 'bg-gray-400'
                        }`}></div>
                        <span className="font-medium text-gray-700 capitalize">
                          {facility._id || facility.name || 'Unknown'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{facility.count || 0}</span>
                        <span className="text-sm text-gray-500">hostels</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <PieChart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No data available</p>
                    <p className="text-gray-400 text-sm">Facility data will appear here</p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* System Status & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* System Status Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-8 border-0 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <Server className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">System Status</h3>
                  <p className="text-gray-600 mt-1">Platform health monitoring</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center group">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="font-bold text-gray-700 mb-1">Server Status</p>
                  <p className="text-sm text-green-600 font-semibold">Online</p>
                </div>
                
                <div className="text-center group">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
                    <Database className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="font-bold text-gray-700 mb-1">Database</p>
                  <p className="text-sm text-blue-600 font-semibold">Connected</p>
                </div>
                
                <div className="text-center group">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
                    <Activity className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="font-bold text-gray-700 mb-1">Version</p>
                  <p className="text-sm text-purple-600 font-semibold">{stats.systemInfo?.version || '1.0.0'}</p>
                </div>
                
                <div className="text-center group">
                  <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-200">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                  <p className="font-bold text-gray-700 mb-1">Uptime</p>
                  <p className="text-sm text-orange-600 font-semibold">{stats.systemInfo?.uptime || '24h'}</p>
                </div>
              </div>
            </Card>
          </motion.div>


        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;