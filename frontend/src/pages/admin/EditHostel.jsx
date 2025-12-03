import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus, X, MapPin, Save, CheckCircle } from 'lucide-react';
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
    fetchHostelData();
  }, [id]);

  const fetchHostelData = async () => {
    try {
      setLoading(true);
      const response = await hostelService.getById(id);
      const hostel = response.data;
      
      console.log('EditHostel: Loaded hostel data:', hostel);
      
      setFormData({
        name: hostel.name || '',
        description: hostel.description || '',
        pricePerNight: hostel.pricePerNight?.toString() || '',
        totalBeds: hostel.totalBeds?.toString() || '',
        checkInTime: hostel.checkInTime || '14:00',
        checkOutTime: hostel.checkOutTime || '11:00',
        featured: hostel.featured || false,
        location: {
          area: hostel.location?.area || '',
          address: hostel.address || hostel.location?.address || '',
          googleMapsUrl: hostel.googleMapsUrl || hostel.location?.googleMapsUrl || ''
        },
        contactInfo: {
          phone: hostel.contactInfo?.phone || '',
          email: hostel.contactInfo?.email || ''
        },
        images: hostel.images && hostel.images.length > 0 ? hostel.images : [''],
        facilities: hostel.facilities || [],
        rules: hostel.rules && hostel.rules.length > 0 ? hostel.rules : ['']
      });
    } catch (error) {
      console.error('Error fetching hostel data:', error);
      setErrors({ fetch: 'Failed to load hostel data' });
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
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{errors.fetch}</p>
        <Link to="/admin/hostels" className="btn-primary">
          Back to Hostels
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link
          to="/admin/hostels"
          className="flex items-center gap-2 text-nep-red hover:text-red-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Hostels
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Edit Hostel</h1>
          <p className="text-gray-600 mt-1">Update hostel information</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hostel Name *
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter hostel name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price per Night (₹) *
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.pricePerNight}
                  onChange={(e) => handleInputChange('pricePerNight', e.target.value)}
                  placeholder="Enter price per night"
                  className={errors.pricePerNight ? 'border-red-500' : ''}
                />
                {errors.pricePerNight && <p className="text-red-500 text-sm mt-1">{errors.pricePerNight}</p>}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your hostel..."
                  rows={4}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-nepali-red focus:border-transparent transition-colors ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Beds *
                </label>
                <Input
                  type="number"
                  min="1"
                  value={formData.totalBeds}
                  onChange={(e) => handleInputChange('totalBeds', e.target.value)}
                  placeholder="Enter total number of beds"
                  className={errors.totalBeds ? 'border-red-500' : ''}
                />
                {errors.totalBeds && <p className="text-red-500 text-sm mt-1">{errors.totalBeds}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-in Time
                </label>
                <Input
                  type="time"
                  value={formData.checkInTime}
                  onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                  className="border-gray-300"
                />
                <p className="text-sm text-gray-500 mt-1">Default: 2:00 PM</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check-out Time
                </label>
                <Input
                  type="time"
                  value={formData.checkOutTime}
                  onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
                  className="border-gray-300"
                />
                <p className="text-sm text-gray-500 mt-1">Default: 11:00 AM</p>
              </div>

              <div className="col-span-2">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <label className="text-lg font-semibold text-gray-900 cursor-pointer" htmlFor="featured">
                        Featured Hostel
                      </label>
                      <p className="text-sm text-gray-600">Display this hostel prominently on the homepage</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="featured"
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
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Location Information
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area *
                </label>
                <select
                  value={formData.location.area}
                  onChange={(e) => handleNestedInputChange('location', 'area', e.target.value)}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-nepali-red focus:border-transparent transition-colors ${
                    errors.area ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Area</option>
                  {areas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
                {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <Input
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => handleNestedInputChange('location', 'address', e.target.value)}
                  placeholder="Enter full address"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Maps URL (Optional) 🗺️
                </label>
                <Input
                  type="url"
                  value={formData.location.googleMapsUrl || ''}
                  onChange={(e) => handleNestedInputChange('location', 'googleMapsUrl', e.target.value)}
                  placeholder="Paste Google Maps embed URL here..."
                  className={errors.googleMapsUrl ? 'border-red-500' : ''}
                />
                {errors.googleMapsUrl && <p className="text-red-500 text-sm mt-1">{errors.googleMapsUrl}</p>}
                <p className="text-sm text-gray-500 mt-2">
                  💡 Go to Google Maps → Share → Embed a map → Copy the iframe src URL
                </p>
                
                {formData.location.googleMapsUrl && formData.location.googleMapsUrl.includes('google.com/maps') && (
                  <div className="mt-4 border-2 border-blue-300 rounded-lg overflow-hidden">
                    <p className="text-sm font-medium text-blue-700 bg-blue-50 px-3 py-2">📍 Map Preview:</p>
                    <iframe
                      src={formData.location.googleMapsUrl}
                      width="100%"
                      height="300"
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
          </Card>
        </motion.div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Contact Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={formData.contactInfo.phone}
                  onChange={(e) => handleNestedInputChange('contactInfo', 'phone', e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  type="email"
                  value={formData.contactInfo.email}
                  onChange={(e) => handleNestedInputChange('contactInfo', 'email', e.target.value)}
                  placeholder="Enter email address"
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
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Image URLs *</h2>
              <Button
                type="button"
                variant="outline"
                onClick={addImageField}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
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
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Facilities *</h2>
            
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
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">House Rules</h2>
              <Button
                type="button"
                variant="outline"
                onClick={addRuleField}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
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
          className="flex justify-end space-x-4"
        >
          <Link
            to="/admin/hostels"
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            variant="primary"
            disabled={saving}
            className="flex items-center gap-2 min-w-[140px]"
          >
            {saving ? (
              <LoadingSpinner size="sm" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saving ? 'Updating...' : 'Update Hostel'}
          </Button>
        </motion.div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">{errors.submit}</p>
          </div>
        )}
      </form>
    </div>
  );
};

export default EditHostel;