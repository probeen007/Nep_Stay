const Hostel = require('../models/Hostel');
const Admin = require('../models/Admin');

// @desc    Get admin dashboard metrics
// @route   GET /api/admin/metrics
// @access  Private (Admin only)
const getDashboardMetrics = async (req, res, next) => {
  try {
    // Get date ranges
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Hostel statistics
    const totalHostels = await Hostel.countDocuments();
    const activeHostels = await Hostel.countDocuments({ isActive: true });
    const featuredHostels = await Hostel.countDocuments({ featured: true, isActive: true });
    const newHostelsToday = await Hostel.countDocuments({ 
      createdAt: { $gte: today } 
    });
    const newHostelsThisWeek = await Hostel.countDocuments({ 
      createdAt: { $gte: thisWeek } 
    });
    const newHostelsThisMonth = await Hostel.countDocuments({ 
      createdAt: { $gte: thisMonth } 
    });

    // Click statistics
    const totalClicksResult = await Hostel.aggregate([
      { $group: { _id: null, totalClicks: { $sum: '$clicks' } } }
    ]);
    const totalClicks = totalClicksResult[0]?.totalClicks || 0;

    // Most popular hostels (top 10)
    const popularHostels = await Hostel.find({ isActive: true })
      .sort({ clicks: -1 })
      .limit(10)
      .select('name slug clicks featured address price');

    // Recent hostels (last 10)
    const recentHostels = await Hostel.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name slug clicks featured address price createdAt');

    // Price statistics
    const priceStats = await Hostel.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    // Hostel distribution by price ranges
    const priceDistribution = await Hostel.aggregate([
      { $match: { isActive: true } },
      {
        $bucket: {
          groupBy: '$price',
          boundaries: [0, 5000, 10000, 15000, 20000, 30000, Number.MAX_VALUE],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            avgClicks: { $avg: '$clicks' }
          }
        }
      }
    ]);

    // Top facilities
    const topFacilities = await Hostel.aggregate([
      { $match: { isActive: true } },
      { $unwind: '$facilities' },
      {
        $group: {
          _id: '$facilities',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);

    // Monthly hostel creation trend (last 12 months)
    const monthlyTrend = await Hostel.aggregate([
      {
        $match: {
          createdAt: { 
            $gte: new Date(now.getFullYear(), now.getMonth() - 11, 1) 
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 },
          totalClicks: { $sum: '$clicks' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalHostels,
          activeHostels,
          inactiveHostels: totalHostels - activeHostels,
          featuredHostels,
          totalClicks,
          avgClicksPerHostel: activeHostels > 0 ? Math.round(totalClicks / activeHostels) : 0
        },
        growth: {
          newHostelsToday,
          newHostelsThisWeek,
          newHostelsThisMonth
        },
        pricing: {
          avgPrice: Math.round(priceStats[0]?.avgPrice || 0),
          minPrice: priceStats[0]?.minPrice || 0,
          maxPrice: priceStats[0]?.maxPrice || 0,
          priceDistribution
        },
        popularHostels,
        recentHostels,
        topFacilities,
        monthlyTrend
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get system information
// @route   GET /api/admin/system-info
// @access  Private (Admin only)
const getSystemInfo = async (req, res, next) => {
  try {
    // Database connection status
    const mongoose = require('mongoose');
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

    // Admin information
    const adminCount = await Admin.countDocuments({ isActive: true });

    // System statistics
    const systemInfo = {
      nodeVersion: process.version,
      environment: process.env.NODE_ENV,
      uptime: Math.floor(process.uptime()),
      memoryUsage: process.memoryUsage(),
      database: {
        status: dbStatus,
        host: mongoose.connection.host,
        name: mongoose.connection.name
      },
      adminCount,
      serverTime: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: {
        systemInfo
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardMetrics,
  getSystemInfo
};