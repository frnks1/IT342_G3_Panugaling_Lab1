import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
      const res = await fetch('http://localhost:8081/api/auth/login',{
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
    <div style={{maxWidth:420, margin:'24px auto', padding:16, border:'1px solid #eee', borderRadius:6}}>
      <h2 style={{marginTop:0}}>Login</h2>
      {error && <div style={{color:'red', marginBottom:8}}>{error}</div>}
      <form onSubmit={submit}>
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
      </form>
    </div>
  )
}
