import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError(null)
    setLoading(true)
    try{
      const res = await fetch('http://localhost:8080/api/auth/login',{
        method:'POST', headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email,password})
      })
      if (!res.ok) {
        const text = await res.text()
        setError(text || 'Login failed')
        setLoading(false)
        return
      }
      const data = await res.json()
      if (data && data.token) {
        localStorage.setItem('token', data.token)
        navigate('/dashboard')
      } else {
        setError('Invalid response from server')
      }
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
      <h1 style={{fontSize: 28, marginBottom: 8, color: '#333'}}>Welcome Back</h1>
      <p style={{color: '#999', marginBottom: 24, fontSize: 14}}>Sign in to your account</p>
      
      {error && <div style={{background: '#fee', color: '#c33', padding: 12, borderRadius: 6, marginBottom: 16, fontSize: 14}}>{error}</div>}
      
      <form onSubmit={submit}>
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
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p style={{textAlign: 'center', marginTop: 20, fontSize: 14, color: '#999'}}>
        Don't have an account? <Link to="/register" style={{color: '#667eea', fontWeight: 600}}>Register</Link>
      </p>
    </div>
  )
}
