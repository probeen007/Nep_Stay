const mongoose = require('mongoose');

// Cache the database connection
let cachedDb = null;

const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('=> Using cached database connection');
    return cachedDb;
  }

  console.log('=> Creating new database connection');
  
  try {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      bufferCommands: false, // Disable buffering
      maxPoolSize: 10,
    };

    const db = await mongoose.connect(process.env.MONGODB_URI, opts);
    cachedDb = db;
    console.log('=> MongoDB connected successfully');
    return db;
  } catch (error) {
    console.error('=> MongoDB connection error:', error);
    throw error;
  }
};

// Connect to database before loading app
connectDB().catch(err => console.error('Initial connection failed:', err));

const app = require('../src/server');

module.exports = app;
