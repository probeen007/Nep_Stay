const express = require('express');
const rateLimit = require('express-rate-limit');
const { protect } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const {
  login,
  logout,
  getMe,
  checkStatus
} = require('../controllers/auth.controller');

const router = express.Router();

// Rate limiting for login route
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: {
    success: false,
    error: {
      code: 'LOGIN_RATE_LIMIT_EXCEEDED',
      message: 'Too many login attempts from this IP, please try again after 15 minutes.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true
});

// Public routes
router.post('/login', loginLimiter, validate(schemas.login), login);
router.get('/status', checkStatus);

// Protected routes
router.use(protect); // All routes after this middleware are protected
router.post('/logout', logout);
router.get('/me', getMe);

module.exports = router;