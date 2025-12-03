import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';
import { hostelService } from '../services';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHostels, setTotalHostels] = useState(0);

  const areas = [
    'All Areas',
    'Thamel',
    'Kathmandu Durbar Square',
    'Boudhanath',
    'Swayambhunath',
    'Patan',
    'Bhaktapur',
    'New Baneshwor',
    'Lazimpat',
    'Jhamsikhel',
    'Sanepa',
    'Baluwatar'
  ];

  const facilities = [
    'WiFi',
    'Parking',
    'Breakfast',
    'Laundry',
    'Security',
    'Kitchen',
    'Lounge',
    'Garden'
  ];

  useEffect(() => {
    fetchHostels();
  }, [searchQuery, selectedArea, priceRange, selectedFacilities, sortBy, currentPage]);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        limit: 12,
        sort: sortBy
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedArea && selectedArea !== 'All Areas') params.area = selectedArea;
      if (priceRange[0] > 0) params.minPrice = priceRange[0];
      if (priceRange[1] < 10000) params.maxPrice = priceRange[1];
      if (selectedFacilities.length > 0) params.facilities = selectedFacilities.join(',');

      const response = await hostelService.getAll(params);
      const data = response.data;
      
      setHostels(data.hostels || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalHostels(data.pagination?.total || 0);
      
    } catch (error) {
      setError('Failed to load hostels');
      console.error('Error fetching hostels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFacilityToggle = (facility) => {
    setSelectedFacilities(prev => 
      prev.includes(facility)
        ? prev.filter(f => f !== facility)
        : [...prev, facility]
    );
    setCurrentPage(1);
  };

  const handleHostelClick = async (hostelId) => {
    try {
      await hostelService.trackClick(hostelId);
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedArea('');
    setPriceRange([0, 10000]);
    setSelectedFacilities([]);
    setSortBy('name');
    setCurrentPage(1);
  };

  const HostelCard = ({ hostel, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`${viewMode === 'list' ? 'flex' : ''} group`}
    >
      <Card className={`overflow-hidden h-full ${viewMode === 'list' ? 'flex-row' : ''}`}>
        <div className={`relative ${viewMode === 'list' ? 'w-80 flex-shrink-0' : ''}`}>
          <img
            src={hostel.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e460b1e1.jpg'}
            alt={hostel.name}
            className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
              viewMode === 'list' ? 'w-full h-48' : 'w-full h-64'
            }`}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e460b1e1.jpg';
            }}
          />
          <div className="absolute top-4 left-4">
            <Badge variant="primary">
              Rs. {hostel.pricePerNight || hostel.price}/night
            </Badge>
          </div>
          <div className="absolute top-4 right-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold">4.{Math.floor(Math.random() * 5) + 3}</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-nep-red transition-colors">
              {hostel.name}
            </h3>
          </div>
          
          <div className="flex items-center text-gray-600 mb-3">
            <MapPin className="w-4 h-4 mr-2 text-nep-red" />
            <span className="text-sm">{hostel.location?.address || hostel.address}</span>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-2">
            {hostel.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {hostel.facilities.slice(0, viewMode === 'list' ? 6 : 4).map((facility, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
              >
                <span className="capitalize">{facility}</span>
              </div>
            ))}
            {hostel.facilities.length > (viewMode === 'list' ? 6 : 4) && (
              <div className="text-xs bg-nepali-red text-white px-2 py-1 rounded-full">
                +{hostel.facilities.length - (viewMode === 'list' ? 6 : 4)} more
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
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <section className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search hostels by name, area, or facilities..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 h-12"
              />
            </div>

            {/* Area Filter */}
            <select
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepali-red focus:border-transparent min-w-[200px]"
            >
              {areas.map(area => (
                <option key={area} value={area === 'All Areas' ? '' : area}>
                  {area}
                </option>
              ))}
            </select>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-80 flex-shrink-0`}>
            <Card className="p-6 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-nep-red hover:bg-red-50"
                >
                  Clear All
                </Button>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Price Range (₹/night)
                </label>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => {
                        setPriceRange([parseInt(e.target.value) || 0, priceRange[1]]);
                        setCurrentPage(1);
                      }}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => {
                        setPriceRange([priceRange[0], parseInt(e.target.value) || 10000]);
                        setCurrentPage(1);
                      }}
                      className="flex-1"
                    />
                  </div>
                  <div className="text-sm text-gray-500">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </div>
                </div>
              </div>

              {/* Facilities */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Facilities
                </label>
                <div className="space-y-2">
                  {facilities.map(facility => (
                    <label key={facility} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedFacilities.includes(facility)}
                        onChange={() => handleFacilityToggle(facility)}
                        className="w-4 h-4 text-nep-red border-gray-300 rounded focus:ring-nep-red"
                      />
                      <span className="ml-3 text-sm text-gray-700">{facility}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nepali-red focus:border-transparent"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="-name">Name (Z-A)</option>
                  <option value="price">Price (Low to High)</option>
                  <option value="-price">Price (High to Low)</option>
                  <option value="-createdAt">Newest First</option>
                  <option value="createdAt">Oldest First</option>
                </select>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {searchQuery ? `Search Results for "${searchQuery}"` : 'All Hostels'}
                </h1>
                <p className="text-gray-600">
                  {loading ? 'Loading...' : `${totalHostels} hostel${totalHostels !== 1 ? 's' : ''} found`}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <Button onClick={fetchHostels} variant="primary">
                  Try Again
                </Button>
              </div>
            )}

            {/* No Results */}
            {!loading && !error && hostels.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No hostels match your search criteria</p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Results */}
            {!loading && !error && hostels.length > 0 && (
              <>
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                    : 'space-y-6'
                }`}>
                  {hostels.map((hostel, index) => (
                    <HostelCard key={hostel._id} hostel={hostel} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-12">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'primary' : 'outline'}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;