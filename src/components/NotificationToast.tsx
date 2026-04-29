import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react'
import { useStore } from '../store/useStore'
import type { Notification } from '../types'

const typeConfig = {
  success: { icon: CheckCircle,   color: '#10b981', soft: '#dcfce7', border: '#bbf7d0' },
  warning: { icon: AlertTriangle, color: '#f97316', soft: '#fff7ed', border: '#fed7aa' },
  info:    { icon: Info,          color: '#06b6d4', soft: '#e0f2fe', border: '#bae6fd' },
  error:   { icon: XCircle,       color: '#f43f5e', soft: '#fce7f3', border: '#fbcfe8' },
}

function Toast({ notification, onClose }: { notification: Notification; onClose: () => void }) {
  const cfg = typeConfig[notification.type]
  const Icon = cfg.icon

  useEffect(() => {
    const t = setTimeout(onClose, 5000)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <motion.div layout
      initial={{ opacity: 0, x: 60, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="flex items-start gap-3 px-4 py-3.5 rounded-2xl w-80 shadow-2xl"
      style={{ background: '#ffffff', border: `1.5px solid ${cfg.border}`, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: cfg.soft }}>
        <Icon size={17} style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-gray-900 text-sm font-semibold">{notification.title}</p>
        <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{notification.message}</p>
      </div>
      <button onClick={onClose} className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors mt-0.5">
        <X size={14} />
      </button>
    </motion.div>
  )
}

export default function NotificationToastContainer() {
  const { notifications, markRead } = useStore()
  const recent = notifications.filter((n) => !n.read).slice(0, 1)

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end pointer-events-none">
      <div className="pointer-events-auto">
        <AnimatePresence>
          {recent.map((n) => (
            <Toast key={n.id} notification={n} onClose={() => markRead(n.id)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
