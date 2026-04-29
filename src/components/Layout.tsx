import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import NotificationToastContainer from './NotificationToast'
import { useStore } from '../store/useStore'

export default function Layout() {
  const { setSidebarOpen } = useStore()
  const location = useLocation()

  // Close mobile sidebar on route change
  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }, [location.pathname, setSidebarOpen])

  // Start collapsed on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }, [setSidebarOpen])

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f0f3ff' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
      <NotificationToastContainer />
    </div>
  )
}
