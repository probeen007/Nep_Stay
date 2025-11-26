import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Star, Wifi, Car, Coffee, Shield } from 'lucide-react';
import { hostelService } from '../services';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import CustomerReviews from '../components/sections/CustomerReviews';
import AnimatedHospitalityPhrase from '../components/common/AnimatedHospitalityPhrase';

const HomePage = () => {
  const [featuredHostels, setFeaturedHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFeaturedHostels();
  }, []);

  const fetchFeaturedHostels = async () => {
    try {
      setLoading(true);
      
      // First try to get featured hostels
      let response = await hostelService.getFeaturedHostels(6);
      let hostels = response.data?.hostels || [];
      
      // If no featured hostels, fall back to regular hostels
      if (hostels.length === 0) {
        response = await hostelService.getHostels({ limit: 6, sort: '-createdAt' });
        hostels = response.data?.hostels || [];
      }
      
      setFeaturedHostels(hostels);
    } catch (error) {
      setError('Failed to load hostels');
      console.error('Error fetching hostels:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFacilityIcon = (facility) => {
    const icons = {
      'wifi': Wifi,
      'parking': Car,
      'breakfast': Coffee,
      'security': Shield
    };
    
    const IconComponent = icons[facility.toLowerCase()] || Shield;
    return <IconComponent size={16} />;
  };

  const handleHostelClick = async (hostelId) => {
    try {
      await hostelService.trackClick(hostelId);
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-hero py-20 overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative container mx-auto px-6 text-center text-white"
        >
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h1 className="text-7xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-white mb-2">
              Nep Stay
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-white to-nep-gray-300 mx-auto rounded-full"></div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8"
          >
            <AnimatedHospitalityPhrase />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-8"
          >
          
          </motion.div>
          
          <motion.p 
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed font-light opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Your gateway to authentic Nepali hospitality. 
            Find perfect hostels across Nepal with genuine reviews from fellow travelers.
          </motion.p>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link
              to="/search"
              className="group bg-white text-nep-red px-8 py-4 rounded-xl font-semibold text-lg hover:bg-nep-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              <span className="flex items-center justify-center gap-2">
                Start Your Journey
                <motion.span
                  className="group-hover:translate-x-1 transition-transform"
                  whileHover={{ x: 4 }}
                >
                  →
                </motion.span>
              </span>
            </Link>
            
            <Link
              to="/search"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-nep-red transition-all duration-300 shadow-xl"
            >
              Browse Hostels
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6"
            >
              <div className="text-4xl font-bold text-nep-red mb-2">50+</div>
              <div className="text-gray-600">Quality Hostels</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6"
            >
              <div className="text-4xl font-bold text-nepali-saffron mb-2">15+</div>
              <div className="text-gray-600">Areas Covered</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6"
            >
              <div className="text-4xl font-bold text-nepali-blue mb-2">1000+</div>
              <div className="text-gray-600">Happy Guests</div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6"
            >
              <div className="text-4xl font-bold text-nep-red mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Hostels */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Featured Hostels
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our handpicked selection of the best hostels in Kathmandu
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchFeaturedHostels}
                className="btn-primary"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredHostels.map((hostel, index) => (
                <motion.div
                  key={hostel._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Card className="overflow-hidden h-full">
                    <div className="relative">
                      <img
                        src={hostel.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e460b1e1.jpg'}
                        alt={hostel.name}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e460b1e1.jpg';
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="primary">
                          Rs. {hostel.price}/night
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-semibold">4.{Math.floor(Math.random() * 5) + 3}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-nep-red transition-colors">
                          {hostel.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-3">
                        <MapPin className="w-4 h-4 mr-2 text-nep-red" />
                        <span className="text-sm">{hostel.address}</span>
                      </div>
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {hostel.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hostel.facilities.slice(0, 4).map((facility, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                          >
                            {getFacilityIcon(facility)}
                            <span className="capitalize">{facility}</span>
                          </div>
                        ))}
                        {hostel.facilities.length > 4 && (
                          <div className="text-xs bg-nep-red text-white px-2 py-1 rounded-full">
                            +{hostel.facilities.length - 4} more
                          </div>
                        )}
                      </div>
                      
                      <Link
                        to={`/hostel/${hostel._id}`}
                        onClick={() => handleHostelClick(hostel._id)}
                        className="block w-full text-center bg-gradient-to-r from-nep-red to-red-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          
          {!loading && !error && featuredHostels.length === 0 && (
            <div className="text-center">
              <p className="text-gray-600 mb-4">No hostels found</p>
              <Link to="/search" className="btn-primary">
                Browse All Hostels
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Why Choose KathmanduHostels?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make finding and booking hostels in Kathmandu simple and secure
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-nep-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-nep-red" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Listings</h3>
              <p className="text-gray-600">
                All hostels are personally verified for quality and safety standards
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-nepali-saffron/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-nepali-saffron" />
              </div>
              <h3 className="text-xl font-bold mb-3">Perfect Locations</h3>
              <p className="text-gray-600">
                Find hostels in prime locations across Kathmandu's best areas
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center p-6"
            >
              <div className="w-16 h-16 bg-nepali-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-nepali-blue" />
              </div>
              <h3 className="text-xl font-bold mb-3">Best Prices</h3>
              <p className="text-gray-600">
                Compare prices and find the best deals on quality accommodations
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <CustomerReviews />

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="container mx-auto px-6 text-center"
        >
          <h2 className="text-4xl font-bold mb-6">
            Ready to Explore Nepal?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who have found their perfect stay with Nep Stay
          </p>
          <Link
            to="/search"
            className="bg-white text-nep-red px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Find Your Hostel Now
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default HomePage;