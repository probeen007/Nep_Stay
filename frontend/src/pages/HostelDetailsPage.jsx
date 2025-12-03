import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Star, 
  Share2, 
  Phone, 
  Mail, 
  Wifi, 
  Car, 
  Coffee, 
  Shield,
  Users,
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { hostelService } from '../services';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import GoogleMiniMap from '../components/ui/GoogleMiniMap';

const HostelDetailsPage = () => {
  const { id } = useParams();
  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    fetchHostelDetails();
  }, [id]);

  const fetchHostelDetails = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('HostelDetailsPage: Fetching hostel with ID:', id);
      
      const response = await hostelService.getById(id);
      console.log('HostelDetailsPage: API response:', response);
      console.log('HostelDetailsPage: Response data structure:', response.data);
      
      // Backend returns {success: true, data: {hostel: {...}}}
      // So response.data contains {hostel: {...}}
      const hostelData = response.data.hostel || response.data;
      console.log('HostelDetailsPage: Extracted hostel data:', hostelData);
      
      setHostel(hostelData);
      
      // Track click
      try {
        await hostelService.trackClick(id);
      } catch (trackError) {
        console.warn('Failed to track click:', trackError);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load hostel details';
      setError(errorMessage);
      console.error('HostelDetailsPage: Error fetching hostel details:', error);
      console.error('HostelDetailsPage: Error response:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const getFacilityIcon = (facility) => {
    const icons = {
      'wifi': Wifi,
      'parking': Car,
      'breakfast': Coffee,
      'security': Shield,
      'laundry': Users,
      'kitchen': Coffee,
      'lounge': Users,
      'garden': Users
    };
    
    const IconComponent = icons[facility.toLowerCase()] || Shield;
    return <IconComponent size={20} />;
  };

  const handleShare = async () => {
    if (navigator.share && hostel) {
      try {
        await navigator.share({
          title: `${hostel.name} - KathmanduHostels`,
          text: `Check out ${hostel.name} at ${hostel.location?.address || hostel.address}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Sharing failed:', error);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (error) {
        console.log('Clipboard write failed:', error);
      }
    }
  };

  const nextImage = () => {
    if (hostel?.images) {
      setCurrentImageIndex((prev) => 
        prev === hostel.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (hostel?.images) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? hostel.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !hostel) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Hostel not found'}</p>
          <Link to="/search" className="text-nep-red hover:underline">
            ← Back to Search
          </Link>
        </div>
      </div>
    );
  }

  const images = hostel.images || ['https://images.unsplash.com/photo-1555854877-bab0e460b1e1.jpg'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-end">
            <Button
              variant="outline"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="relative h-96 bg-gray-200">
                <img
                  src={images[currentImageIndex]}
                  alt={hostel.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e460b1e1.jpg';
                  }}
                />
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-3 h-3 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                <div className="absolute top-4 left-4">
                  <Badge variant="primary" className="text-lg px-4 py-2">
                    Rs. {hostel.pricePerNight || hostel.price}/night
                  </Badge>
                </div>
                
                <div className="absolute top-4 right-4">
                  <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">4.{Math.floor(Math.random() * 5) + 3}</span>
                    <span className="text-gray-600 text-sm">({Math.floor(Math.random() * 100) + 20} reviews)</span>
                  </div>
                </div>
              </div>
              
              {images.length > 1 && (
                <div className="p-4 border-t">
                  <div className="grid grid-cols-4 gap-2">
                    {images.slice(0, 4).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`relative h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                          index === currentImageIndex ? 'border-nep-red' : 'border-transparent'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e460b1e1.jpg';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Hostel Info */}
            <Card className="p-8">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">
                  {hostel.name}
                </h1>
                
                <div className="flex items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-nep-red" />
                    <span>{hostel.location?.address || hostel.address}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-nepali-saffron" />
                    <span>{hostel.totalBeds} beds available</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-lg leading-relaxed">
                  {hostel.description}
                </p>
              </div>

              {/* Contact Info */}
              {(hostel.contactInfo?.phone || hostel.contactInfo?.email) && (
                <div className="mb-8 p-6 bg-gray-50 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {hostel.contactInfo.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-nep-red" />
                        <a 
                          href={`tel:${hostel.contactInfo.phone}`}
                          className="text-nep-red hover:underline"
                        >
                          {hostel.contactInfo.phone}
                        </a>
                      </div>
                    )}
                    {hostel.contactInfo.email && (
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-nep-red" />
                        <a 
                          href={`mailto:${hostel.contactInfo.email}`}
                          className="text-nep-red hover:underline"
                        >
                          {hostel.contactInfo.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Facilities */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Facilities & Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {hostel.facilities.map((facility, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      {getFacilityIcon(facility)}
                      <span className="capitalize font-medium">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* House Rules */}
              {hostel.rules && hostel.rules.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">House Rules</h3>
                  <ul className="space-y-2">
                    {hostel.rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-nep-red rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Booking Card */}
            <div className="sticky top-24 space-y-6">
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-nep-red mb-2">
                  Rs. {hostel.pricePerNight || hostel.price}
                </div>
                <div className="text-gray-600">per night</div>
              </div>

              <div className="space-y-4">
                <Button 
                  variant="primary" 
                  className="w-full h-12 text-lg"
                  onClick={() => {
                    if (hostel.contactInfo?.phone) {
                      window.open(`tel:${hostel.contactInfo.phone}`);
                    } else if (hostel.contactInfo?.email) {
                      window.open(`mailto:${hostel.contactInfo.email}`);
                    }
                  }}
                >
                  Contact Hostel
                </Button>
                
                <div className="text-center text-sm text-gray-500">
                  Contact directly for availability and booking
                </div>
              </div>

              <div className="mt-6 pt-6 border-t space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Total beds:</span>
                  <span className="font-semibold">{hostel.totalBeds}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Check-in:</span>
                  <span className="font-semibold">
                    {hostel.checkInTime ? new Date(`2000-01-01T${hostel.checkInTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '2:00 PM'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Check-out:</span>
                  <span className="font-semibold">
                    {hostel.checkOutTime ? new Date(`2000-01-01T${hostel.checkOutTime}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }) : '11:00 AM'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Location Card */}
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-nep-red" />
                Location & Map
              </h3>
              
              <div className="mb-6">
                <div className="flex items-start gap-3 text-gray-700 bg-gray-50 p-4 rounded-lg">
                  <MapPin className="w-5 h-5 text-nep-red mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{hostel.name}</p>
                    <p className="text-gray-600">{hostel.location?.address || hostel.address}</p>
                  </div>
                </div>
              </div>

              {/* Google Mini Map */}
              <GoogleMiniMap
                googleMapsUrl={hostel.googleMapsUrl || hostel.location?.googleMapsUrl}
                hostelName={hostel.name}
                address={hostel.location?.address || hostel.address}
              />
              
              {/* Show coordinates as fallback if no Google Maps URL */}
              {!hostel.googleMapsUrl && !hostel.location?.googleMapsUrl && hostel.location?.coordinates && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-800 text-sm mb-2 font-medium">
                    📍 Approximate Location Coordinates:
                  </p>
                  <p className="text-blue-600 text-sm">
                    Lat: {hostel.location.coordinates.lat}, Lng: {hostel.location.coordinates.lng}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-3 flex items-center gap-2 bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-200"
                    onClick={() => {
                      const { lat, lng } = hostel.location.coordinates;
                      window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
                    }}
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Google Maps
                  </Button>
                </div>
              )}
            </Card>

            {/* Quick Info Card */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Area</span>
                  <Badge variant="outline">{hostel.location?.area || hostel.address}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Price Range</span>
                  <Badge variant="primary">Budget</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Facilities</span>
                  <span className="text-sm font-medium">{hostel.facilities.length} available</span>
                </div>
              </div>
            </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Back Button at Bottom */}
      <div className="container mx-auto px-6 pb-8">
        <div className="flex justify-center">
          <Link
            to="/search"
            className="flex items-center gap-2 px-6 py-3 bg-nep-red text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Hostels
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HostelDetailsPage;