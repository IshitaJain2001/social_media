import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import store from './redux/store'
import { Provider } from 'react-redux'
import Register from './components/Register'
import VerifyOtp from './components/VerifyOtp'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import './App.css'

function ProtectedRoute({ children }) {
  const isLoggedIn = useSelector(state => state.isLoggedIn)
  return isLoggedIn ? children : <Navigate to="/login" />
}

function AppRoutes() {
  const isLoggedIn = useSelector(state => state.isLoggedIn)

  return (
    <Routes>
      <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/verify-otp" element={!isLoggedIn ? <VerifyOtp /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="/" element={<Navigate to={isLoggedIn ? '/dashboard' : '/register'} />} />
    </Routes>
  )
}

function AppContent() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}
