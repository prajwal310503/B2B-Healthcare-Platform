import { motion } from 'framer-motion'
import { Bell, Shield, User, Monitor, ChevronRight } from 'lucide-react'
import Navbar from '../components/Navbar'
import Breadcrumb from '../components/Breadcrumb'
import { useStore } from '../store/useStore'

const cardStyle = { background: '#ffffff', border: '1px solid #e8ecf8', boxShadow: '0 2px 12px rgba(108,71,255,0.05)' }

export default function Settings() {
  const { user } = useStore()

  const sections = [
    {
      title: 'Account', icon: User, accent: '#6c47ff', soft: '#ede9fe',
      items: [
        { label: 'Profile Information',      desc: 'Name, email, specialty' },
        { label: 'Change Password',          desc: 'Update security credentials' },
        { label: 'Two-Factor Authentication',desc: 'Enabled via TOTP', badge: 'Active', bStyle: 'bg-green-50 text-green-600' },
      ],
    },
    {
      title: 'Notifications', icon: Bell, accent: '#f97316', soft: '#fff7ed',
      items: [
        { label: 'Push Notifications', desc: 'Browser & mobile alerts',        badge: 'On',      bStyle: 'bg-green-50 text-green-600' },
        { label: 'Email Digests',       desc: 'Daily summary reports' },
        { label: 'Critical Alerts',     desc: 'High-risk patient notifications', badge: 'Always',  bStyle: 'bg-red-50 text-red-500' },
      ],
    },
    {
      title: 'Privacy & Security', icon: Shield, accent: '#10b981', soft: '#dcfce7',
      items: [
        { label: 'HIPAA Compliance',   desc: 'Data handling policies',        badge: 'Compliant', bStyle: 'bg-green-50 text-green-600' },
        { label: 'Session Management', desc: 'Active sessions & tokens' },
        { label: 'Audit Log',          desc: 'View access history' },
      ],
    },
    {
      title: 'Appearance', icon: Monitor, accent: '#06b6d4', soft: '#e0f2fe',
      items: [
        { label: 'Theme',    desc: 'Light mode',         badge: 'Light', bStyle: 'bg-[#e0f2fe] text-[#06b6d4]' },
        { label: 'Language', desc: 'English (US)',        badge: 'EN',    bStyle: 'bg-gray-100 text-gray-600' },
        { label: 'Timezone', desc: 'UTC-5 (Eastern Time)' },
      ],
    },
  ]

  return (
    <div className="min-h-full bg-[#f0f3ff]">
      <Navbar title="Settings" subtitle="Manage your account preferences" />

      <div className="p-4 lg:p-6 space-y-5 max-w-3xl">
        <Breadcrumb crumbs={[{ label: 'Settings' }]} />
        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-6 flex items-center gap-5" style={cardStyle}>
          <div className="w-16 h-16 rounded-2xl grad-bg-2 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 glow-pink">
            {user?.displayName?.slice(0, 2).toUpperCase() ?? 'DR'}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-xl text-gray-900">{user?.displayName || 'Dr. Sarah Mitchell'}</h2>
            <p className="text-gray-500 text-sm">{user?.email || 'demo@b2bhealthcare.com'}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[11px] px-2.5 py-1 rounded-full font-bold" style={{ background: '#ede9fe', color: '#6c47ff' }}>Administrator</span>
              <span className="text-[11px] px-2.5 py-1 rounded-full font-bold status-active">Active</span>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            className="grad-bg rounded-xl px-4 py-2.5 text-white text-sm font-bold flex-shrink-0 glow-purple">
            Edit Profile
          </motion.button>
        </motion.div>

        {/* Settings sections */}
        {sections.map((section, si) => (
          <motion.div key={section.title}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.08 }}
            className="rounded-3xl overflow-hidden" style={cardStyle}
          >
            <div className="px-5 py-4 flex items-center gap-3"
              style={{ borderBottom: '1px solid #f0f3ff' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: section.soft }}>
                <section.icon size={15} style={{ color: section.accent }} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{section.title}</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {section.items.map((item) => (
                <motion.button key={item.label} whileHover={{ backgroundColor: '#fafbff' }}
                  className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors">
                  <div>
                    <p className="text-gray-800 text-sm font-medium">{item.label}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${item.bStyle}`}>{item.badge}</span>
                    )}
                    <ChevronRight size={14} className="text-gray-300" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        ))}

        <div className="text-center py-2">
          <p className="text-gray-400 text-xs">B2B Healthcare Platform v2.4.1 · HIPAA Compliant · SOC2 Certified</p>
        </div>
      </div>
    </div>
  )
}
