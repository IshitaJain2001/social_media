import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Auth.css'

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('http://localhost:5000/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()
      
      if (!res.ok) {
        setError(data.message)
        return
      }

      
      navigate('/verify-otp', { state: { userId: data.userId, email: data.email } })
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="firstName" 
            placeholder="First Name" 
            value={form.firstName} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="text" 
            name="lastName" 
            placeholder="Last Name" 
            value={form.lastName} 
            onChange={handleChange} 
          />
          <input 
            type="text" 
            name="userName" 
            placeholder="Username" 
            value={form.userName} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={form.email} 
            onChange={handleChange} 
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={form.password} 
            onChange={handleChange} 
            required 
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="auth-link">
          Have account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  )
}
