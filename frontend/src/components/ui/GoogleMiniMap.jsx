import React, { useState } from 'react';
import { MapPin, ExternalLink, Maximize2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const GoogleMiniMap = ({ googleMapsUrl, hostelName, address }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!googleMapsUrl || !googleMapsUrl.includes('google.com/maps')) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-500">
        <MapPin className="w-12 h-12 mb-3 text-gray-400" />
        <p className="text-lg font-medium">Location Map Not Available</p>
        <p className="text-sm text-center px-4">{address}</p>
      </div>
    );
  }

  const openGoogleMaps = () => {
    // Convert embed URL to regular Google Maps URL
    let regularUrl = googleMapsUrl.replace('/embed', '');
    
    // Try to extract coordinates or place info from embed URL
    const pbMatch = googleMapsUrl.match(/pb=([^&]+)/);
    if (pbMatch) {
      // If we have pb parameter, create a simpler maps URL
      regularUrl = `https://maps.google.com/?q=${encodeURIComponent(hostelName + ' ' + address)}`;
    }
    
    window.open(regularUrl, '_blank');
  };

  return (
    <>
      <div className="w-full space-y-3">
        {/* Mini Map Container */}
        <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200 group">
          {/* Map Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/60 to-transparent p-4">
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="font-semibold text-sm">Location</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullScreen(true)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title="View Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={openGoogleMaps}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title="Open in Google Maps"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Embedded Map */}
          <iframe
            src={googleMapsUrl}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`${hostelName} Location Map`}
            className="w-full"
          />

          {/* Bottom Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="text-white">
              <p className="font-semibold text-sm mb-1">{hostelName}</p>
              <p className="text-xs opacity-90">{address}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={openGoogleMaps}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Open in Google Maps
          </button>
          <button
            onClick={() => setIsFullScreen(true)}
            className="px-4 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-lg font-semibold transition-colors"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setIsFullScreen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-6xl h-full max-h-[90vh] bg-white rounded-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Fullscreen Header */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{hostelName}</h3>
                    <p className="text-gray-600">{address}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={openGoogleMaps}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open in Google Maps
                    </button>
                    <button
                      onClick={() => setIsFullScreen(false)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Fullscreen Map */}
              <div className="pt-20 h-full">
                <iframe
                  src={googleMapsUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${hostelName} Full Location Map`}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GoogleMiniMap;