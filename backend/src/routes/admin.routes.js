const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardMetrics,
  getSystemInfo
} = require('../controllers/admin.controller');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

router.get('/metrics', getDashboardMetrics);
router.get('/system-info', getSystemInfo);

module.exports = router;