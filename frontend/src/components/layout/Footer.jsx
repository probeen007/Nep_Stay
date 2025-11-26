import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  HomeIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  HeartIcon
} from '@heroicons/react/24/outline'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    explore: [
      { name: 'All Hostels', href: '/search' },
      { name: 'Featured Hostels', href: '/search?featured=true' },
      { name: 'Budget Friendly', href: '/search?maxPrice=1000' },
      { name: 'Premium Hostels', href: '/search?minPrice=1500' },
    ],
    areas: [
      { name: 'Thamel', href: '/search?q=Thamel' },
      { name: 'Freak Street', href: '/search?q=Freak Street' },
      { name: 'Lazimpat', href: '/search?q=Lazimpat' },
      { name: 'Chhetrapati', href: '/search?q=Chhetrapati' },
    ],
    facilities: [
      { name: 'Free WiFi', href: '/search?facilities=Free WiFi' },
      { name: 'Hot Shower', href: '/search?facilities=Hot Shower' },
      { name: 'Rooftop Terrace', href: '/search?facilities=Rooftop Terrace' },
      { name: 'Travel Desk', href: '/search?facilities=Travel Desk' },
    ]
  }

  return (
    <footer className="bg-neutral-900 text-neutral-300 nepali-pattern">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-4"
              >
                <Link to="/" className="flex items-center space-x-3 group">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-nep rounded-lg flex items-center justify-center transform transition-transform group-hover:scale-105">
                      <HomeIcon className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-secondary-500 rounded-full opacity-75" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-white">
                      Nep Stay
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1" style={{ fontFamily: '"Noto Sans Devanagari", serif' }}>
                      अतिथि देवो भव:
                    </p>
                  </div>
                </Link>
                
                <p className="text-sm leading-relaxed">
                  Your trusted guide to finding the perfect hostel in Nepal. 
                  Experience authentic Nepali hospitality in the heart of the Himalayas.
                </p>

                <div className="flex space-x-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPinIcon className="w-4 h-4 text-primary-400" />
                    <span>Kathmandu, Nepal</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Explore Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                Explore
              </h4>
              <ul className="space-y-2">
                {footerLinks.explore.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-sm hover:text-primary-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Popular Areas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <span className="w-2 h-2 bg-secondary-500 rounded-full mr-2"></span>
                Popular Areas
              </h4>
              <ul className="space-y-2">
                {footerLinks.areas.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-sm hover:text-secondary-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Facilities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="text-white font-semibold mb-4 flex items-center">
                <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                Top Facilities
              </h4>
              <ul className="space-y-2">
                {footerLinks.facilities.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-sm hover:text-accent-400 transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="relative py-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-800"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-neutral-900 px-6">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-secondary-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-accent-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="py-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          <div className="flex items-center space-x-4 text-sm">
            <p className="text-neutral-400">
              © {currentYear} Nep Stay. All rights reserved.
            </p>
          </div>

          <div className="flex items-center space-x-1 text-sm text-neutral-400">
            <span>Made with</span>
            <HeartIcon className="w-4 h-4 text-red-500 fill-current" />
            <span>for travelers in Nepal</span>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer