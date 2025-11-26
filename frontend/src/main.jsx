import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import './index.css'

// Toast configuration with Nepali theme
const toastOptions = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: '#fefdfb',
    color: '#1c1917',
    border: '1px solid #e7e5e4',
    borderRadius: '0.75rem',
    padding: '16px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  success: {
    iconTheme: {
      primary: '#A70000',
      secondary: '#ffffff',
    },
    style: {
      border: '1px solid #A70000',
    },
  },
  error: {
    iconTheme: {
      primary: '#dc2626',
      secondary: '#ffffff',
    },
    style: {
      border: '1px solid #dc2626',
    },
  },
  loading: {
    iconTheme: {
      primary: '#E5A032',
      secondary: '#ffffff',
    },
  },
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster 
          toastOptions={toastOptions}
          containerStyle={{
            top: '1rem',
            right: '1rem',
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)