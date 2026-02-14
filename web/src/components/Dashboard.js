import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard(){
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(()=>{
    const token = localStorage.getItem('token')
    if (!token) { navigate('/login'); return }
    fetch('http://localhost:8081/api/user/me',{ headers: { Authorization: 'Bearer '+token } })
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
    <div style={{maxWidth:600, margin:'24px auto'}}>
      <h2>Dashboard / Profile</h2>
      {error && <div style={{color:'red'}}>{error}</div>}
      {user ? (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : <p>Loading...</p>}
      <button onClick={logout}>Logout</button>
    </div>
  )
}
