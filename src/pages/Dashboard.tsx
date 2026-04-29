import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Users, Activity, Heart, TrendingUp, TrendingDown, AlertTriangle,
  Calendar, Clock, ArrowRight, Zap, BarChart3, Bell, CheckCircle,
  Stethoscope, Pill, ClipboardList,
} from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, BarChart, Bar } from 'recharts'
import { useStore } from '../store/useStore'
import Navbar from '../components/Navbar'
import Breadcrumb from '../components/Breadcrumb'
import { recentActivities } from '../data/mockPatients'
import { format } from 'date-fns'

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }

const activityDotColor: Record<string, string> = {
  admission: '#10b981', results: '#06b6d4', appointment: '#6c47ff',
  alert: '#f43f5e', discharge: '#f97316',
}

const activityIconBg: Record<string, string> = {
  admission: '#dcfce7', results: '#e0f2fe', appointment: '#ede9fe',
  alert: '#fce7f3', discharge: '#fff7ed',
}

const sparkData = [
  { v: 38 }, { v: 55 }, { v: 48 }, { v: 64 }, { v: 70 }, { v: 62 }, { v: 78 },
]

const admissionsData = [
  { day: 'Mon', count: 12, prev: 10 },
  { day: 'Tue', count: 18, prev: 14 },
  { day: 'Wed', count: 15, prev: 16 },
  { day: 'Thu', count: 22, prev: 18 },
  { day: 'Fri', count: 19, prev: 20 },
  { day: 'Sat', count: 8,  prev: 7  },
  { day: 'Sun', count: 6,  prev: 5  },
]

const vitalsStream = [
  { t: '08:00', hr: 72, bp: 120 }, { t: '09:00', hr: 75, bp: 122 },
  { t: '10:00', hr: 78, bp: 118 }, { t: '11:00', hr: 82, bp: 125 },
  { t: '12:00', hr: 76, bp: 119 }, { t: '13:00', hr: 74, bp: 121 },
  { t: '14:00', hr: 79, bp: 124 }, { t: '15:00', hr: 77, bp: 120 },
]

const todaySchedule = [
  { time: '09:00', name: 'Priya Sharma',   type: 'Follow-up',     dept: 'Endocrinology', color: '#6c47ff' },
  { time: '10:30', name: 'Rajesh Kumar',   type: 'Cardiac Review',dept: 'Cardiology',    color: '#f43f5e' },
  { time: '12:00', name: 'Ananya Nair',    type: 'Consultation',  dept: 'Neurology',     color: '#06b6d4' },
  { time: '14:30', name: 'Deepika Iyer',   type: 'Therapy',       dept: 'Psychiatry',    color: '#10b981' },
]

const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 10, padding: '8px 12px', fontSize: 11 }}>
      <p style={{ color: '#94a3b8', marginBottom: 4 }}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: String(p.color || p.fill).startsWith('url(') ? '#6c47ff' : (p.color || p.fill) }} />
          <span style={{ color: '#cbd5e1', fontSize: 10, textTransform: 'capitalize' }}>{p.name ?? p.dataKey}:</span>
          <span style={{ color: '#fff', fontWeight: 600 }}>{p.value}</span>
        </div>
      ))}
    </div>
  )
}

const card = {
  background: '#ffffff',
  border: '1px solid #e8ecf8',
  boxShadow: '0 1px 4px rgba(15,21,53,0.05), 0 4px 12px rgba(108,71,255,0.04)',
}

export default function Dashboard() {
  const { patients, user } = useStore()
  const navigate = useNavigate()

  const active   = patients.filter((p) => p.status === 'Active').length
  const highRisk = patients.filter((p) => p.riskLevel === 'High').length
  const pending  = patients.filter((p) => p.status === 'Pending').length
  const today    = format(new Date(), 'EEEE, MMMM d')
  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  const statCards = [
    { label: 'Total Patients', value: String(patients.length), sub: 'Registered',  change: '+12%', up: true,  icon: Users,         accent: '#6c47ff', soft: '#ede9fe' },
    { label: 'Active Cases',   value: String(active),          sub: 'Admitted',    change: '+5%',  up: true,  icon: Activity,      accent: '#06b6d4', soft: '#e0f2fe' },
    { label: 'High Risk',      value: String(highRisk),        sub: 'Alert',       change: '-2',   up: false, icon: AlertTriangle, accent: '#f43f5e', soft: '#fce7f3' },
    { label: 'Pending Review', value: String(pending),         sub: 'Awaiting',    change: '+3',   up: false, icon: Clock,         accent: '#f97316', soft: '#fff7ed' },
  ]

  const criticalPatients = patients.filter((p) => p.riskLevel === 'High')
  const depts = [
    { name: 'Cardiology',    patients: 28, pct: 75, color: '#f43f5e' },
    { name: 'Endocrinology', patients: 22, pct: 60, color: '#6c47ff' },
    { name: 'Neurology',     patients: 18, pct: 48, color: '#06b6d4' },
    { name: 'Pulmonology',   patients: 15, pct: 40, color: '#10b981' },
    { name: 'Nephrology',    patients: 12, pct: 32, color: '#f97316' },
  ]

  return (
    <div className="min-h-full bg-[#f0f3ff]">
      <Navbar title="Dashboard" subtitle={today} />

      <div className="p-4 sm:p-5 lg:p-6 space-y-5">
        <Breadcrumb crumbs={[{ label: 'Dashboard' }]} />

        {/* ── Critical alert banner ── */}
        {highRisk > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #fce7f3, #fff1f5)', border: '1.5px solid #fbcfe8' }}
          >
            <div className="w-8 h-8 rounded-xl bg-[#f43f5e] flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={16} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#be185d] text-sm font-bold">
                {highRisk} High-Risk Patient{highRisk > 1 ? 's' : ''} Require Immediate Attention
              </p>
              <p className="text-[#db2777] text-xs">
                {criticalPatients.slice(0, 2).map((p) => p.name).join(', ')}
                {criticalPatients.length > 2 ? ` +${criticalPatients.length - 2} more` : ''}
              </p>
            </div>
            <button
              onClick={() => navigate('/patients')}
              className="flex-shrink-0 flex items-center gap-1.5 text-xs font-bold text-[#f43f5e] hover:text-[#e11d48] transition-colors whitespace-nowrap"
            >
              View All <ArrowRight size={12} />
            </button>
          </motion.div>
        )}

        {/* ── Welcome banner ── */}
        <motion.div {...fadeUp} transition={{ duration: 0.4 }}
          className="relative overflow-hidden rounded-3xl p-5 sm:p-6 lg:p-8"
          style={{
            background: 'linear-gradient(135deg, #0f0a2e 0%, #1c0f52 45%, #0b1a4a 100%)',
            boxShadow: '0 8px 40px rgba(108,71,255,0.28)',
          }}
        >
          {/* Orbs */}
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(108,71,255,0.25), transparent 65%)' }} />
          <div className="absolute right-32 -bottom-12 w-48 h-48 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.15), transparent 65%)' }} />
          {/* Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)',
              backgroundSize: '44px 44px',
            }}
          />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-purple-300/80 text-xs font-bold uppercase tracking-widest mb-1.5">{greeting}</p>
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-white leading-tight">
                {user?.displayName || 'Prajwal Mulik'} 👋
              </h2>
              <p className="text-slate-300/70 mt-2 text-sm max-w-md">
                You have{' '}
                <span className="text-[#fca5a5] font-bold">{highRisk} high-risk</span> and{' '}
                <span className="text-[#93c5fd] font-bold">{todaySchedule.length} appointments</span>{' '}
                scheduled today.
              </p>

              {/* Quick stats row */}
              <div className="flex flex-wrap gap-4 mt-4">
                {[
                  { icon: Stethoscope, label: 'In Review', val: pending, color: '#c4b5fd' },
                  { icon: Pill, label: 'On Medication', val: 8, color: '#67e8f9' },
                  { icon: ClipboardList, label: 'Reports Due', val: 3, color: '#fda4af' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: `${s.color}20`, border: `1px solid ${s.color}30` }}>
                      <s.icon size={13} style={{ color: s.color }} />
                    </div>
                    <div>
                      <span className="text-white font-bold text-sm">{s.val}</span>
                      <span className="text-slate-400 text-xs ml-1">{s.label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0">
              <motion.button
                onClick={() => navigate('/patients')}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 grad-bg rounded-xl px-5 py-2.5 text-white text-sm font-bold glow-purple"
              >
                View Patients <ArrowRight size={14} />
              </motion.button>
              <motion.button
                onClick={() => navigate('/analytics')}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-slate-300 text-sm font-semibold justify-center"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <BarChart3 size={14} /> Analytics
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {statCards.map((card, i) => (
            <motion.div
              key={card.label}
              {...fadeUp} transition={{ delay: i * 0.07 }}
              onClick={() => navigate('/patients')}
              className="bg-white rounded-2xl p-4 sm:p-5 relative overflow-hidden group card-hover"
              style={{ border: '1px solid #e8ecf8', boxShadow: '0 1px 4px rgba(15,21,53,0.05)' }}
            >
              {/* Soft blob */}
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full pointer-events-none opacity-50"
                style={{ background: `radial-gradient(circle, ${card.soft}, transparent 70%)` }} />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: card.soft }}>
                    <card.icon size={18} style={{ color: card.accent }} />
                  </div>
                  <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    card.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                  }`}>
                    {card.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
                    {card.change}
                  </span>
                </div>
                <p className="font-display font-bold text-3xl text-gray-900 leading-none">{card.value}</p>
                <p className="text-gray-500 text-xs font-semibold mt-1">{card.label}</p>
                <p className="text-gray-300 text-[10px] mt-0.5">{card.sub}</p>
              </div>

              {/* Sparkline */}
              <div className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none opacity-20">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={sparkData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id={`sp${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={card.accent} stopOpacity={0.6} />
                        <stop offset="95%" stopColor={card.accent} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="v" stroke={card.accent} strokeWidth={2} fill={`url(#sp${i})`} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Main bento row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Weekly admissions — 2 cols */}
          <motion.div {...fadeUp} transition={{ delay: 0.28 }}
            className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6" style={card}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-gray-900 text-base">Weekly Admissions</h3>
                <p className="text-gray-400 text-xs mt-0.5">This week vs last week</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="items-center gap-4 text-[11px] text-gray-500 hidden sm:flex">
                  <span className="flex items-center gap-1.5">
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#6c47ff', flexShrink: 0 }} />
                    This week
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#d1d5db', flexShrink: 0 }} />
                    Last week
                  </span>
                </div>
                <span className="text-[11px] font-bold px-3 py-1 rounded-full"
                  style={{ background: '#ede9fe', color: '#6c47ff' }}>Live</span>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={admissionsData} barGap={3} barSize={16}>
                  <defs>
                    <linearGradient id="barG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"  stopColor="#6c47ff" stopOpacity={1} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="prev"  name="Last week"  fill="#e8ecf8" radius={[4,4,0,0]} />
                  <Bar dataKey="count" name="This week" fill="url(#barG)" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Department breakdown */}
          <motion.div {...fadeUp} transition={{ delay: 0.32 }}
            className="bg-white rounded-3xl p-5 sm:p-6" style={card}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-base">Departments</h3>
              <button
                onClick={() => navigate('/analytics')}
                className="text-[11px] text-[#6c47ff] font-semibold hover:underline flex items-center gap-1"
              >
                View all <ArrowRight size={11} />
              </button>
            </div>
            <div className="space-y-3.5">
              {depts.map((d, i) => (
                <motion.div key={d.name}
                  initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-xs text-gray-600 font-medium">{d.name}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-800">{d.patients}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }} animate={{ width: `${d.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.06, ease: 'easeOut' }}
                      className="h-full rounded-full" style={{ background: d.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Second bento row ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Critical alerts */}
          <motion.div {...fadeUp} transition={{ delay: 0.36 }}
            className="bg-white rounded-3xl p-5 sm:p-6" style={card}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#fce7f3] flex items-center justify-center">
                  <AlertTriangle size={14} className="text-[#f43f5e]" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">Critical Alerts</h3>
              </div>
              <button
                onClick={() => navigate('/patients')}
                className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: '#fce7f3', color: '#db2777' }}
              >
                {highRisk} High Risk
              </button>
            </div>
            <div className="space-y-2.5">
              {criticalPatients.slice(0, 3).map((p) => (
                <motion.div key={p.id} whileHover={{ x: 3 }} onClick={() => navigate('/patients')}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:shadow-sm group"
                  style={{ background: '#fef2f2', border: '1px solid #fecdd3' }}
                >
                  <div className="w-9 h-9 rounded-xl grad-bg-2 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {p.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-xs font-semibold truncate group-hover:text-[#f43f5e] transition-colors">{p.name}</p>
                    <p className="text-gray-400 text-[11px] truncate">{p.condition}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[#f43f5e] text-sm font-bold">{p.vitals.oxygenSat}%</p>
                    <p className="text-gray-400 text-[10px]">O₂ sat</p>
                  </div>
                </motion.div>
              ))}
              {criticalPatients.length > 3 && (
                <button
                  onClick={() => navigate('/patients')}
                  className="w-full text-center text-[11px] text-[#6c47ff] font-semibold py-2 hover:underline"
                >
                  View {criticalPatients.length - 3} more →
                </button>
              )}
            </div>
          </motion.div>

          {/* Vitals chart */}
          <motion.div {...fadeUp} transition={{ delay: 0.40 }}
            className="bg-white rounded-3xl p-5 sm:p-6" style={card}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Avg. Vitals Today</h3>
                <p className="text-gray-400 text-xs">Heart rate & systolic BP</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <span className="flex items-center gap-1">
                  <span style={{ display: 'inline-block', width: 8, height: 2, borderRadius: 2, background: '#f43f5e', flexShrink: 0 }} />
                  HR
                </span>
                <span className="flex items-center gap-1">
                  <span style={{ display: 'inline-block', width: 8, height: 2, borderRadius: 2, background: '#06b6d4', flexShrink: 0 }} />
                  BP
                </span>
              </div>
            </div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={vitalsStream}>
                  <defs>
                    <linearGradient id="hrG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#f43f5e" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="bpG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="t" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 9 }} />
                  <Tooltip content={<ChartTip />} />
                  <Area type="monotone" dataKey="hr" name="Heart Rate" stroke="#f43f5e" strokeWidth={2} fill="url(#hrG)" dot={false} />
                  <Area type="monotone" dataKey="bp" name="Sys. BP"    stroke="#06b6d4" strokeWidth={2} fill="url(#bpG)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent activity */}
          <motion.div {...fadeUp} transition={{ delay: 0.44 }}
            className="bg-white rounded-3xl p-5 sm:p-6" style={card}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-sm">Recent Activity</h3>
              <Bell size={14} className="text-gray-400" />
            </div>
            <div className="space-y-3">
              {recentActivities.map((act, i) => (
                <motion.div key={act.id}
                  initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: activityIconBg[act.type] ?? '#ede9fe' }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: activityDotColor[act.type] ?? '#6c47ff' }} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-gray-700 text-xs leading-relaxed font-medium">{act.text}</p>
                    <p className="text-gray-400 text-[10px] mt-0.5">{act.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Today's schedule + quick actions ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Schedule — 2 cols */}
          <motion.div {...fadeUp} transition={{ delay: 0.48 }}
            className="lg:col-span-2 bg-white rounded-3xl p-5 sm:p-6" style={card}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#ede9fe] flex items-center justify-center">
                  <Calendar size={14} className="text-[#6c47ff]" />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">Today's Schedule</h3>
              </div>
              <button
                onClick={() => navigate('/patients')}
                className="text-[11px] text-[#6c47ff] font-semibold hover:underline"
              >
                View all
              </button>
            </div>
            <div className="space-y-2.5">
              {todaySchedule.map((appt, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.54 + i * 0.06 }}
                  className="flex items-center gap-3 p-3 rounded-xl hover:shadow-sm transition-all group"
                  style={{ background: '#fafbff', border: '1px solid #e8ecf8' }}
                >
                  <div className="text-center w-14 flex-shrink-0">
                    <p className="font-bold text-gray-800 text-xs">{appt.time}</p>
                    <p className="text-gray-400 text-[10px]">Today</p>
                  </div>
                  <div className="w-px h-8 rounded-full flex-shrink-0" style={{ background: appt.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 text-xs font-semibold truncate group-hover:text-[#6c47ff] transition-colors">{appt.name}</p>
                    <p className="text-gray-400 text-[11px]">{appt.type} · {appt.dept}</p>
                  </div>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${appt.color}15` }}>
                    <Stethoscope size={13} style={{ color: appt.color }} />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div {...fadeUp} transition={{ delay: 0.52 }}
            className="bg-white rounded-3xl p-5 sm:p-6" style={card}>
            <h3 className="font-semibold text-gray-900 text-sm mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: 'New Patient',  icon: Users,        accent: '#6c47ff', soft: '#ede9fe', path: '/patients' },
                { label: 'Analytics',   icon: BarChart3,     accent: '#06b6d4', soft: '#e0f2fe', path: '/analytics' },
                { label: 'Schedule',    icon: Calendar,      accent: '#10b981', soft: '#dcfce7', path: '/patients' },
                { label: 'AI Insights', icon: Zap,           accent: '#f97316', soft: '#fff7ed', path: '/analytics' },
              ].map((a) => (
                <motion.button key={a.label} onClick={() => navigate(a.path)}
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-center gap-2 p-3.5 rounded-2xl transition-all"
                  style={{ background: a.soft, border: `1.5px solid ${a.accent}18` }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <a.icon size={18} style={{ color: a.accent }} />
                  </div>
                  <span className="text-xs font-semibold" style={{ color: a.accent }}>{a.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Mini legend */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-[11px] text-gray-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={11} className="text-green-500" />
                  <span>{active} active now</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={11} className="text-orange-400" />
                  <span>{pending} pending</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
