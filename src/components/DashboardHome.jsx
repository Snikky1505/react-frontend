import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';
import ReactSpeedometer from 'react-d3-speedometer';
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function DashboardHome() {
    const getGreeting = () => {
      const hour = new Date().getHours();
    
      if (hour >= 4 && hour < 11) {
          return "Good Morning";
      } else if (hour >= 11 && hour < 18) {
          return "Good Afternoon";
      } else {
          return "Good Evening";
      }
    };

    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate('/')
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
        setDashboardData(res.data.data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
  
        // if (err.response && err.response.status === 401) {
        //   // Token tidak valid, redirect ke login
        //   localStorage.removeItem('token')
        //   navigate('/')
        // } else {
        //   setError("Gagal mengambil data dashboard.")
        // }
      })
    }, [navigate])
  
    if (loading) return <p>Loading...</p>
    if (error) return <p>{error}</p>

    const usedPoints = 3925840;
    const remainingPoints = 9969939;
    const totalPoints = usedPoints + remainingPoints;
    const remainingPercentage = Math.round((remainingPoints / totalPoints) * 100);
    const remainingKycPercentage = 730;

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Dashboard</h1>
          <p className="text-gray-600">{getGreeting()}, {dashboardData?.name || 'NULL'}!</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="bg-gradient-to-b from-red-800 to-black border border-gray-200 rounded-md p-4 shadow-sm">
          <div class="flex items-center justify-between mb-2">
              <h3 class="text-white font-bold">Total Search</h3>
              <div class="text-white">
                  <i class="fas fa-search"></i>
              </div>
          </div>
          <div class="text-3xl font-bold text-white">11.972</div>
          <div class="text-sm text-white font-bold">+12% from last month</div>
        </div>
        <div class="bg-gradient-to-b from-red-800 to-black border border-gray-200 rounded-md p-4 shadow-sm">
          <div class="flex items-center justify-between mb-2">
              <h3 class="text-white font-bold">Total eKYC</h3>
              <div class="text-white">
                  <i class="fas fa-id-card"></i>
              </div>
          </div>
          <div class="text-3xl font-bold text-white">730</div>
          <div class="text-sm text-white font-bold">+5% from last month</div>
        </div>
        <div class="bg-gradient-to-b from-[#8A0A13] to-black border border-gray-200 rounded-md p-4 shadow-sm">
          <div class="flex items-center justify-between mb-2">
              <h3 class="text-white font-bold">Total Risk Scoring Simulation</h3>
              <div class="text-white">
                  <i class="fas fa-play"></i>
              </div>
          </div>
          <div class="text-3xl font-bold text-white">71</div>
          <div class="text-sm text-white font-bold">+1% from last month</div>
        </div>
        <div class="bg-gradient-to-b from-red-800 to-black border border-gray-200 rounded-md p-4 shadow-sm">
          <div class="flex items-center justify-between mb-2">
              <h3 class="text-white font-bold">Before Credit Expired</h3>
              <div class="text-white">
                  <i class="fas fa-calendar"></i>
              </div>
          </div>
          <div class="text-3xl font-bold text-white">721 Day</div>
          <div class="text-sm text-white">Renew before expired</div>
        </div>
      </div>
      <div class="bg-gradient-to-b from-red-800 to-black border border-gray-300 shadow-md rounded-md overflow-hidden mb-4">
          <div class="text-white px-4 py-2">
              <h2 class="text-lg text-white font-bold">Charts</h2>
          </div>
          <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 mt-4">
                  <div class="h-72 flex items-center justify-center">
                      <ReactSpeedometer
                          maxValue={1000}
                          value={remainingKycPercentage}
                          needleColor="#FFF"
                          startColor="#00FF00"
                          segments={10}
                          endColor="#FF0000"
                          textColor="#FFF"
                          width={400}
                          height={300}
                          currentValueText={`KYC Scan: ${remainingKycPercentage}`}
                      />
                  </div>
                  <div class="h-72 flex items-center justify-center">
                  <LineChart />
                  </div>
                </div>
                {/* <div class="grid grid-cols-1 md:grid-cols-2">
                  
                  <div class="h-72 flex items-center justify-center">
                    <PieChart />
                  </div>
              </div> */}
              </div>
        </div>
  
        {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value="$45,231.89"
            change="+20.1%"
            trend="up"
            icon={
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
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
          />
          <StatCard
            title="New Customers"
            value="+2,350"
            change="+18.2%"
            trend="up"
            icon={
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
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
          <StatCard
            title="Sales"
            value="+12,234"
            change="-4.5%"
            trend="down"
            icon={
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
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
            }
          />
          <StatCard
            title="Active Subscriptions"
            value="+573"
            change="+8.2%"
            trend="up"
            icon={
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
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <line x1="2" x2="22" y1="10" y2="10" />
              </svg>
            }
          />
        </div> */}
  
        {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-500">Overview</h3>
              <p className="text-sm text-gray-500">Monthly revenue and sales overview</p>
            </div>
            <div className="p-6 pt-0">
              <div className="h-[240px] flex items-center justify-center text-gray-500">
                Chart visualization would go here
              </div>
            </div>
          </div>
          <div className="col-span-3 bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-500">Recent Sales</h3>
              <p className="text-sm text-gray-500">You made 265 sales this month</p>
            </div>
            <div className="p-6 pt-0">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center">
                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                      <span className="text-xs font-medium">U{i}</span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">Customer {i}</p>
                      <p className="text-xs text-gray-500">customer{i}@example.com</p>
                    </div>
                    <div className="text-sm font-medium">+${(Math.random() * 1000).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div> */}
      </div>
    )
  }
  
  function StatCard({ title, value, change, trend, icon }) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <h3 className="text-md font-medium text-gray-600">{title}</h3>
            <span className="text-gray-600">{icon}</span>
          </div>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
          <p className="text-xs text-gray-500">
            <span className={`flex items-center ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
              {trend === "up" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="m18 15-6-6-6 6" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              )}
              {change}
            </span>{" "}
            from last month
          </p>
        </div>
      </div>
    )
  }
  
  export default DashboardHome
  
  