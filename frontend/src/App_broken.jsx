import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Routes>
        <Route path="/" element={
          <div className="p-8">
            <h1 className="text-4xl font-bold text-nepali-red mb-4">KathmanduHostels</h1>
            <p className="text-gray-600">Welcome to KathmanduHostels - Your gateway to the best hostels in Kathmandu!</p>
          </div>
        } />
      </Routes>
    </div>
  )
}

/*
import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'

// Import pages
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import HostelDetailsPage from './pages/HostelDetailsPage'
import SearchPage from './pages/SearchPage'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminHostels from './pages/admin/AdminHostels'
import CreateHostel from './pages/admin/CreateHostel'
import EditHostel from './pages/admin/EditHostel'
import NotFound from './pages/NotFound'

// Import components
import ProtectedRoute from './components/common/ProtectedRoute'
import ScrollToTop from './components/common/ScrollToTop'

function App() {
  return (
    <div className="min-h-screen bg-cream-50">
      <ScrollToTop />
*/

export default App