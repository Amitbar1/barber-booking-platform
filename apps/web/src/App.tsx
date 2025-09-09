import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Suspense, lazy } from 'react'
import PageNavigator from './components/PageNavigator'

// Lazy load components for better performance
const LandingPage = lazy(() => import('./pages/LandingPage'))
const BookingPage = lazy(() => import('./pages/BookingPage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const SalonPage = lazy(() => import('./pages/SalonPage'))
const SalonListingPage = lazy(() => import('./pages/SalonListingPage'))
const ManageBooking = lazy(() => import('./pages/ManageBooking'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ContrastChecker = lazy(() => import('./components/ContrastChecker'))

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-bg flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
)

function App() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/salons" element={<SalonListingPage />} />
          <Route path="/salon/:salonId" element={<SalonPage />} />
          <Route path="/booking/:salonId" element={<BookingPage />} />
          <Route path="/manage/:token" element={<ManageBooking />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          
          {/* Debug routes */}
          <Route path="/contrast-check" element={<ContrastChecker />} />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      
      {/* Page Navigator - only in development */}
      {process.env.NODE_ENV === 'development' && <PageNavigator />}
    </div>
  )
}

export default App