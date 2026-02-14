import React from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  const location = useLocation()
  const isAuth = !!localStorage.getItem('token')

  return (
    <div style={{minHeight:'100vh', display:'flex', flexDirection:'column'}}>
      {/* Header/Nav */}
      <nav style={{
        background: 'rgba(255,255,255,0.95)',
        padding: '16px 24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '40px'
      }}>
        <div style={{maxWidth:800, margin:'0 auto', display:'flex', gap:24, alignItems:'center'}}>
          <Link to="/" style={{fontSize:20, fontWeight:700, color:'#667eea'}}>Auth App</Link>
          <div style={{display:'flex', gap:24, marginLeft:'auto'}}>
            {!isAuth && (
              <>
                <Link to="/login" style={{color: location.pathname === '/login' ? '#667eea' : '#666', borderBottom: location.pathname === '/login' ? '2px solid #667eea' : 'none', paddingBottom: 4}}>Login</Link>
                <Link to="/register" style={{color: location.pathname === '/register' ? '#667eea' : '#666', borderBottom: location.pathname === '/register' ? '2px solid #667eea' : 'none', paddingBottom: 4}}>Register</Link>
              </>
            )}
            {isAuth && (
              <Link to="/dashboard" style={{color: location.pathname === '/dashboard' ? '#667eea' : '#666', borderBottom: location.pathname === '/dashboard' ? '2px solid #667eea' : 'none', paddingBottom: 4}}>Dashboard</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{flex:1, maxWidth:600, width:'100%', margin:'0 auto', padding:'0 20px'}}>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  )
}
