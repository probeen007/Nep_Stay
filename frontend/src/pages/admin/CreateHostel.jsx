import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, MapPin, Save, Building, Phone, Mail, Image, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { hostelService } from '../../services';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const CreateHostel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    pricePerNight: '',
    totalBeds: '',
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
      setLoading(true);
      
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

      console.log('Creating hostel with data:', cleanData);
      const response = await hostelService.create(cleanData);
      console.log('Create hostel response:', response);
      navigate('/admin/hostels', { replace: true });
    } catch (error) {
      console.error('Error creating hostel:', error);
      console.error('Error details:', {
        message: error?.error?.message || error?.message,
        code: error?.error?.code,
        full: error
      });
      
      const errorMessage = error?.error?.message || error?.message || 'Failed to create hostel. Please try again.';
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Building className="w-8 h-8 text-nep-red" />
                Create New Hostel
              </h1>
              <p className="text-gray-600 mt-1 text-lg">Add a new property to your listings</p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
              <CheckCircle className="w-4 h-4" />
              <span>All fields marked with * are required</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Buttons at Page Top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex items-center gap-3"
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-all duration-200 font-medium bg-blue-50 px-4 py-3 rounded-lg hover:bg-blue-100 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Website
          </a>
          <button
            onClick={() => navigate('/admin/hostels', { replace: true })}
            className="inline-flex items-center gap-2 text-nep-red hover:text-nep-red/80 transition-all duration-200 font-medium bg-red-50 px-4 py-3 rounded-lg hover:bg-red-100 shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Hostels
          </button>
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
                            title="Hostel Location Preview"
                          />
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
                  <p className="text-gray-600">How guests can reach you</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-600" />
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    value={formData.contactInfo.phone}
                    onChange={(e) => handleNestedInputChange('contactInfo', 'phone', e.target.value)}
                    placeholder="+977-98XXXXXXXX"
                    className="h-12 text-lg border-gray-300 focus:border-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-green-600" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => handleNestedInputChange('contactInfo', 'email', e.target.value)}
                    placeholder="contact@yourhostel.com"
                    className="h-12 text-lg border-gray-300 focus:border-green-500"
                  />
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
                    <h2 className="text-2xl font-bold text-gray-900">Image URLs *</h2>
                    <p className="text-gray-600">Showcase your hostel with beautiful photos</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addImageField}
                  className="flex items-center gap-2 bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 px-4 py-2 rounded-lg font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add Image URL
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="flex gap-3 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm min-w-0">
                      <Image className="w-4 h-4" />
                      Image {index + 1}
                    </div>
                    <Input
                      type="url"
                      value={image}
                      onChange={(e) => updateImageField(index, e.target.value)}
                      placeholder="https://example.com/hostel-photo.jpg"
                      className="flex-1 h-12 text-lg border-gray-300 focus:border-purple-500 bg-white"
                    />
                    {formData.images.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeImageField(index)}
                        className="px-3 py-2 border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {errors.images && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-4 bg-red-50 p-3 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{errors.images}</span>
                </div>
              )}
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
                <div className="h-12 w-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Facilities & Amenities *</h2>
                  <p className="text-gray-600">What makes your hostel special</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableFacilities.map(facility => (
                  <label key={facility} className="group cursor-pointer">
                    <div className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.facilities.includes(facility)
                        ? 'bg-orange-50 border-orange-300 shadow-md'
                        : 'bg-gray-50 border-gray-200 hover:bg-orange-50 hover:border-orange-200'
                    }`}>
                      <input
                        type="checkbox"
                        checked={formData.facilities.includes(facility)}
                        onChange={() => toggleFacility(facility)}
                        className="w-5 h-5 text-orange-600 border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2"
                      />
                      <span className={`text-sm font-medium transition-colors ${
                        formData.facilities.includes(facility) ? 'text-orange-800' : 'text-gray-700'
                      }`}>{facility}</span>
                    </div>
                  </label>
                ))}
              </div>
              {errors.facilities && (
                <div className="flex items-center gap-2 text-red-600 text-sm mt-6 bg-red-50 p-3 rounded-lg">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{errors.facilities}</span>
                </div>
              )}
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
                    <p className="text-gray-600">Set guidelines for guests (optional)</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={addRuleField}
                  className="flex items-center gap-2 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 px-4 py-2 rounded-lg font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add Rule
                </Button>
              </div>
              
              <div className="space-y-4">
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex gap-3 items-center bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 text-red-600 font-semibold text-sm min-w-0">
                      <Shield className="w-4 h-4" />
                      Rule {index + 1}
                    </div>
                    <Input
                      type="text"
                      value={rule}
                      onChange={(e) => updateRuleField(index, e.target.value)}
                      placeholder="e.g., No smoking inside, Quiet hours after 10 PM"
                      className="flex-1 h-12 text-lg border-gray-300 focus:border-red-500 bg-white"
                    />
                    {formData.rules.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeRuleField(index)}
                        className="px-3 py-2 border-red-200 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Submit Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card className="p-8 border-0 shadow-lg bg-gradient-to-r from-gray-50 to-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Create?</h3>
                  <p className="text-gray-600">Review your information and create the hostel listing</p>
                </div>
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-nep-red to-red-600 hover:from-nep-red/90 hover:to-red-600/90 text-white px-8 py-4 rounded-xl font-bold text-lg min-w-[200px] shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Create Hostel
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border-2 border-red-200 rounded-xl p-6 shadow-lg"
            >
              <div className="flex items-center gap-3 text-red-700">
                <AlertTriangle className="w-6 h-6" />
                <div>
                  <h4 className="font-bold">Error Creating Hostel</h4>
                  <p>{errors.submit}</p>
                </div>
              </div>
            </motion.div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CreateHostel;