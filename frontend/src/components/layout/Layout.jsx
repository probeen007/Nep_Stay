import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

// Main layout component for public pages
const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <Header />
      
      <main className="flex-grow">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  )
}

export default Layout