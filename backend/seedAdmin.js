require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./src/models/Admin');

const seedAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB for admin seeding...');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kathmanduhostels.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'SecurePassword123!';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists:', adminEmail);
      console.log('You can use these credentials:');
      console.log('Email:', adminEmail);
      console.log('Password:', adminPassword);
      process.exit(0);
    }

    // Create new admin
    const admin = new Admin({
      email: adminEmail,
      passwordHash: adminPassword,
      role: 'admin'
    });

    await admin.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('Login credentials:');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('Login URL: http://localhost:3000/admin');
    
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedAdmin();