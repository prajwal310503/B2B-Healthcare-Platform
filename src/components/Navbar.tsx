import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Menu, Search, X, Check, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react'
import { useStore } from '../store/useStore'
import { formatDistanceToNow } from 'date-fns'

const typeConfig = {
  info:    { icon: Info,         dot: 'bg-[#06b6d4]', iconColor: 'text-[#06b6d4]' },
  success: { icon: CheckCircle,  dot: 'bg-[#10b981]', iconColor: 'text-[#10b981]' },
  warning: { icon: AlertTriangle,dot: 'bg-[#f97316]', iconColor: 'text-[#f97316]' },
  error:   { icon: XCircle,      dot: 'bg-[#f43f5e]', iconColor: 'text-[#f43f5e]' },
}

interface NavbarProps { title: string; subtitle?: string }

export default function Navbar({ title, subtitle }: NavbarProps) {
  const { toggleSidebar, notifications, unreadCount, markAllRead, markRead, searchQuery, setSearchQuery } = useStore()
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="h-[70px] flex items-center px-4 lg:px-6 gap-4 sticky top-0 z-30"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e8ecf8',
        boxShadow: '0 1px 8px rgba(108,71,255,0.05)',
      }}
    >
      {/* Mobile menu button */}
      <button onClick={toggleSidebar}
        className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all">
        <Menu size={20} />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="font-display font-bold text-lg text-gray-900 truncate leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-gray-400 truncate leading-none">{subtitle}</p>}
      </div>

      {/* Search bar — desktop */}
      <div className="hidden md:flex items-center gap-2 rounded-xl px-3 py-2 w-60 transition-all"
        style={{ background: '#f8faff', border: '1.5px solid #e2e8f0' }}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#6c47ff')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#e2e8f0')}
      >
        <Search size={14} className="text-gray-400 flex-shrink-0" />
        <input
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patients, records..."
          className="bg-transparent text-gray-800 text-sm placeholder-gray-400 flex-1 outline-none min-w-0"
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')}>
            <X size={12} className="text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Mobile search toggle */}
      <button onClick={() => setSearchOpen(!searchOpen)}
        className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all">
        <Search size={18} />
      </button>

      {/* Notifications */}
      <div className="relative" ref={notifRef}>
        <button onClick={() => setNotifOpen(!notifOpen)}
          className="relative w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all">
          <Bell size={18} />
          {unreadCount > 0 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#f43f5e] rounded-full text-[9px] text-white flex items-center justify-center font-bold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </button>

        <AnimatePresence>
          {notifOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl overflow-hidden z-50"
              style={{ border: '1px solid #e8ecf8' }}
            >
              <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid #f0f3ff' }}>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#f43f5e] text-white">{unreadCount}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead}
                      className="text-[11px] text-[#6c47ff] hover:text-[#5535d4] flex items-center gap-1 font-medium">
                      <Check size={11} /> Mark all read
                    </button>
                  )}
                  <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div className="max-h-[340px] overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center text-gray-400 text-sm">No notifications</div>
                ) : (
                  notifications.map((n) => {
                    const cfg = typeConfig[n.type]
                    const Icon = cfg.icon
                    return (
                      <div key={n.id} onClick={() => markRead(n.id)}
                        className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors ${!n.read ? 'bg-[#fafbff]' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 pulse-dot ${n.read ? 'bg-gray-300' : cfg.dot}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold ${n.read ? 'text-gray-500' : 'text-gray-900'}`}>{n.title}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{n.message}</p>
                            <p className="text-[10px] text-gray-300 mt-1">
                              {formatDistanceToNow(n.timestamp, { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="md:hidden absolute inset-0 bg-white flex items-center px-4 gap-3 z-50"
            style={{ borderBottom: '1px solid #e8ecf8' }}
          >
            <Search size={15} className="text-gray-400" />
            <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..." className="flex-1 bg-transparent text-gray-800 text-sm placeholder-gray-400 outline-none" />
            <button onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
