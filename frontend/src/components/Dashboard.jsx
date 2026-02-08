import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/authActions'
import '../styles/Dashboard.css'

export default function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1>Welcome, {user?.userName}!</h1>
        <p>You are logged in successfully.</p>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  )
}
