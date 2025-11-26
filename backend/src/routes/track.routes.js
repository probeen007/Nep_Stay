const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { validate } = require('../middleware/validation');
const {
  trackClick,
  getClickAnalytics
} = require('../controllers/track.controller');

const router = express.Router();

// Public routes
router.post('/click', validate({
  hostelId: require('joi').string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid hostel ID',
      'any.required': 'Hostel ID is required'
    })
}), trackClick);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.get('/analytics', getClickAnalytics);

module.exports = router;