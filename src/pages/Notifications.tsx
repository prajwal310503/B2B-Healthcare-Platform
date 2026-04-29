import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, CheckCheck, X, CheckCircle, AlertTriangle, Info, XCircle, Zap, Sparkles } from 'lucide-react'
import Navbar from '../components/Navbar'
import Breadcrumb from '../components/Breadcrumb'
import { useStore } from '../store/useStore'
import { formatDistanceToNow } from 'date-fns'

const typeConfig = {
  info:    { icon: Info,          color: '#06b6d4', soft: '#e0f2fe', border: '#bae6fd' },
  success: { icon: CheckCircle,   color: '#10b981', soft: '#dcfce7', border: '#bbf7d0' },
  warning: { icon: AlertTriangle, color: '#f97316', soft: '#fff7ed', border: '#fed7aa' },
  error:   { icon: XCircle,       color: '#f43f5e', soft: '#fce7f3', border: '#fbcfe8' },
}

const cardStyle = { background: '#ffffff', border: '1px solid #e8ecf8', boxShadow: '0 2px 12px rgba(108,71,255,0.05)' }

export default function Notifications() {
  const { notifications, markAllRead, markRead, addNotification, unreadCount } = useStore()
  const [swEnabled, setSwEnabled] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const requestPermission = async () => {
    if (!('Notification' in window)) { alert('Notifications not supported.'); return }
    const perm = await Notification.requestPermission()
    if (perm === 'granted') {
      setSwEnabled(true)
      if ('serviceWorker' in navigator) {
        try { await navigator.serviceWorker.register('/sw.js') } catch {}
      }
      new Notification('B2B Healthcare Notifications Enabled', {
        body: 'You will now receive real-time clinical alerts.',
        icon: '/favicon.svg',
      })
      addNotification({ title: 'Push Notifications Enabled', message: 'Real-time clinical alerts are now active.', type: 'success' })
    }
  }

  const simulateAlert = () => {
    const alerts = [
      { title: 'Critical Alert',     message: 'Patient #P004 O₂ saturation critical — 89%',     type: 'error'   as const },
      { title: 'Lab Results Ready',  message: 'CBC results for Eleanor Hartwell are available',   type: 'info'    as const },
      { title: 'Appointment Alert',  message: 'Patient James Thornton in 15 minutes',             type: 'warning' as const },
      { title: 'Discharge Approved', message: 'William Blackwood cleared for discharge',          type: 'success' as const },
    ]
    const alert = alerts[Math.floor(Math.random() * alerts.length)]
    addNotification(alert)
    if (Notification.permission === 'granted') {
      new Notification(alert.title, { body: alert.message, icon: '/favicon.svg' })
    }
  }

  const visible = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications

  return (
    <div className="min-h-full bg-[#f0f3ff]">
      <Navbar title="Notifications" subtitle="Manage alerts & push notifications" />

      <div className="p-4 lg:p-6 space-y-5 max-w-3xl">
        <Breadcrumb crumbs={[{ label: 'Notifications' }]} />
        {/* Push notifications panel */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0f0a2e 0%, #1a0845 100%)',
            boxShadow: '0 8px 32px rgba(108,71,255,0.2)',
          }}
        >
          <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                swEnabled ? 'bg-green-500/20 border border-green-400/30' : 'bg-purple-500/20 border border-purple-400/30'
              }`}>
                {swEnabled ? <Bell size={22} className="text-green-400" /> : <BellOff size={22} className="text-purple-300" />}
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">
                  {swEnabled ? 'Push Notifications Active' : 'Enable Push Notifications'}
                </h3>
                <p className="text-slate-400 text-sm mt-0.5">
                  {swEnabled
                    ? 'Service worker registered. Real-time alerts enabled.'
                    : 'Get instant clinical alerts on this device.'}
                </p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              {!swEnabled && (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={requestPermission}
                  className="grad-bg rounded-xl px-5 py-2.5 text-white text-sm font-bold glow-purple flex items-center gap-2">
                  <Bell size={14} /> Enable Now
                </motion.button>
              )}
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={simulateAlert}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-slate-300 text-sm font-semibold transition-all"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <Zap size={14} className="text-orange-400" /> Simulate Alert
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1 bg-white rounded-xl p-1" style={{ border: '1px solid #e8ecf8' }}>
            {[
              { key: 'all',    label: 'All Notifications' },
              { key: 'unread', label: `Unread${unreadCount > 0 ? ` (${unreadCount})` : ''}` },
            ].map((f) => (
              <button key={f.key} onClick={() => setFilter(f.key as any)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === f.key ? 'grad-bg text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                }`}
              >{f.label}</button>
            ))}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs text-[#6c47ff] hover:text-[#5535d4] font-semibold transition-colors">
              <CheckCheck size={14} /> Mark all read
            </button>
          )}
        </div>

        {/* Notification list */}
        <div className="space-y-2.5">
          <AnimatePresence>
            {visible.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex flex-col items-center py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm"
                  style={{ border: '1px solid #e8ecf8' }}>
                  <Bell size={28} className="text-gray-300" />
                </div>
                <p className="text-gray-700 font-semibold">No notifications</p>
                <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
              </motion.div>
            ) : (
              visible.map((n, i) => {
                const cfg = typeConfig[n.type]
                const Icon = cfg.icon
                return (
                  <motion.div key={n.id} layout
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 40 }} transition={{ delay: i * 0.03 }}
                    onClick={() => markRead(n.id)}
                    className="flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all hover:shadow-md"
                    style={{
                      background: !n.read ? cfg.soft : '#ffffff',
                      border: `1px solid ${!n.read ? cfg.border : '#e8ecf8'}`,
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'white', border: `1.5px solid ${cfg.color}28`, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                      <Icon size={18} style={{ color: cfg.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-semibold ${n.read ? 'text-gray-500' : 'text-gray-900'}`}>{n.title}</p>
                        <span className="text-[10px] text-gray-400 flex-shrink-0 font-medium">
                          {formatDistanceToNow(n.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{n.message}</p>
                      {!n.read && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: cfg.color }} />
                          <span className="text-[10px] font-bold" style={{ color: cfg.color }}>Unread</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
