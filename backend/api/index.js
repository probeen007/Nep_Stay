const mongoose = require('mongoose');
const app = require('../src/server');

// Cache the database connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('=> Using cached database connection');
    return Promise.resolve();
  }

  if (mongoose.connection.readyState === 2) {
    console.log('=> Database connection is connecting...');
    // Wait for existing connection attempt
    return new Promise((resolve, reject) => {
      mongoose.connection.once('connected', () => {
        isConnected = true;
        resolve();
      });
      mongoose.connection.once('error', reject);
    });
  }

  console.log('=> Creating new database connection');
  
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });
    
    isConnected = true;
    console.log('=> MongoDB connected successfully');
  } catch (error) {
    console.error('=> MongoDB connection error:', error);
    throw error;
  }
};

// Serverless function handler
module.exports = async (req, res) => {
  try {
    // Ensure database is connected before handling request
    await connectDB();
    
    // Pass request to Express app
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Internal server error',
        details: error.message
      }
    });
  }
};
