import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import '../styles/Profile.css'

export default function Profile() {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:5000/users/profile/${user?.userId}`)
      const data = await res.json()

      if (res.ok) {
        setProfile(data)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="profile-container"><p>Loading...</p></div>
  }

  if (error) {
    return <div className="profile-container"><p className="error">{error}</p></div>
  }

  return (
    <div className="profile-container">
      <div className="profile-box">
        <div className="profile-header">
          <h1>My Profile</h1>
          <button onClick={() => navigate('/edit-profile')} className="edit-btn">
            Edit Profile
          </button>
        </div>

        <div className="profile-picture-display">
          {profile?.profilePicture ? (
            <img src={profile.profilePicture} alt={profile?.userName} />
          ) : (
            <div className="avatar-placeholder">
              {profile?.firstName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="profile-info">
          <div className="info-field">
            <label>Name</label>
            <p>{profile?.firstName} {profile?.lastName}</p>
          </div>

          <div className="info-field">
            <label>Username</label>
            <p>@{profile?.userName}</p>
          </div>

          <div className="info-field">
            <label>Email</label>
            <p>{profile?.email}</p>
          </div>

          <div className="info-field">
            <label>Bio</label>
            <p>{profile?.bio || 'No bio added yet'}</p>
          </div>
        </div>

        <div className="profile-buttons">
          <button onClick={() => navigate('/dashboard')} className="btn">
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
