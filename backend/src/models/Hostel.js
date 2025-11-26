const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Hostel name is required'],
    trim: true,
    maxlength: [100, 'Hostel name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Please provide a valid image URL'
    }
  }],
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  contact: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      validate: {
        validator: function(v) {
          return /^(\+977)?[0-9]{10}$/.test(v.replace(/[\s-]/g, ''));
        },
        message: 'Please provide a valid Nepali phone number'
      }
    },
    whatsapp: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^(\+977)?[0-9]{10}$/.test(v.replace(/[\s-]/g, ''));
        },
        message: 'Please provide a valid WhatsApp number'
      }
    },
    facebook: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?facebook\.com\/.+$/i.test(v);
        },
        message: 'Please provide a valid Facebook URL'
      }
    },
    instagram: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?instagram\.com\/.+$/i.test(v);
        },
        message: 'Please provide a valid Instagram URL'
      }
    },
    website: {
      type: String,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+\..+$/i.test(v);
        },
        message: 'Please provide a valid website URL'
      }
    }
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    maxlength: [200, 'Address cannot exceed 200 characters']
  },
  coordinates: {
    lat: {
      type: Number,
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    lng: {
      type: Number,
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  googleMapsUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https:\/\/www\.google\.com\/maps\/embed/.test(v);
      },
      message: 'Please provide a valid Google Maps embed URL'
    }
  },
  facilities: [{
    type: String,
    trim: true,
    maxlength: [50, 'Facility name cannot exceed 50 characters']
  }],
  featured: {
    type: Boolean,
    default: false
  },
  clicks: {
    type: Number,
    default: 0,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
hostelSchema.index({ slug: 1 });
hostelSchema.index({ featured: -1, clicks: -1 });
hostelSchema.index({ name: 'text', address: 'text', facilities: 'text' });
hostelSchema.index({ createdAt: -1 });
hostelSchema.index({ price: 1 });
hostelSchema.index({ isActive: 1 });

// Pre-save middleware to generate slug
hostelSchema.pre('save', function(next) {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    
    // Ensure uniqueness
    const timestamp = Date.now().toString(36);
    this.slug = `${this.slug}-${timestamp}`;
  }
  next();
});

// Virtual for formatted price
hostelSchema.virtual('formattedPrice').get(function() {
  return `Rs. ${this.price.toLocaleString()}`;
});

// Static method to get popular hostels
hostelSchema.statics.getPopular = function(limit = 6) {
  return this.find({ isActive: true })
    .sort({ clicks: -1, createdAt: -1 })
    .limit(limit);
};

// Static method to get featured hostels
hostelSchema.statics.getFeatured = function(limit = 6) {
  return this.find({ featured: true, isActive: true })
    .sort({ clicks: -1, createdAt: -1 })
    .limit(limit);
};

// Instance method to increment clicks
hostelSchema.methods.incrementClicks = function() {
  this.clicks += 1;
  return this.save();
};

// Instance method to toggle featured status
hostelSchema.methods.toggleFeatured = function() {
  this.featured = !this.featured;
  return this.save();
};

module.exports = mongoose.model('Hostel', hostelSchema);