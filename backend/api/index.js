const mongoose = require('mongoose');
const express = require('express');

// Cache the database connection
let isConnecting = false;
let isConnected = false;

const connectDB = async () => {
  // If already connected, return immediately
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log('=> Using cached database connection');
    return Promise.resolve();
  }

  // If connection is in progress, wait for it
  if (isConnecting) {
    console.log('=> Waiting for existing connection attempt');
    while (isConnecting) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return Promise.resolve();
  }

  isConnecting = true;
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

    await mongoose.connect(process.env.MONGODB_URI, opts);
    isConnected = true;
    isConnecting = false;
    console.log('=> MongoDB connected successfully');
    return Promise.resolve();
  } catch (error) {
    isConnecting = false;
    isConnected = false;
    console.error('=> MongoDB connection error:', error);
    throw error;
  }
};

// Create wrapper that ensures DB connection before passing to app
const handler = async (req, res) => {
  try {
    // Ensure database is connected
    await connectDB();
    
    // Load the app only after DB connection
    if (!handler.app) {
      handler.app = require('../src/server');
    }
    
    // Handle the request
    return handler.app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(503).json({
      success: false,
      error: {
        message: 'Database service unavailable',
        details: error.message
      }
    });
  }
};

module.exports = handler;
