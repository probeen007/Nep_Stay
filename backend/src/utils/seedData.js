const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const Hostel = require('../models/Hostel');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

// Seed initial admin user
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@kathmanduhostels.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'SecurePassword123!';

    const existingAdmin = await Admin.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    await Admin.createInitialAdmin(adminEmail, adminPassword);
    console.log(`Initial admin created: ${adminEmail}`);
  } catch (error) {
    console.error('Error seeding admin:', error.message);
  }
};

// Sample hostel data
const sampleHostels = [
  {
    name: "Himalayan Paradise Hostel",
    description: "Experience the beauty of the Himalayas right from the heart of Kathmandu. Our hostel offers comfortable accommodation with traditional Nepali hospitality. Located in the vibrant Thamel area, you'll have easy access to restaurants, shops, and cultural sites. Perfect for backpackers and budget travelers looking for a authentic Nepali experience.",
    shortDescription: "Comfortable hostel in Thamel with traditional Nepali hospitality and mountain views.",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop"
    ],
    price: 1200,
    contact: {
      phone: "+9771234567890",
      whatsapp: "+9771234567890",
      facebook: "https://facebook.com/himalayan-paradise-hostel",
      instagram: "https://instagram.com/himalayan_paradise_hostel",
      website: "https://himalayanparadise.com"
    },
    address: "Thamel, Kathmandu, Nepal",
    coordinates: {
      lat: 27.7155,
      lng: 85.3129
    },
    googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.3942819942195!2d85.31073581506186!3d27.714534382794745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190b3ab64b01%3A0x11f5130c21d839e2!2sThamel%2C%20Kathmandu%2C%20Nepal!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus",
    facilities: ["Free WiFi", "Hot Shower", "Laundry Service", "24/7 Reception", "Rooftop Terrace", "Travel Desk"],
    featured: true,
    clicks: 245
  },
  {
    name: "Mount Everest Backpackers",
    description: "Budget-friendly accommodation for adventurous travelers. Our hostel provides basic but clean facilities in the heart of Kathmandu. With a focus on community and adventure, we help you connect with fellow travelers and plan your trekking adventures. Great location near major tourist attractions and easy access to public transportation.",
    shortDescription: "Budget backpacker hostel perfect for adventure seekers and mountain enthusiasts.",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=600&fit=crop"
    ],
    price: 800,
    contact: {
      phone: "+9779876543210",
      whatsapp: "+9779876543210",
      facebook: "https://facebook.com/everest-backpackers",
      website: ""
    },
    address: "Freak Street, Kathmandu, Nepal",
    coordinates: {
      lat: 27.7017,
      lng: 85.3206
    },
    googleMapsUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.6485619926357!2d85.31801831506163!3d27.701771282804893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb190b0a6b2c01%3A0x4c2b87a3c8d5e6f7!2sFreak%20Street%2C%20Kathmandu%2C%20Nepal!5e0!3m2!1sen!2sus!4v1700000000001!5m2!1sen!2sus",
    facilities: ["Free WiFi", "Shared Kitchen", "Common Room", "Luggage Storage", "Trek Planning"],
    featured: false,
    clicks: 178
  },
  {
    name: "Kathmandu Heritage House",
    description: "Stay in a beautifully restored traditional Newari house in the heart of Kathmandu's old city. Our heritage hostel offers a unique cultural experience while maintaining modern comfort standards. Each room features traditional architecture with contemporary amenities. Perfect for cultural enthusiasts and history lovers.",
    shortDescription: "Traditional Newari architecture meets modern comfort in historic Kathmandu.",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop"
    ],
    price: 1500,
    contact: {
      phone: "+9771122334455",
      whatsapp: "+9771122334455",
      facebook: "https://facebook.com/heritage-house-ktm",
      instagram: "https://instagram.com/heritage_house_ktm"
    },
    address: "Durbar Square Area, Kathmandu, Nepal",
    coordinates: {
      lat: 27.7040,
      lng: 85.3070
    },
    facilities: ["Free WiFi", "Cultural Tours", "Traditional Breakfast", "Courtyard", "Heritage Architecture", "24/7 Security"],
    featured: true,
    clicks: 312
  },
  {
    name: "Sherpa Lodge Kathmandu",
    description: "Authentic mountain lodge experience in the city. Run by experienced Sherpa family, offering insights into Himalayan culture and trekking expertise. Clean, comfortable rooms with a warm, family atmosphere. Great place to meet other trekkers and get local advice about mountain adventures.",
    shortDescription: "Family-run Sherpa lodge with authentic mountain hospitality and trekking expertise.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop"
    ],
    price: 1000,
    contact: {
      phone: "+9775566778899",
      whatsapp: "+9775566778899",
      instagram: "https://instagram.com/sherpa_lodge_ktm"
    },
    address: "Chhetrapati, Kathmandu, Nepal",
    coordinates: {
      lat: 27.7089,
      lng: 85.3151
    },
    facilities: ["Free WiFi", "Family Atmosphere", "Trekking Advice", "Home-cooked Meals", "Mountain Views"],
    featured: false,
    clicks: 156
  },
  {
    name: "Peaceful Garden Hostel",
    description: "Escape the hustle and bustle of Kathmandu in our tranquil garden hostel. Surrounded by beautiful gardens and peaceful atmosphere, perfect for relaxation after long travels. Modern facilities combined with nature's serenity. Ideal for digital nomads and travelers seeking peace in the city.",
    shortDescription: "Tranquil garden hostel offering peace and modern amenities away from city chaos.",
    images: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586611292717-f828b167408c?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578774204375-826dc5d996ed?w=800&h=600&fit=crop"
    ],
    price: 1300,
    contact: {
      phone: "+9773344556677",
      whatsapp: "+9773344556677",
      facebook: "https://facebook.com/peaceful-garden-hostel",
      website: "https://peacefulgarden.hostel.com"
    },
    address: "Lazimpat, Kathmandu, Nepal",
    coordinates: {
      lat: 27.7219,
      lng: 85.3206
    },
    facilities: ["Free WiFi", "Garden Area", "Quiet Environment", "Work Spaces", "Meditation Area", "Healthy Food"],
    featured: true,
    clicks: 203
  },
  {
    name: "Yak & Yeti Backpackers",
    description: "Lively hostel perfect for young travelers and party enthusiasts. Central location with easy access to Kathmandu's nightlife and entertainment. Social atmosphere with common areas designed for meeting fellow travelers. Clean facilities with energetic vibe.",
    shortDescription: "Social hostel with vibrant atmosphere, perfect for meeting travelers and nightlife.",
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1609766857041-ed402ea8069a?w=800&h=600&fit=crop"
    ],
    price: 900,
    contact: {
      phone: "+9777788990011",
      whatsapp: "+9777788990011",
      facebook: "https://facebook.com/yak-yeti-backpackers"
    },
    address: "Jyatha, Thamel, Kathmandu, Nepal",
    coordinates: {
      lat: 27.7148,
      lng: 85.3111
    },
    facilities: ["Free WiFi", "Common Room", "Social Activities", "Nightlife Access", "Travel Information"],
    featured: false,
    clicks: 134
  }
];

// Seed sample hostels
const seedHostels = async () => {
  try {
    const existingHostels = await Hostel.countDocuments();
    
    if (existingHostels > 0) {
      console.log('Sample hostels already exist');
      return;
    }

    for (const hostelData of sampleHostels) {
      const slug = hostelData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '') + '-' + Date.now().toString(36);
      
      await Hostel.create({ ...hostelData, slug });
    }

    console.log(`${sampleHostels.length} sample hostels created`);
  } catch (error) {
    console.error('Error seeding hostels:', error.message);
  }
};

// Main seeding function
const seedData = async () => {
  try {
    await connectDB();
    await seedAdmin();
    await seedHostels();
    console.log('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedData();
}

module.exports = {
  seedData,
  seedAdmin,
  seedHostels
};