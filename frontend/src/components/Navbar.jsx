import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/authActions'
import '../styles/Navbar.css'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <span className="logo-icon">🌐</span>
          <h1>SocialHub</h1>
        </div>

        <div className="navbar-user">
          <span className="user-name">{user?.userName}</span>
          <button onClick={handleLogout} className="logout-icon">
            🚪
          </button>
        </div>
      </div>
    </nav>
  )
}
