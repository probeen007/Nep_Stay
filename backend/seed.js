require('dotenv').config();
const mongoose = require('mongoose');
const Hostel = require('./src/models/Hostel');

const seedData = [
  {
    name: "Kathmandu Backpackers",
    description: "A cozy hostel in the heart of Thamel, perfect for backpackers exploring Kathmandu. Clean facilities, friendly staff, and great location near restaurants and shops.",
    shortDescription: "Cozy backpacker hostel in the heart of Thamel with great facilities and friendly staff.",
    slug: "kathmandu-backpackers",
    address: "Thamel Marg, Kathmandu 44600",
    coordinates: {
      lat: 27.7115,
      lng: 85.3111
    },
    contact: {
      phone: "9841234567",
      website: "https://kathmandubackpackers.com"
    },
    price: 1200,
    images: [
      "https://images.unsplash.com/photo-1555854877-bab0e460b1e1.jpg",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945.jpg"
    ],
    facilities: ["Free WiFi", "Hot Shower", "Laundry Service", "24/7 Reception", "Common Kitchen", "Rooftop Terrace"],
    featured: true,
    isActive: true
  },
  {
    name: "Himalayan Lodge",
    description: "Traditional Nepalese lodge offering authentic mountain hospitality in Bhaktapur. Experience local culture while enjoying modern amenities.",
    shortDescription: "Traditional Nepalese lodge in Bhaktapur with authentic mountain hospitality.",
    slug: "himalayan-lodge",
    address: "Durbar Square, Bhaktapur 44800",
    coordinates: {
      lat: 27.6710,
      lng: 85.4298
    },
    contact: {
      phone: "9851234567",
      website: "https://himalayanlodge.np"
    },
    price: 2200,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d.jpg",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461.jpg"
    ],
    facilities: ["Free WiFi", "Restaurant", "Hot Water", "Garden View", "Luggage Storage", "Tour Desk"],
    featured: true,
    isActive: true
  },
  {
    name: "Patan Youth Hostel",
    description: "Modern hostel in historic Patan, ideal for young travelers and students. Close to Patan Durbar Square and artisan workshops.",
    shortDescription: "Modern hostel in historic Patan, ideal for young travelers and students.",
    slug: "patan-youth-hostel",
    address: "Mangal Bazaar, Patan 44700",
    coordinates: {
      lat: 27.6744,
      lng: 85.3250
    },
    contact: {
      phone: "9861234567",
      website: "https://patanyouthhostel.com"
    },
    price: 900,
    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791.jpg",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267.jpg"
    ],
    facilities: ["Free WiFi", "Shared Kitchen", "Study Area", "Game Room", "Bicycle Rental", "Security Lockers"],
    isActive: true
  },
  {
    name: "Swayambhu Retreat",
    description: "Peaceful retreat near Swayambhunath Temple. Perfect for meditation enthusiasts and spiritual travelers seeking tranquility.",
    shortDescription: "Peaceful retreat near Swayambhunath Temple for meditation enthusiasts.",
    slug: "swayambhu-retreat",
    address: "Swayambhu Hill, Kathmandu 44620",
    coordinates: {
      lat: 27.7147,
      lng: 85.2906
    },
    contact: {
      phone: "9871234567",
      website: "https://swayamabhuretreat.org"
    },
    price: 2500,
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4.jpg",
      "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9.jpg"
    ],
    facilities: ["Free WiFi", "Meditation Hall", "Yoga Classes", "Organic Garden", "Library", "Vegetarian Kitchen"],
    featured: true,
    isActive: true
  },
  {
    name: "Thamel Travellers Hub",
    description: "Vibrant hostel in central Thamel with rooftop views of the Himalayas. Great for meeting fellow travelers and exploring Kathmandu nightlife.",
    shortDescription: "Vibrant hostel in central Thamel with rooftop Himalayan views.",
    slug: "thamel-travellers-hub",
    address: "Thamel Chowk, Kathmandu 44600",
    coordinates: {
      lat: 27.7103,
      lng: 85.3101
    },
    contact: {
      phone: "9881234567",
      website: "https://thameltravellershub.com"
    },
    price: 1500,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa.jpg",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43.jpg"
    ],
    facilities: ["Free WiFi", "Rooftop Restaurant", "Shared Kitchen", "Laundry Service", "Common Area", "Mountain Views"],
    isActive: true
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');
    
    // Clear existing data
    await Hostel.deleteMany({});
    console.log('Cleared existing hostel data');
    
    // Insert seed data
    const hostels = await Hostel.insertMany(seedData);
    console.log(`✅ Successfully seeded ${hostels.length} hostels`);
    
    // Log seeded hostels
    hostels.forEach((hostel, index) => {
      console.log(`${index + 1}. ${hostel.name} (${hostel.address})`);
    });
    
    console.log('\n🎉 Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();