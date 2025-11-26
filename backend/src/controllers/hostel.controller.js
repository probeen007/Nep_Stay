const Hostel = require('../models/Hostel');

// @desc    Get all hostels with search and filtering
// @route   GET /api/hostels
// @access  Public
const getHostels = async (req, res, next) => {
  try {
    const {
      search,
      minPrice,
      maxPrice,
      facilities,
      featured,
      sortBy = '-clicks',
      page = 1,
      limit = 12
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Text search
    if (search && search.trim()) {
      query.$text = { $search: search.trim() };
    }

    // Price filtering
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    // Facilities filtering
    if (facilities && facilities.trim()) {
      const facilitiesArray = facilities.split(',').map(f => f.trim()).filter(f => f);
      if (facilitiesArray.length > 0) {
        query.facilities = { $in: facilitiesArray.map(f => new RegExp(f, 'i')) };
      }
    }

    // Featured filtering
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }

    // Calculate skip value
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query with pagination
    const hostels = await Hostel.find(query)
      .sort(sortBy)
      .limit(Number(limit))
      .skip(skip)
      .select('-__v');

    // Get total count for pagination
    const total = await Hostel.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / Number(limit));
    const hasNextPage = Number(page) < totalPages;
    const hasPrevPage = Number(page) > 1;

    res.status(200).json({
      success: true,
      count: hostels.length,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      data: {
        hostels
      }
    });

  } catch (error) {
    console.error('Error in getHostels:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching hostels',
      error: error.message
    });
  }
};

// @desc    Get single hostel
// @route   GET /api/hostels/:id
// @access  Public
const getHostel = async (req, res, next) => {
  try {
    let hostel;

    // Check if id is MongoDB ObjectId or slug
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.id);
    
    if (isObjectId) {
      hostel = await Hostel.findById(req.params.id).select('-__v');
    } else {
      hostel = await Hostel.findOne({ 
        slug: req.params.id, 
        isActive: true 
      }).select('-__v');
    }

    if (!hostel) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'HOSTEL_NOT_FOUND',
          message: 'Hostel not found'
        }
      });
    }

    // Check if hostel is active (for public access)
    if (!hostel.isActive && !req.user) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'HOSTEL_NOT_FOUND',
          message: 'Hostel not found'
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        hostel
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get featured hostels
// @route   GET /api/hostels/featured
// @access  Public
const getFeaturedHostels = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const hostels = await Hostel.getFeatured(Number(limit));

    res.status(200).json({
      success: true,
      count: hostels.length,
      data: {
        hostels
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get popular hostels
// @route   GET /api/hostels/popular
// @access  Public
const getPopularHostels = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const hostels = await Hostel.getPopular(Number(limit));

    res.status(200).json({
      success: true,
      count: hostels.length,
      data: {
        hostels
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Create new hostel
// @route   POST /api/hostels
// @access  Private (Admin only)
const createHostel = async (req, res, next) => {
  try {
    // Generate slug from name
    const slug = req.body.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Date.now().toString(36);

    const hostelData = {
      ...req.body,
      slug
    };

    const hostel = await Hostel.create(hostelData);

    res.status(201).json({
      success: true,
      message: 'Hostel created successfully',
      data: {
        hostel
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Update hostel
// @route   PUT /api/hostels/:id
// @access  Private (Admin only)
const updateHostel = async (req, res, next) => {
  try {
    let hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'HOSTEL_NOT_FOUND',
          message: 'Hostel not found'
        }
      });
    }

    // If name is being updated, regenerate slug
    if (req.body.name && req.body.name !== hostel.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') + '-' + Date.now().toString(36);
    }

    hostel = await Hostel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).select('-__v');

    res.status(200).json({
      success: true,
      message: 'Hostel updated successfully',
      data: {
        hostel
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Delete hostel
// @route   DELETE /api/hostels/:id
// @access  Private (Admin only)
const deleteHostel = async (req, res, next) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'HOSTEL_NOT_FOUND',
          message: 'Hostel not found'
        }
      });
    }

    await Hostel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Hostel deleted successfully'
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Toggle featured status
// @route   PUT /api/hostels/:id/featured
// @access  Private (Admin only)
const toggleFeatured = async (req, res, next) => {
  try {
    const hostel = await Hostel.findById(req.params.id);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'HOSTEL_NOT_FOUND',
          message: 'Hostel not found'
        }
      });
    }

    await hostel.toggleFeatured();

    res.status(200).json({
      success: true,
      message: `Hostel ${hostel.featured ? 'featured' : 'unfeatured'} successfully`,
      data: {
        hostel: {
          id: hostel._id,
          name: hostel.name,
          featured: hostel.featured
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get hostel stats for admin
// @route   GET /api/hostels/admin/stats
// @access  Private (Admin only)
const getHostelStats = async (req, res, next) => {
  try {
    const totalHostels = await Hostel.countDocuments();
    const activeHostels = await Hostel.countDocuments({ isActive: true });
    const featuredHostels = await Hostel.countDocuments({ featured: true, isActive: true });
    
    // Get top 5 most clicked hostels
    const topHostels = await Hostel.find({ isActive: true })
      .sort({ clicks: -1 })
      .limit(5)
      .select('name clicks');

    // Get recent hostels (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentHostels = await Hostel.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    // Total clicks across all hostels
    const totalClicksResult = await Hostel.aggregate([
      { $group: { _id: null, totalClicks: { $sum: '$clicks' } } }
    ]);
    const totalClicks = totalClicksResult[0]?.totalClicks || 0;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalHostels,
          activeHostels,
          featuredHostels,
          recentHostels,
          totalClicks,
          inactiveHostels: totalHostels - activeHostels
        },
        topHostels
      }
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHostels,
  getHostel,
  getFeaturedHostels,
  getPopularHostels,
  createHostel,
  updateHostel,
  deleteHostel,
  toggleFeatured,
  getHostelStats
};