import { useSelector } from 'react-redux'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const user = useSelector(state => state.user)

  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <div className="dashboard-main">
        <Sidebar />
        
        <main className="dashboard-content">
          <div className="welcome-section">
            <div className="welcome-card">
              <div className="welcome-header">
                <h2>Welcome back, {user?.userName}! 👋</h2>
                <p>You are logged in successfully</p>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <span className="stat-icon">👥</span>
                  <div className="stat-info">
                    <p className="stat-label">Friends</p>
                    <p className="stat-value">0</p>
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-icon">⭐</span>
                  <div className="stat-info">
                    <p className="stat-label">Profile Views</p>
                    <p className="stat-value">0</p>
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-icon">💬</span>
                  <div className="stat-info">
                    <p className="stat-label">Messages</p>
                    <p className="stat-value">0</p>
                  </div>
                </div>
              </div>

              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn">
                    <span>📝</span> Create Post
                  </button>
                  <button className="action-btn">
                    <span>🔍</span> Find Friends
                  </button>
                  <button className="action-btn">
                    <span>👤</span> Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="feed-section">
            <div className="feed-card">
              <h3>📰 What's New</h3>
              <p>Posts coming soon...</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
