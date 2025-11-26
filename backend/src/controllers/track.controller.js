const Hostel = require('../models/Hostel');

// @desc    Track hostel click
// @route   POST /api/track/click
// @access  Public
const trackClick = async (req, res, next) => {
  try {
    const { hostelId } = req.body;

    // Find hostel by ID
    const hostel = await Hostel.findById(hostelId);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'HOSTEL_NOT_FOUND',
          message: 'Hostel not found'
        }
      });
    }

    // Check if hostel is active
    if (!hostel.isActive) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'HOSTEL_NOT_FOUND',
          message: 'Hostel not found'
        }
      });
    }

    // Increment click count
    await hostel.incrementClicks();

    res.status(200).json({
      success: true,
      message: 'Click tracked successfully',
      data: {
        hostel: {
          id: hostel._id,
          name: hostel.name,
          clicks: hostel.clicks + 1
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get click analytics for admin
// @route   GET /api/track/analytics
// @access  Private (Admin only)
const getClickAnalytics = async (req, res, next) => {
  try {
    const { 
      period = '7d', 
      limit = 10,
      sortBy = '-clicks' 
    } = req.query;

    // Calculate date range based on period
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '1d':
        dateFilter.createdAt = { $gte: new Date(now - 24 * 60 * 60 * 1000) };
        break;
      case '7d':
        dateFilter.createdAt = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
        break;
      case '30d':
        dateFilter.createdAt = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
        break;
      case 'all':
      default:
        // No date filter for 'all'
        break;
    }

    // Get hostels with click analytics
    const hostels = await Hostel.find({ 
      isActive: true,
      ...dateFilter 
    })
      .sort(sortBy)
      .limit(Number(limit))
      .select('name slug clicks featured createdAt address');

    // Calculate total statistics
    const totalClicks = await Hostel.aggregate([
      { $match: { isActive: true, ...dateFilter } },
      { $group: { _id: null, total: { $sum: '$clicks' } } }
    ]);

    const totalHostels = await Hostel.countDocuments({ 
      isActive: true, 
      ...dateFilter 
    });

    // Get average clicks per hostel
    const avgClicks = totalHostels > 0 ? 
      Math.round((totalClicks[0]?.total || 0) / totalHostels) : 0;

    // Get top performing hostel
    const topHostel = await Hostel.findOne({ 
      isActive: true, 
      ...dateFilter 
    })
      .sort({ clicks: -1 })
      .select('name clicks');

    res.status(200).json({
      success: true,
      data: {
        analytics: {
          period,
          totalClicks: totalClicks[0]?.total || 0,
          totalHostels,
          avgClicks,
          topHostel
        },
        hostels
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  trackClick,
  getClickAnalytics
};