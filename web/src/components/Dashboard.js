import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard(){
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetch('http://localhost:8080/api/user/me',{ headers: { Authorization: 'Bearer '+token } })
      .then(async r => {
        if (!r.ok) {
          const t = await r.text()
          throw new Error(t || 'Failed to fetch')
        }
        return r.json()
      })
      .then(setUser)
      .catch(e=>{ setError(e.message); if (e.message && e.message.toLowerCase().includes('unauthorized')) { localStorage.removeItem('token'); navigate('/login') } })
  },[navigate])

  function logout(){ localStorage.removeItem('token'); navigate('/login') }

  return (
    <div style={{maxWidth:600}}>
      <div style={{
        background: 'white',
        borderRadius: 12,
        padding: 40,
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        marginBottom: 24
      }}>
        <h1 style={{fontSize: 28, marginBottom: 8, color: '#333'}}>Welcome to Dashboard</h1>
        <p style={{color: '#999', marginBottom: 24, fontSize: 14}}>Your profile information</p>
        
        {error && <div style={{background: '#fee', color: '#c33', padding: 12, borderRadius: 6, marginBottom: 16, fontSize: 14}}>{error}</div>}
        
        {user ? (
          <div style={{marginBottom: 24}}>
            <div style={{
              background: '#f9f9f9',
              padding: 20,
              borderRadius: 8,
              marginBottom: 16,
              borderLeft: '4px solid #667eea'
            }}>
              <p style={{margin: '8px 0', color: '#666'}}>
                <strong style={{color: '#333'}}>Username:</strong> <span style={{fontSize: 16, fontWeight: 500}}>{user.username}</span>
              </p>
              <p style={{margin: '8px 0', color: '#666'}}>
                <strong style={{color: '#333'}}>Email:</strong> <span style={{fontSize: 16, fontWeight: 500}}>{user.email}</span>
              </p>
            </div>
          </div>
        ) : (
          <div style={{textAlign: 'center', padding: 32}}>
            <div style={{display: 'inline-block', width: 40, height: 40, border: '3px solid #667eea', borderRadius: '50%', borderTop: '3px solid transparent', animation: 'spin 1s linear infinite'}}></div>
            <p style={{marginTop: 12, color: '#999'}}>Loading...</p>
          </div>
        )}

        <button onClick={logout} style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          marginTop: 24
        }}>Logout</button>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
