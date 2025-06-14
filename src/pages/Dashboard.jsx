"use client"

import { useState, useEffect, useRef } from "react"
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom"
import DashboardHome from "../components/DashboardHome"
import UsernameSearchPage from "../components/UsernameSearchPage"
import ProductsPage from "../components/ProductPage"
import SettingsPage from "../components/SettingPage"
import OSINTSearchPage from "../components/OSINTSearchPage"
import UsageHistory from "../components/UsageHistory"
import Chart from 'chart.js/auto'
import axios from 'axios'

import { Search, Filter, X } from "lucide-react"
import { set } from "date-fns"
import SocialMediaSearch from "../components/SocialMediaSearch"
// import CustomerGroupsPage from "../components/CustomerGroupsPage"
// import CustomerReportsPage from "../components/CustomerReportsPage"
// import ProductCategoriesPage from "../components/ProductCategoriesPage"
// import ProductInventoryPage from "../components/ProductInventoryPage"

function Dashboard({ onLogout }) {
  // Tambahkan useState untuk mengelola dropdown yang terbuka
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState({})
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const profileDropdownRef = useRef(null)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sijituPoint, setSijituPoint] = useState(100); // contoh awal

  useEffect(() => {
    // Hapus kelas dark dari document jika ada
    document.documentElement.classList.remove("dark")
    const token = localStorage.getItem('token')
  
      if (!token) {
        navigate('/')
        Swal.fire({
                  icon: 'error',
                  title: 'Authentication Failed',
                  text: 'Please login to continue.',
                  confirmButtonColor: '#8A0C17',
                })
        return
      }
  
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/home`, {
        companyId: localStorage.getItem('companyId'),
        email: localStorage.getItem('email')
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        setDashboardData(res.data)  
        setSijituPoint(res.data.sijitu.point || 0)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
  
        if (err.response && err.response.status === 401) {
          // Token tidak valid, redirect ke login
          localStorage.removeItem('token')
          navigate('/')
          Swal.fire({
                  icon: 'error',
                  title: 'Authentication Failed',
                  text: 'Please login to continue.',
                  confirmButtonColor: '#8A0C17',
                })
        } else {
          setError("Gagal mengambil data dashboard.")
        }
      })
  }, [navigate])

  const updateSijituPoint = async () => {
    try {
      const token = localStorage.getItem('token')
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/home`, {
        companyId: localStorage.getItem('companyId'),
        email: localStorage.getItem('email')
      },{
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
        setSijituPoint(res.data.sijitu.point || 0)
      })
    } catch (err) {
      console.error('Gagal ambil point:', err);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // from api
  const userProfile = {
    name: dashboardData?.data?.name || "NULL",
    email: dashboardData?.data?.email || "NULL",
    role: dashboardData?.data?.roles || "NULL",
    sijituPoint: dashboardData?.sijitu?.point || 0,
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (!darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [profileDropdownRef])

  // Tambahkan fungsi untuk mengelola dropdown
  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Toggle dropdown profil
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen)
  }

  // Ubah navItems untuk mendukung dropdown
  const navItems = [
    {
      name: "Dashboard",
      href: "/home",
      icon: "chart-bar",
    },
    {
      name: "Screening 2.0",
      href: "/home/usernamesearch",
      icon: "magnifying-glass",
      dropdown: [
        { name: "Name Screening", href: "/home/usernamesearch" },
        { name: "Usage History", href: "/home/usagehistory" },
      ],
    },
    {
      name: "OSINT Tools",
      icon: "magnifying-glass",
      dropdown: [
        { name: "GCSE Tools", href: "/home/socialmediasearch" },
        // { name: "Scrap Search", href: "/home/osintsearch" },
      ],
    },
    {
      name: "Point Report",
      href: "/home/settings",
      icon: "cog",
    },
  ]

  // Function to render icon based on name
  const renderIcon = (iconName) => {
    switch (iconName) {
      case "chart-bar":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" x2="18" y1="20" y2="10" />
            <line x1="12" x2="12" y1="20" y2="4" />
            <line x1="6" x2="6" y1="20" y2="14" />
          </svg>
        )
      case "users":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        )
      case "shopping-cart":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
          </svg>
        )
      case "cog":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )
      case "globe":
        return (
          <i className="fas fa-globe"></i>
        )
      case "magnifying-glass":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="10" cy="10" r="7" />
            <line x1="21" x2="15" y1="21" y2="15" />
          </svg>
        )

      default:
        return null
    }
  }

  return (
    <div className={`flex h-screen ${darkMode ? "" : ""}`}>
      {/* Overlay for mobile sidebar */}
      <div
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-200 lg:hidden ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-black via-[#8A0A13] to-black text-white border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:h-screen ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 shadow-sm">
          <Link
            to="/home"
            className="flex items-center space-x-2 font-bold text-xl text-blue-600 p-10"
          >
            <img src="/public/sijitu-white.png" />
          </Link>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            const hasDropdown = item.dropdown && item.dropdown.length > 0
            const isDropdownOpen = openDropdowns[item.name] || false

            return (
              <div key={item.name} className="space-y-1">
                <div className="flex flex-col">
                  <button
                    onClick={() => {
                      if (hasDropdown) {
                        toggleDropdown(item.name)
                      } else {
                        // Use React Router's navigate instead of window.location
                        navigate(item.href)
                        if (sidebarOpen) {
                          setSidebarOpen(false)
                        }
                      }
                    }}
                    className={`flex items-center justify-between px-4 py-2 rounded-md transition-colors ${
                      isActive && !hasDropdown
                        ? "bg-gray-300 text-black"
                        : "text-white hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="mr-3">{renderIcon(item.icon)}</span>
                      {item.name}
                    </div>
                    {hasDropdown && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    )}
                  </button>

                  {/* Dropdown items */}
                  {hasDropdown && isDropdownOpen && (
                    <div className="pl-10 mt-1 space-y-1">
                      {item.dropdown.map((subItem) => {
                        const isSubActive = location.pathname === subItem.href
                        return (
                          <button
                            key={subItem.name}
                            onClick={() => {
                              navigate(subItem.href)
                              if (sidebarOpen) {
                                setSidebarOpen(false)
                              }
                            }}
                            className={`block w-full text-left px-4 py-2 rounded-md transition-colors ${
                              isSubActive
                                ? "bg-gray-300 text-black"
                                : "text-white hover:bg-gray-100 hover:text-gray-900"
                            }`}
                          >
                            {subItem.name}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4">
          <p className="text-white">Made with <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" data-slot="icon" class="-mt-0.5 inline-block h-3.5 w-3.5 text-red-600"><path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z"></path></svg> by <label className='font-bold'>Snikky</label></p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top navigation */}
        {/* <header className="h-16 shadow-lg bg-gradient-to-r from-red-800 via-red-800 to-black flex items-center justify-between px-4"> */}
        <header className="h-16 shadow-lg bg-gradient-to-r from-black via-[#8A0A13] to-black flex items-center justify-between px-4">
          <div className="flex items-center">
            <button
              className="lg:hidden p-2 mr-2 rounded-md hover:bg-red-300 bg-red-700"
              onClick={toggleSidebar}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
            <div className="relative w-full max-w-md hidden md:block">
              <span className="absolute left-2.5 top-2.5 text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Search..."
                className="w-full bg-white pl-8 h-9 rounded-md border border-gray-300 px-3 py-1 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative p-2 rounded-md bg-[#8A0A13]  text-white flex items-center gap-2">
              <div className="group relative">
                <i className="fas fa-coins"></i>
                {/* <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 max-w-lg px-3 py-2 text-md text-white bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity break-words whitespace-normal">
                  <b>SIJITU Point</b> : digunakan untuk memanfaatkan fitur pada layanan SIJITU
                </span> */}
              </div>
              <span className="font-bold text-lg"> Point : {sijituPoint}</span>
            </div>
            <div className="relative" ref={profileDropdownRef}>
              <button
                className="h-10 w-10 rounded-full bg-black border border-gray-300 flex items-center justify-center"
                onClick={toggleProfileDropdown}
              >
                <span>
                  <img src="/public/logo-only-white.png" width="25px" height="25px" />
                </span>
              </button>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-gradient-to-b from-black to-red-800 rounded-md shadow-lg z-50">
                  <div className="p-4 border-b border-gray-800">
                    <p className="font-medium text-white">{userProfile.name}</p>
                    <p className="text-sm text-white mt-1">{userProfile.email}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-red-800">
                        {userProfile.role}
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white hover:text-black rounded-md"
                      onClick={() => navigate("/home/settings")}
                    >
                      Profile Settings
                    </button>
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-white hover:bg-white hover:text-black rounded-md flex items-center"
                      onClick={onLogout}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mr-2"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" x2="9" y1="12" y2="12" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 bg-white">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/usernamesearch" element={<UsernameSearchPage onPointUpdated={updateSijituPoint} />} />
            {/* <Route path="/customers/groups" element={<CustomerGroupsPage />} /> */}
            {/* <Route path="/customers/reports" element={<CustomerReportsPage />} /> */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/usagehistory" element={<UsageHistory />} />
            {/* <Route path="/products/categories" element={<ProductCategoriesPage />} />
            <Route path="/products/inventory" element={<ProductInventoryPage />} /> */}
            <Route path="/osintsearch" element={<OSINTSearchPage />} />
            <Route path="/socialmediasearch" element={<SocialMediaSearch />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
        <div className="w-full p-4 border-t border-gray-200 bg-gradient-to-l from-black via-[#8A0A13] to-black flex justify-center items-center mt-auto">
          <p className="text-white">
          © 2026 <b>PT SIJITU REGTECH ASIA</b>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

