"use client"

import { useState, useEffect } from "react"
import '@fontsource/manrope';
import '@fontsource/manrope/300.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/700.css';
import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import Dashboard from "./pages/Dashboard"
import OSINTDashboard from "./pages/OSINTDashboard"

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (token) {
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = () => {
    localStorage.setItem("token")
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setIsLoggedIn(false)
  }

  return (
    <Routes>
      <Route path="/dashboard" element={isLoggedIn ? <Navigate to="/home" /> : <LoginPage onLogin={handleLogin} />} />
      <Route path="/" element={<LoginPage onLogin={handleLogin} />} />
      <Route
        path="/home/*"
        element={isLoggedIn ? <Dashboard onLogout={handleLogout} /> : <Navigate to="/" />}
      />
      <Route path="/osint" element={<OSINTDashboard />} />
    </Routes>
  )
}

export default App

