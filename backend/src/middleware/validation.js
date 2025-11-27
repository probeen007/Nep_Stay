const Joi = require('joi');

// Validate request data
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, '')
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: validationErrors
        }
      });
    }

    next();
  };
};

// Validate query parameters
const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.query, { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message.replace(/"/g, '')
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'QUERY_VALIDATION_ERROR',
          message: 'Invalid query parameters',
          details: validationErrors
        }
      });
    }

    next();
  };
};

// Common validation schemas
const schemas = {
  // Auth schemas
  login: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
      }),
    password: Joi.string()
      .min(6)
      .required()
      .messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
      })
  }),

  // Hostel schemas
  createHostel: Joi.object({
    name: Joi.string()
      .max(100)
      .required()
      .messages({
        'string.max': 'Hostel name cannot exceed 100 characters',
        'any.required': 'Hostel name is required'
      }),
    description: Joi.string()
      .max(2000)
      .required()
      .messages({
        'string.max': 'Description cannot exceed 2000 characters',
        'any.required': 'Description is required'
      }),
    shortDescription: Joi.string()
      .max(200)
      .required()
      .messages({
        'string.max': 'Short description cannot exceed 200 characters',
        'any.required': 'Short description is required'
      }),
    images: Joi.array()
      .items(Joi.string().uri().pattern(/\.(jpg|jpeg|png|webp|gif)$/i))
      .min(1)
      .max(10)
      .messages({
        'array.min': 'At least one image is required',
        'array.max': 'Maximum 10 images allowed',
        'string.pattern.base': 'Image must be a valid URL ending with jpg, jpeg, png, webp, or gif'
      }),
    pricePerNight: Joi.number()
      .positive()
      .required()
      .messages({
        'number.positive': 'Price must be a positive number',
        'any.required': 'Price is required'
      }),
    totalBeds: Joi.number()
      .integer()
      .positive()
      .required()
      .messages({
        'number.positive': 'Total beds must be a positive number',
        'any.required': 'Total beds is required'
      }),
    contact: Joi.object({
      phone: Joi.string()
        .pattern(/^(\+977)?[0-9]{10}$/)
        .required()
        .messages({
          'string.pattern.base': 'Please provide a valid Nepali phone number',
          'any.required': 'Phone number is required'
        }),
      whatsapp: Joi.string()
        .pattern(/^(\+977)?[0-9]{10}$/)
        .allow('')
        .messages({
          'string.pattern.base': 'Please provide a valid WhatsApp number'
        }),
      facebook: Joi.string()
        .uri()
        .allow('')
        .pattern(/facebook\.com/)
        .messages({
          'string.pattern.base': 'Please provide a valid Facebook URL'
        }),
      instagram: Joi.string()
        .uri()
        .allow('')
        .pattern(/instagram\.com/)
        .messages({
          'string.pattern.base': 'Please provide a valid Instagram URL'
        }),
      website: Joi.string()
        .uri()
        .allow('')
        .messages({
          'string.uri': 'Please provide a valid website URL'
        })
    }).required(),
    location: Joi.object({
      city: Joi.string()
        .required()
        .messages({
          'any.required': 'City is required'
        }),
      area: Joi.string()
        .required()
        .messages({
          'any.required': 'Area is required'
        }),
      address: Joi.string()
        .max(200)
        .required()
        .messages({
          'string.max': 'Address cannot exceed 200 characters',
          'any.required': 'Address is required'
        }),
      googleMapsUrl: Joi.string()
        .uri()
        .allow('', null)
        .messages({
          'string.uri': 'Please provide a valid Google Maps URL'
        })
    }).required(),
    facilities: Joi.array()
      .items(Joi.string().max(50))
      .max(20)
      .messages({
        'array.max': 'Maximum 20 facilities allowed',
        'string.max': 'Facility name cannot exceed 50 characters'
      }),
    rules: Joi.array()
      .items(Joi.string().max(200))
      .messages({
        'string.max': 'Rule cannot exceed 200 characters'
      }),
    featured: Joi.boolean()
  }),

  updateHostel: Joi.object({
    name: Joi.string()
      .max(100)
      .messages({
        'string.max': 'Hostel name cannot exceed 100 characters'
      }),
    description: Joi.string()
      .max(2000)
      .messages({
        'string.max': 'Description cannot exceed 2000 characters'
      }),
    shortDescription: Joi.string()
      .max(200)
      .messages({
        'string.max': 'Short description cannot exceed 200 characters'
      }),
    images: Joi.array()
      .items(Joi.string().uri().pattern(/\.(jpg|jpeg|png|webp|gif)$/i))
      .min(1)
      .max(10)
      .messages({
        'array.min': 'At least one image is required',
        'array.max': 'Maximum 10 images allowed',
        'string.pattern.base': 'Image must be a valid URL ending with jpg, jpeg, png, webp, or gif'
      }),
    pricePerNight: Joi.number()
      .positive()
      .messages({
        'number.positive': 'Price must be a positive number'
      }),
    totalBeds: Joi.number()
      .integer()
      .positive()
      .messages({
        'number.positive': 'Total beds must be a positive number'
      }),
    contact: Joi.object({
      phone: Joi.string()
        .pattern(/^(\+977)?[0-9]{10}$/)
        .messages({
          'string.pattern.base': 'Please provide a valid Nepali phone number'
        }),
      whatsapp: Joi.string()
        .pattern(/^(\+977)?[0-9]{10}$/)
        .allow('')
        .messages({
          'string.pattern.base': 'Please provide a valid WhatsApp number'
        }),
      facebook: Joi.string()
        .uri()
        .allow('')
        .pattern(/facebook\.com/)
        .messages({
          'string.pattern.base': 'Please provide a valid Facebook URL'
        }),
      instagram: Joi.string()
        .uri()
        .allow('')
        .pattern(/instagram\.com/)
        .messages({
          'string.pattern.base': 'Please provide a valid Instagram URL'
        }),
      website: Joi.string()
        .uri()
        .allow('')
        .messages({
          'string.uri': 'Please provide a valid website URL'
        })
    }),
    location: Joi.object({
      city: Joi.string()
        .messages({
          'any.required': 'City is required'
        }),
      area: Joi.string()
        .messages({
          'any.required': 'Area is required'
        }),
      address: Joi.string()
        .max(200)
        .messages({
          'string.max': 'Address cannot exceed 200 characters'
        }),
      googleMapsUrl: Joi.string()
        .uri()
        .allow('', null)
        .messages({
          'string.uri': 'Please provide a valid Google Maps URL'
        })
    }),
    facilities: Joi.array()
      .items(Joi.string().max(50))
      .max(20)
      .messages({
        'array.max': 'Maximum 20 facilities allowed',
        'string.max': 'Facility name cannot exceed 50 characters'
      }),
    rules: Joi.array()
      .items(Joi.string().max(200))
      .messages({
        'string.max': 'Rule cannot exceed 200 characters'
      }),
    featured: Joi.boolean(),
    isActive: Joi.boolean()
  }).min(1),

  // Query schemas
  hostelQuery: Joi.object({
    search: Joi.string().max(100).allow(''),
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    facilities: Joi.string().allow(''),
    featured: Joi.boolean(),
    sortBy: Joi.string().valid('clicks', 'price', 'createdAt', '-clicks', '-price', '-createdAt'),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(12)
  }),

  // Click tracking schema
  trackClick: Joi.object({
    hostelId: Joi.string()
      .pattern(/^[0-9a-fA-F]{24}$/)
      .required()
      .messages({
        'string.pattern.base': 'Invalid hostel ID',
        'any.required': 'Hostel ID is required'
      })
  })
};

module.exports = {
  validate,
  validateQuery,
  schemas
};