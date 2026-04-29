import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
  LineChart, Line,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { TrendingUp, TrendingDown, Users, Activity, Heart, Zap, Download } from 'lucide-react'
import Navbar from '../components/Navbar'
import Breadcrumb from '../components/Breadcrumb'

const fadeUp = { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } }

const monthly = [
  { month: 'Oct', admissions: 145, discharges: 130, revenue: 420 },
  { month: 'Nov', admissions: 162, discharges: 148, revenue: 465 },
  { month: 'Dec', admissions: 138, discharges: 142, revenue: 380 },
  { month: 'Jan', admissions: 175, discharges: 165, revenue: 510 },
  { month: 'Feb', admissions: 190, discharges: 178, revenue: 545 },
  { month: 'Mar', admissions: 202, discharges: 195, revenue: 590 },
  { month: 'Apr', admissions: 218, discharges: 210, revenue: 630 },
]

const deptData = [
  { name: 'Cardiology',    value: 28, color: '#f43f5e' },
  { name: 'Endocrinology', value: 22, color: '#6c47ff' },
  { name: 'Neurology',     value: 18, color: '#06b6d4' },
  { name: 'Pulmonology',   value: 15, color: '#10b981' },
  { name: 'Nephrology',    value: 10, color: '#f97316' },
  { name: 'Psychiatry',    value: 7,  color: '#a78bfa' },
]

const ageData = [
  { range: '0-18', count: 8 }, { range: '19-35', count: 22 }, { range: '36-50', count: 35 },
  { range: '51-65', count: 42 }, { range: '66-80', count: 38 }, { range: '80+', count: 18 },
]

const outcomeData = [
  { month: 'Oct', recovered: 88, stable: 9, critical: 3 },
  { month: 'Nov', recovered: 85, stable: 11, critical: 4 },
  { month: 'Dec', recovered: 90, stable: 8,  critical: 2 },
  { month: 'Jan', recovered: 87, stable: 10, critical: 3 },
  { month: 'Feb', recovered: 92, stable: 6,  critical: 2 },
  { month: 'Mar', recovered: 89, stable: 9,  critical: 2 },
  { month: 'Apr', recovered: 93, stable: 6,  critical: 1 },
]

const radarData = [
  { metric: 'Patient Sat.', A: 88 }, { metric: 'Bed Util.', A: 76 },
  { metric: 'Staff Eff.', A: 82 },   { metric: 'Recovery', A: 93 },
  { metric: 'Readmissions', A: 68 }, { metric: 'ER Response', A: 79 },
]

const PERIODS = ['7D', '30D', '3M', '6M', '1Y']

const ChartTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs shadow-xl">
      <p className="text-gray-400 mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-0.5">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color || p.fill }} />
          <span className="text-gray-300 capitalize">{p.dataKey}:</span>
          <span className="text-white font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

const cardStyle = { border: '1px solid #e8ecf8', boxShadow: '0 2px 12px rgba(108,71,255,0.05)' }

export default function Analytics() {
  const [period, setPeriod] = useState('3M')

  const kpis = [
    { label: 'Total Admissions', value: '1,230', change: '+14.2%', up: true, accent: '#6c47ff', soft: '#ede9fe', icon: Users },
    { label: 'Recovery Rate',    value: '91.3%', change: '+2.1%',  up: true, accent: '#10b981', soft: '#dcfce7', icon: Activity },
    { label: 'Avg. Stay (days)', value: '4.2',   change: '-0.3',   up: true, accent: '#06b6d4', soft: '#e0f2fe', icon: Heart },
    { label: 'Revenue (YTD)',    value: '$3.54M', change: '+18.5%', up: true, accent: '#f97316', soft: '#fff7ed', icon: Zap },
  ]

  return (
    <div className="min-h-full bg-[#f0f3ff]">
      <Navbar title="Analytics" subtitle="Clinical performance & insights" />

      <div className="p-4 lg:p-6 space-y-5">
        <Breadcrumb crumbs={[{ label: 'Analytics' }]} />
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-display font-bold text-xl text-gray-900">Performance Overview</h2>
            <p className="text-gray-400 text-sm">April 2026 — Real-time data</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5 bg-white rounded-xl p-1" style={{ border: '1px solid #e8ecf8' }}>
              {PERIODS.map((p) => (
                <button key={p} onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    period === p ? 'grad-bg text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl text-gray-600 hover:text-gray-800 text-xs font-semibold transition-all"
              style={{ border: '1px solid #e8ecf8' }}>
              <Download size={13} /> Export
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {kpis.map((kpi, i) => (
            <motion.div key={kpi.label} {...fadeUp} transition={{ delay: i * 0.07 }}
              className="bg-white rounded-2xl p-4 lg:p-5 relative overflow-hidden card-hover"
              style={cardStyle}
            >
              <div className="absolute top-0 right-0 w-20 h-20 rounded-full -translate-y-6 translate-x-6 opacity-50 pointer-events-none"
                style={{ background: `radial-gradient(circle, ${kpi.soft}, transparent)` }} />
              <div className="relative z-10">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: kpi.soft }}>
                  <kpi.icon size={16} style={{ color: kpi.accent }} />
                </div>
                <p className="font-display font-bold text-2xl text-gray-900">{kpi.value}</p>
                <p className="text-gray-500 text-xs mt-0.5 font-medium">{kpi.label}</p>
                <span className={`mt-2 inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  kpi.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                }`}>
                  {kpi.up ? <TrendingUp size={9} /> : <TrendingDown size={9} />} {kpi.change}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Admissions vs Discharges */}
          <motion.div {...fadeUp} transition={{ delay: 0.28 }} className="lg:col-span-2 bg-white rounded-3xl p-5 lg:p-6" style={cardStyle}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-gray-900 text-base">Admissions vs Discharges</h3>
                <p className="text-gray-400 text-xs">Monthly comparison</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-gray-500">
                  <span style={{ display: 'inline-block', width: 12, height: 3, borderRadius: 2, background: '#6c47ff', flexShrink: 0 }} />
                  Admissions
                </span>
                <span className="flex items-center gap-1.5 text-gray-500">
                  <span style={{ display: 'inline-block', width: 12, height: 3, borderRadius: 2, background: '#06b6d4', flexShrink: 0 }} />
                  Discharges
                </span>
              </div>
            </div>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly}>
                  <defs>
                    <linearGradient id="aG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6c47ff" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#6c47ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="dG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.12} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f3ff" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                  <Tooltip content={<ChartTip />} />
                  <Area type="monotone" dataKey="admissions" stroke="#6c47ff" strokeWidth={2.5} fill="url(#aG)" dot={false} activeDot={{ r: 5, fill: '#6c47ff', stroke: '#fff', strokeWidth: 2 }} />
                  <Area type="monotone" dataKey="discharges"  stroke="#06b6d4" strokeWidth={2.5} fill="url(#dG)" dot={false} activeDot={{ r: 5, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Dept pie */}
          <motion.div {...fadeUp} transition={{ delay: 0.33 }} className="bg-white rounded-3xl p-5 lg:p-6" style={cardStyle}>
            <h3 className="font-semibold text-gray-900 text-base mb-1">By Department</h3>
            <p className="text-gray-400 text-xs mb-4">Current patient distribution</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={deptData} cx="50%" cy="50%" innerRadius={42} outerRadius={66} paddingAngle={3} dataKey="value">
                    {deptData.map((e, i) => <Cell key={i} fill={e.color} stroke="white" strokeWidth={2} />)}
                  </Pie>
                  <Tooltip content={<ChartTip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1.5 mt-1">
              {deptData.slice(0, 4).map((d) => (
                <div key={d.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-gray-500">{d.name}</span>
                  </div>
                  <span className="text-gray-800 font-semibold">{d.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Charts row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Age dist */}
          <motion.div {...fadeUp} transition={{ delay: 0.38 }} className="bg-white rounded-3xl p-5 lg:p-6" style={cardStyle}>
            <h3 className="font-semibold text-gray-900 text-base mb-1">Age Distribution</h3>
            <p className="text-gray-400 text-xs mb-4">Patient demographics</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData} barSize={14}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f3ff" vertical={false} />
                  <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {ageData.map((_, i) => <Cell key={i} fill={`hsl(${250 + i * 18}, 75%, 62%)`} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Outcomes */}
          <motion.div {...fadeUp} transition={{ delay: 0.43 }} className="bg-white rounded-3xl p-5 lg:p-6" style={cardStyle}>
            <h3 className="font-semibold text-gray-900 text-base mb-1">Patient Outcomes</h3>
            <p className="text-gray-400 text-xs mb-4">Monthly recovery breakdown (%)</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={outcomeData} barSize={9} barGap={2}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f3ff" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                  <Tooltip content={<ChartTip />} />
                  <Bar dataKey="recovered" stackId="a" fill="#10b981" />
                  <Bar dataKey="stable"    stackId="a" fill="#6c47ff" />
                  <Bar dataKey="critical"  stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Radar */}
          <motion.div {...fadeUp} transition={{ delay: 0.48 }} className="bg-white rounded-3xl p-5 lg:p-6" style={cardStyle}>
            <h3 className="font-semibold text-gray-900 text-base mb-1">Hospital Performance</h3>
            <p className="text-gray-400 text-xs mb-4">Key metrics score (0–100)</p>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e8ecf8" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: '#9ca3af', fontSize: 9 }} />
                  <Radar name="Score" dataKey="A" stroke="#6c47ff" fill="#6c47ff" fillOpacity={0.15} strokeWidth={2}
                    dot={{ r: 3, fill: '#6c47ff', stroke: '#ffffff', strokeWidth: 1.5 }} />
                  <Tooltip content={<ChartTip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Revenue */}
        <motion.div {...fadeUp} transition={{ delay: 0.52 }} className="bg-white rounded-3xl p-5 lg:p-6" style={cardStyle}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold text-gray-900 text-base">Revenue Trend</h3>
              <p className="text-gray-400 text-xs">Monthly billing in thousands ($)</p>
            </div>
            <span className="text-[11px] font-bold px-3 py-1 rounded-full" style={{ background: '#dcfce7', color: '#16a34a' }}>
              +18.5% YoY
            </span>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f3ff" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <Tooltip content={<ChartTip />} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2.5}
                  dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#ffffff' }}
                  activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
