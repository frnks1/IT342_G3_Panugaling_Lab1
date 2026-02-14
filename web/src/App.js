import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

export default function App(){
  return (
    <div style={{padding:20}}>
      <nav style={{marginBottom:12}}>
        <Link to="/login" style={{marginRight:8}}>Login</Link>
        <Link to="/register" style={{marginRight:8}}>Register</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
      </Routes>
    </div>
  )
}
