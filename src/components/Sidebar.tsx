import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, BarChart3, Heart, Settings,
  LogOut, ChevronLeft, Bell,
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase/config'

const navItems = [
  { to: '/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/patients',       icon: Users,           label: 'Patients' },
  { to: '/analytics',      icon: BarChart3,        label: 'Analytics' },
  { to: '/notifications',  icon: Bell,             label: 'Notifications' },
  { to: '/settings',       icon: Settings,         label: 'Settings' },
]

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, setSidebarOpen, logout, user, unreadCount } = useStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try { await signOut(auth) } catch { /* demo mode */ }
    logout()
    navigate('/login')
  }

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? 'DR')

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Wrapper — needed so the toggle button can sit outside overflow:hidden */}
      <div className="relative flex-shrink-0 hidden lg:block">
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 240 : 68 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          className="h-full flex flex-col overflow-hidden"
          style={{
            background: '#ffffff',
            borderRight: '1px solid #e8ecf8',
            boxShadow: '2px 0 16px rgba(108,71,255,0.07)',
          }}
        >
          <SidebarInner
            sidebarOpen={sidebarOpen}
            initials={initials}
            user={user}
            unreadCount={unreadCount}
            handleLogout={handleLogout}
          />
        </motion.aside>

        {/* Collapse toggle — outside aside so overflow:hidden doesn't clip it */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3.5 top-[80px] z-10 w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-[#6c47ff] hover:border-[#6c47ff] transition-all"
          style={{ border: '1.5px solid #e2e8f0', boxShadow: '0 2px 8px rgba(108,71,255,0.12)' }}
        >
          <motion.div animate={{ rotate: sidebarOpen ? 0 : 180 }} transition={{ duration: 0.28 }}>
            <ChevronLeft size={13} />
          </motion.div>
        </button>
      </div>

      {/* Mobile: overlay sidebar (always full width) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="fixed left-0 top-0 h-full z-50 flex flex-col lg:hidden"
            style={{
              width: 240,
              background: '#ffffff',
              borderRight: '1px solid #e8ecf8',
              boxShadow: '4px 0 24px rgba(108,71,255,0.12)',
            }}
          >
            <SidebarInner
              sidebarOpen={true}
              initials={initials}
              user={user}
              unreadCount={unreadCount}
              handleLogout={handleLogout}
            />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

/* ── Inner content shared by desktop and mobile ── */
interface InnerProps {
  sidebarOpen: boolean
  initials: string
  user: any
  unreadCount: number
  handleLogout: () => void
}

function SidebarInner({ sidebarOpen, initials, user, unreadCount, handleLogout }: InnerProps) {
  return (
    <>
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-3.5 py-4 min-h-[70px] flex-shrink-0"
        style={{ borderBottom: '1px solid #f0f3ff' }}
      >
        <div className="w-9 h-9 rounded-xl grad-bg flex items-center justify-center flex-shrink-0 glow-purple">
          <Heart size={16} className="text-white" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }} transition={{ duration: 0.18 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <p className="font-display font-bold text-gray-900 text-[15px] leading-tight">MediSync</p>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest leading-none mt-0.5">Healthcare</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {sidebarOpen && (
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-2.5 pb-2 pt-1">Main Menu</p>
        )}
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-sm font-medium transition-all duration-200 relative
               ${isActive
                 ? 'bg-gradient-to-r from-[#ede9fe] to-[#e8f4fe] text-[#6c47ff] font-semibold shadow-sm'
                 : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
               }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full"
                    style={{ background: 'linear-gradient(180deg, #6c47ff, #06b6d4)' }}
                  />
                )}
                <div className="relative flex-shrink-0">
                  <Icon
                    size={17}
                    className={isActive ? 'text-[#6c47ff]' : 'text-gray-400 group-hover:text-[#6c47ff] transition-colors'}
                  />
                  {label === 'Notifications' && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#f43f5e] rounded-full text-[9px] text-white flex items-center justify-center font-bold leading-none">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </div>
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap flex-1"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-3 h-px bg-gray-100 flex-shrink-0" />

      {/* User profile + logout */}
      <div className="p-2.5 flex-shrink-0 space-y-0.5">
        <div
          className={`flex items-center gap-3 rounded-xl p-2.5 hover:bg-gray-50 transition-colors ${
            !sidebarOpen ? 'justify-center' : ''
          }`}
        >
          <div className="w-8 h-8 rounded-xl grad-bg-2 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
            {initials}
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-gray-800 text-xs font-semibold truncate">
                  {user?.displayName || 'Dr. Admin Demo'}
                </p>
                <p className="text-gray-400 text-[11px] truncate">{user?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full rounded-xl px-2.5 py-2.5 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all ${
            !sidebarOpen ? 'justify-center' : ''
          }`}
        >
          <LogOut size={16} className="flex-shrink-0" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="whitespace-nowrap text-sm"
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </>
  )
}
