import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Swal from 'sweetalert2';
import Lottie from "lottie-react";
import loadingAnimation from "../assets/loading_login_rounded_w_dashed.json";

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyId: '',
    rememberMe: false
  })

  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const baseUrl = import.meta.env.VITE_API_BASE_URL
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  console.log("Component rendered");


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await axios.post(`${baseUrl}/api/login`, {
        email: formData.email,
        password: formData.password,
        companyId: formData.companyId
      })
      const status = response.data.status
      const message = response.data.message
      if(status) {
        const token = response.data.data.user.token
        // Simpan token ke localStorage (atau sessionStorage sesuai kebutuhan)
        localStorage.setItem('token', token)
        localStorage.setItem('companyId', formData.companyId)
        localStorage.setItem('email', formData.email)

        setLoading(false)
        navigate('/dashboard')
      }else{
        setLoading(false)
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: message,
          confirmButtonColor: '#8A0C17',
        })
        onLogin?.(token) // Optional callback jika ingin update global state
      }
    } catch (err) {
      setError('Login gagal. Periksa email, password, atau company ID.')
      console.error(err)
    }
  }

  return (
    <div className="relative flex items-center justify-center">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/public/sijitu-ratih-video-v12.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay gradient (opsional) */}
      {/* <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50 z-10"></div> */}

      {/* Content */}
      {/* <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 bg-[url('/public/sijitu-ratih-v6.jpg')] bg-cover bg-center"> */}
      <div className="w-full h-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 bg-white bg-cover bg-center">
        <div className="w-full max-w-lg relative">
          <div className="bg-gradient-to-b from-[#8A0A13] to-black rounded-lg shadow-lg overflow-hidden">
            <div className="text-center">
              <img className='m-auto p-10' src='/public/sijitu-white.png' />
              {loading && (
                  <div className="loading-overlay p-0">
                    <Lottie
                      animationData={loadingAnimation}
                      loop
                      style={{ width: 300, height: 100 }}
                      className="mx-auto"
                    />
                    <p style={{ fontWeight: 'bold' }} className="text-white">
                      on Login...
                    </p>
                  </div>
                )}
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="companyId" className="font-medium text-white">Company ID</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400 p-0 m-0">
                      <i className="fas fa-building"></i>
                    </span>
                    <input 
                      id="companyId" 
                      name="companyId"
                      type="text" 
                      placeholder="SSB001" 
                      className="w-full pl-10 h-10 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                      value={formData.companyId}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="font-medium text-white">Email</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <i className='fas fa-envelope'></i>
                    </span>
                    <input 
                      id="email" 
                      name="email"
                      type="email" 
                      placeholder="name@example.com" 
                      className="w-full pl-10 h-10 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="font-medium text-white">Password</label>
                    {/* <button type="button" className="text-xs text-blue-600 hover:underline">
                      Forgot password?
                    </button> */}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <i className='fas fa-lock'></i>
                    </span>
                    <input 
                      id="password" 
                      name="password"
                      type={showPassword ? "text" : "password"} 
                      placeholder="••••••••" 
                      className="w-full pl-10 h-10 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button 
                      type="button"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                          <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                          <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                          <line x1="2" x2="22" y1="2" y2="22" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="remember"
                    className="font-medium leading-none text-white"
                  >
                    Remember me
                  </label>
                </div>
                <button 
                  type="submit" 
                  className="w-full inline-flex items-center justify-center rounded-3xl px-4 py-2 font-medium text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 bg-[#8A0C17] shadow-none"
                >
                  Sign in
                </button>
              </form>
            </div>
            <div className="p-6">
              <div className="text-center text-sm text-white">
                Don't have an account?{" "}
                <button className="text-blue-600 hover:underline">
                  Sign up
                </button>
              </div>
            </div>  
            <div className="p-6">
              <div className="text-center text-white">
                <button 
                  onClick={() => {
                    navigate('/osint')
                  }}
                  className=" inline-flex items-center justify-center rounded-3xl px-4 py-2 font-medium text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 bg-gray-900 shadow-none"
                >
                  OSINT w/ SIJITU
                </button>
              </div>
            </div>  
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
