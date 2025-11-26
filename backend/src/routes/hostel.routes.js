const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { validate, validateQuery, schemas } = require('../middleware/validation');
const {
  getHostels,
  getHostel,
  getFeaturedHostels,
  getPopularHostels,
  createHostel,
  updateHostel,
  deleteHostel,
  toggleFeatured,
  getHostelStats
} = require('../controllers/hostel.controller');

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedHostels);
router.get('/popular', getPopularHostels);
router.get('/', validateQuery(schemas.hostelQuery), getHostels);
router.get('/:id', getHostel);

// Admin routes - require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/admin/stats', getHostelStats);
router.post('/', validate(schemas.createHostel), createHostel);
router.put('/:id', validate(schemas.updateHostel), updateHostel);
router.put('/:id/featured', toggleFeatured);
router.delete('/:id', deleteHostel);

module.exports = router;