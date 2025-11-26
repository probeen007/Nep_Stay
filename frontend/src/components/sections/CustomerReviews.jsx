import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const CustomerReviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Prakash Shrestha",
      location: "Kathmandu, Nepal",
      rating: 5,
      review: "Nep Stay helped me find the perfect hostel in Thamel! The booking process was smooth and the place was exactly as described. Highly recommend!",
      reviewNp: "नेप स्टेले मलाई थामेलमा उत्कृष्ट होस्टेल भेट्न मद्दत गर्यो! बुकिङ प्रक्रिया सजिलो थियो र ठाउँ जस्तो वर्णन गरिएको थियो त्यस्तै थियो।",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      hostel: "Kathmandu Backpackers"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      location: "Australia",
      rating: 5,
      review: "Amazing experience staying at hostels found through Nep Stay. The staff was incredibly helpful and the facilities were clean and comfortable. Nepal is beautiful!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616c9efa8b3?w=100&h=100&fit=crop&crop=face",
      hostel: "Himalayan Lodge"
    },
    {
      id: 3,
      name: "Rajesh Gurung",
      location: "Pokhara, Nepal", 
      rating: 4,
      review: "Great platform for finding budget-friendly accommodation. Found a wonderful hostel with mountain views. The reviews were honest and helpful.",
      reviewNp: "बजेट-फ्रेन्डली आवास खोज्नको लागि उत्कृष्ट प्लेटफर्म। पहाडी दृश्य सहितको राम्रो होस्टेल भेटियो।",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      hostel: "Swayambhu Retreat"
    },
    {
      id: 4,
      name: "Lisa Chen",
      location: "Singapore",
      rating: 5,
      review: "Nep Stay made my Nepal trip unforgettable! Easy booking, great hostels, and excellent customer service. The local recommendations were spot on!",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      hostel: "Thamel Travellers Hub"
    },
    {
      id: 5,
      name: "Anita Tamang",
      location: "Lalitpur, Nepal",
      rating: 4,
      review: "पारिवारिक यात्राको लागि उत्कृष्ट सेवा। होस्टेल राम्रो थियो र कर्मचारीहरू मित्रवत् थिए। फेरि प्रयोग गर्नेछु।",
      reviewEn: "Excellent service for family travel. The hostel was great and staff were friendly. Will use again.",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop&crop=face",
      hostel: "Patan Youth Hostel"
    },
    {
      id: 6,
      name: "David Wilson",
      location: "UK",
      rating: 5,
      review: "Backpacked through Nepal using Nep Stay hostels. Every place was clean, safe, and full of fellow travelers. The app interface is user-friendly too!",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
      hostel: "Kathmandu Backpackers"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-nep-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-nep-red to-nep-navy bg-clip-text text-transparent mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real reviews from real travelers who found their perfect stay through Nep Stay
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                transition: { duration: 0.3 }
              }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 relative overflow-hidden"
            >
              {/* Background gradient overlay */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-nep-soft opacity-20 rounded-full -translate-y-16 translate-x-16"></div>
              
              {/* Quote icon */}
              <div className="absolute top-4 right-4 opacity-10">
                <Quote size={40} className="text-nep-red" />
              </div>

              {/* Star rating */}
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={`${
                      i < review.rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {review.rating}.0
                </span>
              </div>

              {/* Review text */}
              <div className="mb-6">
                {review.reviewNp ? (
                  <div className="space-y-3">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      "{review.review}"
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed italic border-l-2 border-nep-red pl-3">
                      "{review.reviewNp}"
                    </p>
                  </div>
                ) : review.reviewEn ? (
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm leading-relaxed italic border-l-2 border-nep-red pl-3">
                      "{review.review}"
                    </p>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      "{review.reviewEn}"
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    "{review.review}"
                  </p>
                )}
              </div>

              {/* User info */}
              <div className="flex items-center">
                <img
                  src={review.avatar}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-nep-gray-200"
                />
                <div className="ml-4 flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {review.name}
                  </h4>
                  <p className="text-gray-500 text-xs">
                    {review.location}
                  </p>
                  <p className="text-nep-red text-xs font-medium">
                    Stayed at {review.hostel}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-nep-red to-nep-navy rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Join Thousands of Happy Travelers</h3>
            <p className="text-lg opacity-90 mb-6">
              Book your perfect hostel today and create memories that last a lifetime
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-nep-red px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
            >
              Start Your Journey
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CustomerReviews;