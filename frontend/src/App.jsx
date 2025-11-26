import { Routes, Route } from 'react-router-dom'
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
import ProtectedRoute from './components/common/ProtectedRoute'
import ScrollToTop from './components/common/ScrollToTop'

function App() {
  return (
    <div className="min-h-screen bg-cream-50">
      <ScrollToTop />
      
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="hostel/:id" element={<HostelDetailsPage />} />
        </Route>

        {/* Admin routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/webapp/admin" element={<AdminLogin />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/webapp/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/hostels" 
          element={
            <ProtectedRoute>
              <AdminHostels key="admin-hostels" />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/webapp/admin/hostels" 
          element={
            <ProtectedRoute>
              <AdminHostels />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/hostels/create" 
          element={
            <ProtectedRoute>
              <CreateHostel />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/webapp/admin/hostels/create" 
          element={
            <ProtectedRoute>
              <CreateHostel />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/hostels/edit/:id" 
          element={
            <ProtectedRoute>
              <EditHostel />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/webapp/admin/hostels/edit/:id" 
          element={
            <ProtectedRoute>
              <EditHostel />
            </ProtectedRoute>
          } 
        />

        {/* 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App