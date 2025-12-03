import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, MapPin, Save, CheckCircle, Building, Phone, Mail, Image, Shield, AlertTriangle } from 'lucide-react';
import { hostelService } from '../../services';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const EditHostel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerNight: '',
    totalBeds: '',
    checkInTime: '14:00',
    checkOutTime: '11:00',
    featured: false,
    location: {
      area: '',
      address: '',
      googleMapsUrl: ''
    },
    contactInfo: {
      phone: '',
      email: ''
    },
    images: [''],
    facilities: [],
    rules: ['']
  });

  const areas = [
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

  const availableFacilities = [
    'WiFi',
    'Parking',
    'Breakfast',
    'Laundry',
    'Security',
    'Kitchen',
    'Lounge',
    'Garden',
    'AC',
    'Heating',
    'Hot Water',
    'Luggage Storage'
  ];

  useEffect(() => {
    if (id) {
      fetchHostelData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchHostelData = async () => {
    try {
      setLoading(true);
      setErrors({});
      console.log('EditHostel: Fetching data for hostel ID:', id);
      
      const response = await hostelService.getById(id);
      console.log('EditHostel: API Response:', response);
      
      const hostel = response.data;
      console.log('EditHostel: Hostel data:', hostel);
      
      if (!hostel) {
        throw new Error('No hostel data received from server');
      }
      
      const formDataToSet = {
        name: hostel.name || '',
        description: hostel.description || '',
        pricePerNight: hostel.pricePerNight?.toString() || hostel.price?.toString() || '',
        totalBeds: hostel.totalBeds?.toString() || '',
        checkInTime: hostel.checkInTime || '14:00',
        checkOutTime: hostel.checkOutTime || '11:00',
        featured: hostel.featured || false,
        location: {
          area: hostel.location?.area || '',
          address: hostel.location?.address || hostel.address || '',
          googleMapsUrl: hostel.location?.googleMapsUrl || hostel.googleMapsUrl || ''
        },
        contactInfo: {
          phone: hostel.contactInfo?.phone || hostel.contact?.phone || '',
          email: hostel.contactInfo?.email || hostel.contact?.email || ''
        },
        images: hostel.images && hostel.images.length > 0 ? hostel.images : [''],
        facilities: hostel.facilities || [],
        rules: hostel.rules && hostel.rules.length > 0 ? hostel.rules : ['']
      };
      
      console.log('EditHostel: Setting form data:', formDataToSet);
      setFormData(formDataToSet);
      
    } catch (error) {
      console.error('Error fetching hostel data:', error);
      console.error('Error details:', error.response || error.message);
      setErrors({ fetch: `Failed to load hostel data: ${error.message || 'Unknown error'}` });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Hostel name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.pricePerNight || formData.pricePerNight < 0) newErrors.pricePerNight = 'Valid price is required';
    if (!formData.totalBeds || formData.totalBeds < 1) newErrors.totalBeds = 'At least 1 bed is required';
    if (!formData.location.area) newErrors.area = 'Area is required';
    if (!formData.location.address.trim()) newErrors.address = 'Address is required';
    if (formData.images.filter(img => img.trim()).length === 0) newErrors.images = 'At least one image URL is required';
    if (formData.facilities.length === 0) newErrors.facilities = 'At least one facility must be selected';

    // Validate Google Maps URL if provided
    if (formData.location.googleMapsUrl && !formData.location.googleMapsUrl.includes('google.com/maps')) {
      newErrors.googleMapsUrl = 'Please enter a valid Google Maps embed URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSaving(true);
      
      // Clean up the data
      const cleanData = {
        ...formData,
        pricePerNight: parseInt(formData.pricePerNight),
        totalBeds: parseInt(formData.totalBeds),
        images: formData.images.filter(img => img.trim()),
        rules: formData.rules.filter(rule => rule.trim()),
        location: {
          ...formData.location,
          googleMapsUrl: formData.location.googleMapsUrl?.trim() || undefined
        }
      };

      // Remove empty googleMapsUrl
      if (!cleanData.location.googleMapsUrl) {
        delete cleanData.location.googleMapsUrl;
      }

      await hostelService.update(id, cleanData);
      navigate('/admin/hostels');
    } catch (error) {
      console.error('Error updating hostel:', error);
      setErrors({ submit: 'Failed to update hostel. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setFormData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleNestedInputChange = (parent, field, value, nested = null) => {
    if (nested) {
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [nested]: {
            ...prev[parent][nested],
            [field]: value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [field]: value
        }
      }));
    }
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageField = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateImageField = (index, value) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img)
    }));
  };

  const addRuleField = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, '']
    }));
  };

  const removeRuleField = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const updateRuleField = (index, value) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.map((rule, i) => i === index ? value : rule)
    }));
  };

  const toggleFacility = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
    
    if (errors.facilities) {
      setErrors(prev => ({ ...prev, facilities: undefined }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 text-lg">Loading hostel data...</p>
        </div>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
            <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-2">Failed to Load Hostel</h2>
            <p className="text-red-600">{errors.fetch}</p>
          </div>
          <Link 
            to="/admin/hostels" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-nep-red text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Hostels
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/admin/hostels"
            className="inline-flex items-center gap-2 text-nep-red hover:text-red-700 transition-colors mb-4 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Hostels
          </Link>
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 bg-gradient-to-br from-nep-red to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Edit Hostel
                </h1>
                <p className="text-gray-600 mt-1 text-lg">Update your hostel information</p>
              </div>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 bg-gradient-to-br from-nep-red/10 to-nep-red/20 rounded-xl flex items-center justify-center">
                  <Building className="h-6 w-6 text-nep-red" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                  <p className="text-gray-600">Essential details about your hostel</p>
                </div>
              </div>
            
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Hostel Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter a catchy hostel name"
                    className={`h-12 text-lg ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-nep-red'}`}
                  />
                  {errors.name && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{errors.name}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Price per Night (₹) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium">₹</span>
                    <Input
                      type="number"
                      min="0"
                      value={formData.pricePerNight}
                      onChange={(e) => handleInputChange('pricePerNight', e.target.value)}
                      placeholder="2000"
                      className={`h-12 text-lg pl-8 ${errors.pricePerNight ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-nep-red'}`}
                    />
                  </div>
                  {errors.pricePerNight && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{errors.pricePerNight}</span>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2 space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe what makes your hostel special - amenities, atmosphere, location highlights..."
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-nep-red/20 focus:border-nep-red transition-all duration-200 resize-none ${
                      errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {errors.description && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{errors.description}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Total Beds *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.totalBeds}
                    onChange={(e) => handleInputChange('totalBeds', e.target.value)}
                    placeholder="12"
                    className={`h-12 text-lg ${errors.totalBeds ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-nep-red'}`}
                  />
                  {errors.totalBeds && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{errors.totalBeds}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Check-in Time
                  </label>
                  <Input
                    type="time"
                    value={formData.checkInTime}
                    onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                    className="h-12 text-lg border-gray-300 focus:border-nep-red"
                  />
                  <p className="text-sm text-gray-500">Default: 2:00 PM</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Check-out Time
                  </label>
                  <Input
                    type="time"
                    value={formData.checkOutTime}
                    onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
                    className="h-12 text-lg border-gray-300 focus:border-nep-red"
                  />
                  <p className="text-sm text-gray-500">Default: 11:00 AM</p>
                </div>

                <div className="lg:col-span-2 space-y-2">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <label className="text-lg font-semibold text-gray-900 cursor-pointer" htmlFor="featured-edit">
                          Featured Hostel
                        </label>
                        <p className="text-sm text-gray-600">Display this hostel prominently on the homepage</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        id="featured-edit"
                        checked={formData.featured}
                        onChange={(e) => handleInputChange('featured', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-yellow-500"></div>
                    </label>
                  </div>
                </div>
              </div>
          </Card>
        </motion.div>

          {/* Location Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Location Information</h2>
                  <p className="text-gray-600">Help guests find your hostel easily</p>
                </div>
              </div>
            
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Area *
                  </label>
                  <select
                    value={formData.location.area}
                    onChange={(e) => handleNestedInputChange('location', 'area', e.target.value)}
                    className={`w-full h-12 px-4 py-3 rounded-xl border-2 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg ${
                      errors.area ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Choose popular area in Kathmandu</option>
                    {areas.map(area => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                  {errors.area && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{errors.area}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Address *
                  </label>
                  <Input
                    type="text"
                    value={formData.location.address}
                    onChange={(e) => handleNestedInputChange('location', 'address', e.target.value)}
                    placeholder="Street name, landmark, postal code"
                    className={`h-12 text-lg ${errors.address ? 'border-red-500 bg-red-50' : 'border-gray-300 focus:border-blue-500'}`}
                  />
                  {errors.address && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                      <AlertTriangle className="w-4 h-4" />
                      <span>{errors.address}</span>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Google Maps Location (Optional)
                    </h3>
                    <p className="text-blue-700 mb-4 text-sm">
                      📍 To get Google Maps URL:
                      <br />1. Go to Google Maps and find your hostel location
                      <br />2. Click "Share" button → "Embed a map" 
                      <br />3. Copy the URL from the iframe src (starts with https://www.google.com/maps/embed...)
                    </p>
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-blue-800">
                        Google Maps Embed URL
                      </label>
                      <Input
                        type="url"
                        value={formData.location.googleMapsUrl || ''}
                        onChange={(e) => handleNestedInputChange('location', 'googleMapsUrl', e.target.value)}
                        placeholder="https://www.google.com/maps/embed?pb=!1m18!1m12..."
                        className={`h-12 text-lg bg-white ${errors.googleMapsUrl ? 'border-red-500' : 'border-blue-300 focus:border-blue-500'}`}
                      />
                      {errors.googleMapsUrl && (
                        <div className="flex items-center gap-2 text-red-600 text-sm mt-2">
                          <AlertTriangle className="w-4 h-4" />
                          <span>{errors.googleMapsUrl}</span>
                        </div>
                      )}
                      {formData.location.googleMapsUrl && formData.location.googleMapsUrl.includes('google.com/maps') && (
                        <div className="mt-4 border border-blue-300 rounded-lg overflow-hidden">
                          <div className="bg-blue-100 px-3 py-2 text-blue-800 text-sm font-medium">
                            🗺️ Map Preview:
                          </div>
                          <iframe
                            src={formData.location.googleMapsUrl}
                            width="100%"
                            height="200"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Location Preview"
                          ></iframe>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
          </Card>
        </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
                  <p className="text-gray-600">How can guests reach you?</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                    type="text"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleNestedInputChange('contactInfo', 'phone', e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    className="h-12 text-lg pl-12 border-gray-300 focus:border-green-500"
                  />
                  </div>
                  <p className="text-sm text-gray-500">Optional - for guest inquiries</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="email"
                      value={formData.contactInfo.email}
                      onChange={(e) => handleNestedInputChange('contactInfo', 'email', e.target.value)}
                      placeholder="contact@yourhostel.com"
                      className="h-12 text-lg pl-12 border-gray-300 focus:border-green-500"
                    />
                  </div>
                  <p className="text-sm text-gray-500">Optional - for email inquiries</p>
                </div>
              </div>
          </Card>
        </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                    <Image className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Hostel Images *</h2>
                    <p className="text-gray-600">Show off your beautiful space</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addImageField}
                  className="flex items-center gap-2 h-12 px-6 border-2 border-purple-200 text-purple-700 hover:bg-purple-50"
                >
                  <Plus className="w-5 h-5" />
                  Add Image
                </Button>
              </div>
            
            <div className="space-y-4">
              {formData.images.map((image, index) => (
                <div key={index} className="flex gap-3">
                  <Input
                    type="url"
                    value={image}
                    onChange={(e) => updateImageField(index, e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1"
                  />
                  {formData.images.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeImageField(index)}
                      className="px-3"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
          </Card>
        </motion.div>

          {/* Facilities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-12 w-12 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Facilities & Amenities *</h2>
                  <p className="text-gray-600">What do you offer to guests?</p>
                </div>
              </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableFacilities.map(facility => (
                <label key={facility} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.facilities.includes(facility)}
                    onChange={() => toggleFacility(facility)}
                    className="w-4 h-4 text-nepali-red border-gray-300 rounded focus:ring-nepali-red"
                  />
                  <span className="text-sm text-gray-700">{facility}</span>
                </label>
              ))}
            </div>
            {errors.facilities && <p className="text-red-500 text-sm mt-2">{errors.facilities}</p>}
          </Card>
        </motion.div>

          {/* House Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">House Rules</h2>
                    <p className="text-gray-600">Set clear expectations for guests</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRuleField}
                  className="flex items-center gap-2 h-12 px-6 border-2 border-red-200 text-red-700 hover:bg-red-50"
                >
                  <Plus className="w-5 h-5" />
                  Add Rule
                </Button>
              </div>
            
            <div className="space-y-4">
              {formData.rules.map((rule, index) => (
                <div key={index} className="flex gap-3">
                  <Input
                    type="text"
                    value={rule}
                    onChange={(e) => updateRuleField(index, e.target.value)}
                    placeholder="Enter house rule"
                    className="flex-1"
                  />
                  {formData.rules.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeRuleField(index)}
                      className="px-3"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex justify-end gap-4 pt-4"
          >
            <Link
              to="/admin/hostels"
              className="px-8 py-4 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </Link>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              className="px-8 py-4 h-auto text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3 min-w-[180px] justify-center bg-gradient-to-r from-nep-red to-red-600"
            >
              {saving ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Update Hostel</span>
                </>
              )}
            </Button>
          </motion.div>

          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 rounded-xl p-6 flex items-start gap-3"
            >
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">Error Updating Hostel</h3>
                <p className="text-red-700">{errors.submit}</p>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditHostel;