import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
      const res = await fetch('http://localhost:8081/api/auth/register',{
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
    <div style={{maxWidth:420, margin:'24px auto', padding:16, border:'1px solid #eee', borderRadius:6}}>
      <h2 style={{marginTop:0}}>Register</h2>
      {error && <div style={{color:'red', marginBottom:8}}>{error}</div>}
      {success && <div style={{color:'green', marginBottom:8}}>{success}</div>}
      <form onSubmit={submit}>
        <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create account'}</button>
      </form>
    </div>
  )
}
