import { useNavigate } from 'react-router-dom'
import '../styles/Sidebar.css'

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <div 
          className="sidebar-item"
          onClick={() => navigate('/dashboard')}
        >
          <span className="sidebar-icon">🏠</span>
          <span className="sidebar-label">Home</span>
        </div>

        <div 
          className="sidebar-item"
          onClick={() => navigate('/search-friends')}
        >
          <span className="sidebar-icon">🔍</span>
          <span className="sidebar-label">Search</span>
        </div>

        <div 
          className="sidebar-item"
          onClick={() => navigate('/friends-list')}
        >
          <span className="sidebar-icon">👥</span>
          <span className="sidebar-label">Friends</span>
        </div>

        <div 
          className="sidebar-item"
          onClick={() => navigate('/profile')}
        >
          <span className="sidebar-icon">👤</span>
          <span className="sidebar-label">Profile</span>
        </div>

        <div 
          className="sidebar-item"
          onClick={() => navigate('/edit-profile')}
        >
          <span className="sidebar-icon">⚙️</span>
          <span className="sidebar-label">Settings</span>
        </div>
      </div>
    </aside>
  )
}
