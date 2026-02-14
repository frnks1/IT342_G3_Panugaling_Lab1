import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Register(){
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try{
      const res = await fetch('http://localhost:8080/api/auth/register',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({username,email,password})
      })
      const text = await res.text()
      if (!res.ok) {
        setError(text || 'Registration failed')
        setLoading(false)
        return
      }
      setSuccess('Registration successful — redirecting to login...')
      setTimeout(()=>navigate('/login'), 900)
    }catch(err){ setError(err.message) }
    setLoading(false)
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: 12,
      padding: 40,
      boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
      maxWidth: 420
    }}>
      <h1 style={{fontSize: 28, marginBottom: 8, color: '#333'}}>Create Account</h1>
      <p style={{color: '#999', marginBottom: 24, fontSize: 14}}>Join us today and get started</p>
      
      {error && <div style={{background: '#fee', color: '#c33', padding: 12, borderRadius: 6, marginBottom: 16, fontSize: 14}}>{error}</div>}
      {success && <div style={{background: '#efe', color: '#3c3', padding: 12, borderRadius: 6, marginBottom: 16, fontSize: 14}}>{success}</div>}
      
      <form onSubmit={submit}>
        <input 
          placeholder="Username" 
          value={username} 
          onChange={e=>setUsername(e.target.value)} 
          required
        />
        <input 
          placeholder="Email" 
          type="email"
          value={email} 
          onChange={e=>setEmail(e.target.value)} 
          required
        />
        <input 
          placeholder="Password" 
          type="password" 
          value={password} 
          onChange={e=>setPassword(e.target.value)} 
          required
        />
        <button type="submit" disabled={loading} style={{marginTop: 24}}>
          {loading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      <p style={{textAlign: 'center', marginTop: 20, fontSize: 14, color: '#999'}}>
        Already have an account? <Link to="/login" style={{color: '#667eea', fontWeight: 600}}>Login</Link>
      </p>
    </div>
  )
}
