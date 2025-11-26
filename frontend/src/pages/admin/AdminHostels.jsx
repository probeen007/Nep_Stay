import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  MapPin, 
  Users,
  Star,
  Filter,
  Download,
  MoreVertical,
  Building,
  ArrowLeft
} from 'lucide-react';
import { hostelService } from '../../services';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';

const AdminHostels = () => {
  const location = useLocation();
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalHostels, setTotalHostels] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingHostel, setDeletingHostel] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  useEffect(() => {
    console.log('AdminHostels: Component mounted or dependencies changed');
    fetchHostels();
  }, [searchQuery, selectedArea, currentPage]);

  // Reset and fetch when component mounts or navigating back from other pages
  useEffect(() => {
    console.log('AdminHostels: Location changed to:', location.pathname);
    if (location.pathname === '/admin/hostels') {
      // Force refresh by incrementing key
      setRefreshKey(prev => prev + 1);
      
      // Reset filters when navigating back
      setSearchQuery('');
      setSelectedArea('');
      setCurrentPage(1);
      setError('');
      setHostels([]); // Clear existing data
      setLoading(true);
      
      // Delay fetch to ensure state is reset
      const timer = setTimeout(() => {
        fetchHostels(true);
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const fetchHostels = async (force = false) => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        limit: 10,
        sort: '-createdAt'
      };

      if (searchQuery) params.search = searchQuery;
      if (selectedArea && selectedArea !== 'All Areas') params.area = selectedArea;

      console.log('AdminHostels: Fetching hostels with params:', params);
      
      // Add cache busting if forced refresh
      if (force) {
        params._t = Date.now();
      }
      
      const response = await hostelService.getAll(params);
      console.log('AdminHostels: API response received:', response.data);
      
      const data = response.data;
      
      // Ensure hostels array exists and has proper structure
      const hostels = data.hostels || [];
      console.log('AdminHostels: Processing', hostels.length, 'hostels');
      
      setHostels(hostels);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalHostels(data.pagination?.total || 0);
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load hostels';
      setError(errorMessage);
      console.error('AdminHostels: Error fetching hostels:', error);
      console.error('AdminHostels: Error details:', error.response?.data || error.message);
      // Set empty array to prevent rendering issues
      setHostels([]);
      setTotalPages(1);
      setTotalHostels(0);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (hostel) => {
    setDeletingHostel(hostel);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingHostel) return;
    
    try {
      setIsDeleting(true);
      await hostelService.delete(deletingHostel._id);
      
      // Remove from local state
      setHostels(prev => prev.filter(h => h._id !== deletingHostel._id));
      setTotalHostels(prev => prev - 1);
      
      setShowDeleteModal(false);
      setDeletingHostel(null);
    } catch (error) {
      console.error('Error deleting hostel:', error);
      alert('Failed to delete hostel. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const HostelRow = ({ hostel }) => (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors duration-200"
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-12 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            <img
              src={hostel.images?.[0] || 'https://images.unsplash.com/photo-1555854877-bab0e460b1e1?w=400&h=300&fit=crop'}
              alt={hostel.name || 'Hostel'}
              className="w-full h-full object-cover"
              onError={(e) => {
                if (e.target.src !== 'https://images.unsplash.com/photo-1555854877-bab0e460b1e1?w=400&h=300&fit=crop') {
                  e.target.src = 'https://images.unsplash.com/photo-1555854877-bab0e460b1e1?w=400&h=300&fit=crop';
                } else {
                  e.target.style.display = 'none';
                  e.target.parentNode.innerHTML = '<div class="w-full h-full bg-gray-300 flex items-center justify-center"><svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path></svg></div>';
                }
              }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 hover:text-nep-red">
              {hostel.name}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3" />
              {hostel.location?.area || hostel.address || 'No location specified'}
            </p>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="text-sm">
          <div className="font-semibold text-gray-800">₹{hostel.pricePerNight}</div>
          <div className="text-gray-500">per night</div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-1 text-sm">
          <Users className="w-4 h-4 text-gray-400" />
          <span>{hostel.totalBeds} beds</span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 text-yellow-400" />
          <span>4.{Math.floor(Math.random() * 5) + 3}</span>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <Badge variant="outline" className="text-xs">
          {hostel.facilities?.length || 0} facilities
        </Badge>
      </td>
      
      <td className="px-6 py-4 text-sm text-gray-500">
        {new Date(hostel.createdAt).toLocaleDateString()}
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <Link
            to={`/hostel/${hostel._id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-blue-200"
            title="View Hostel"
            onClick={(e) => {
              console.log('View button clicked for hostel:', hostel._id);
            }}
          >
            <Eye className="w-4 h-4" />
          </Link>
          
          <Link
            to={`/admin/hostels/edit/${hostel._id}`}
            className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-nep-red hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-red-200"
            title="Edit Hostel"
            onClick={(e) => {
              console.log('Edit button clicked for hostel:', hostel._id);
            }}
          >
            <Edit className="w-4 h-4" />
          </Link>
          
          <button
            onClick={() => {
              console.log('Delete button clicked for hostel:', hostel._id);
              handleDeleteClick(hostel);
            }}
            className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer border border-transparent hover:border-red-200"
            title="Delete Hostel"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-gradient-to-br from-nep-red to-red-600 rounded-xl flex items-center justify-center">
              <Building className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage Hostels</h1>
              <p className="text-gray-600">
                {loading ? 'Loading...' : `${totalHostels} hostel${totalHostels !== 1 ? 's' : ''} found`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Link>
            <a
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Website
            </a>
            <Link
              to="/admin/hostels/create"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-nep-red to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Add New Hostel
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 border-0 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search hostels by name or area..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 h-12 border-gray-200 focus:border-nep-red focus:ring-nep-red/20"
              />
            </div>
            
            <select
              value={selectedArea}
              onChange={(e) => {
                setSelectedArea(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-3 h-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-nep-red/20 focus:border-nep-red transition-colors min-w-[200px] bg-white"
            >
              {areas.map(area => (
                <option key={area} value={area === 'All Areas' ? '' : area}>
                  {area}
                </option>
              ))}
            </select>
            
            <Button
              variant="outline"
              className="flex items-center gap-2 h-12 px-6 border-gray-200 hover:border-nep-red hover:text-nep-red transition-colors"
              onClick={() => fetchHostels(true)}
            >
              <Filter className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={fetchHostels} variant="primary">
                Try Again
              </Button>
            </div>
          ) : hostels.length === 0 ? (
            <div className="text-center py-12">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No hostels found</p>
              <Link to="/admin/hostels/create" className="btn-primary">
                Add Your First Hostel
              </Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hostel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Beds
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Facilities
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {hostels
                      .filter(hostel => hostel && hostel._id && hostel.name)
                      .map((hostel) => (
                        <HostelRow key={hostel._id} hostel={hostel} />
                      ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t bg-gray-50">
                  <div className="flex justify-center items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
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
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Hostel"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{deletingHostel?.name}</strong>? 
            This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? (
                <>
                  <LoadingSpinner size="sm" />
                  Deleting...
                </>
              ) : (
                'Delete Hostel'
              )}
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </div>
  );
};

export default AdminHostels;