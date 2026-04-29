import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import {
  Grid3x3, List, Search, Filter, X, ChevronRight, ChevronLeft,
  Heart, Activity, Thermometer, Droplets, Phone, Mail,
  Calendar, MapPin, Shield, User, Clock,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Breadcrumb from '../components/Breadcrumb'
import { useStore } from '../store/useStore'
import type { Patient } from '../types'

const PAGE_SIZE_OPTIONS = [6, 9, 12]

const riskStyle = {
  Low:    { badge: 'bg-green-50 text-green-600 border border-green-200',   dot: '#10b981', bar: '#10b981' },
  Medium: { badge: 'bg-orange-50 text-orange-500 border border-orange-200', dot: '#f97316', bar: '#f97316' },
  High:   { badge: 'bg-red-50 text-red-500 border border-red-200',         dot: '#f43f5e', bar: '#f43f5e' },
}

const statusStyle = {
  Active:   'status-active',
  Inactive: 'status-inactive',
  Pending:  'status-pending',
}

const avatarGrads = [
  'from-[#6c47ff] to-[#06b6d4]',
  'from-[#f43f5e] to-[#6c47ff]',
  'from-[#10b981] to-[#06b6d4]',
  'from-[#f97316] to-[#f43f5e]',
  'from-[#06b6d4] to-[#6c47ff]',
]

const cardStyle = { background: '#ffffff', border: '1px solid #e8ecf8', boxShadow: '0 1px 4px rgba(15,21,53,0.05)' }

function PatientCard({ patient, index, onClick }: { patient: Patient; index: number; onClick: () => void }) {
  const risk = riskStyle[patient.riskLevel]
  const grad = avatarGrads[index % avatarGrads.length]

  return (
    <motion.div layout
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.22, delay: index * 0.025 }}
      whileHover={{ y: -3 }} onClick={onClick}
      className="bg-white rounded-2xl p-5 cursor-pointer group transition-all hover:shadow-lg relative overflow-hidden"
      style={{ border: '1px solid #e8ecf8', boxShadow: '0 1px 4px rgba(15,21,53,0.05)' }}
    >
      {/* Risk stripe */}
      <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: risk.bar }} />

      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
          {patient.avatar}
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${statusStyle[patient.status]}`}>
            {patient.status}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${risk.badge}`}>
            {patient.riskLevel} Risk
          </span>
        </div>
      </div>

      <h3 className="font-semibold text-gray-800 text-[15px] group-hover:text-[#6c47ff] transition-colors truncate">
        {patient.name}
      </h3>
      <p className="text-gray-400 text-xs mt-0.5 truncate">{patient.condition}</p>

      <div className="grid grid-cols-2 gap-2 mt-4">
        {[
          { label: 'Age', value: `${patient.age}y` },
          { label: 'Blood', value: patient.bloodType },
        ].map((item) => (
          <div key={item.label} className="rounded-xl p-2.5" style={{ background: '#f8faff', border: '1px solid #e8ecf8' }}>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider">{item.label}</p>
            <p className="text-gray-800 text-sm font-bold mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Vitals strip */}
      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Heart size={11} className="text-[#f43f5e]" />
          <span className="text-[11px] text-gray-500 font-medium">{patient.vitals.heartRate}</span>
        </div>
        <div className="flex items-center gap-1">
          <Activity size={11} className="text-[#06b6d4]" />
          <span className="text-[11px] text-gray-500 font-medium">{patient.vitals.oxygenSat}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Thermometer size={11} className="text-[#10b981]" />
          <span className="text-[11px] text-gray-500 font-medium">{patient.vitals.temperature}°</span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full grad-bg flex items-center justify-center text-white text-[8px] font-bold">
            {patient.doctor.split(' ').pop()?.slice(0, 1) ?? 'D'}
          </div>
          <span className="text-gray-400 text-[11px] truncate max-w-[100px]">{patient.doctor}</span>
        </div>
        <ChevronRight size={14} className="text-gray-300 group-hover:text-[#6c47ff] transition-colors" />
      </div>
    </motion.div>
  )
}

function PatientTableRow({ patient, index, onClick }: { patient: Patient; index: number; onClick: () => void }) {
  const risk = riskStyle[patient.riskLevel]
  const grad = avatarGrads[index % avatarGrads.length]

  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: index * 0.025 }}
      onClick={onClick}
      className="group cursor-pointer transition-colors"
      style={{ borderBottom: '1px solid #f0f3ff' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#f8faff' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      {/* Patient */}
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm`}>
            {patient.avatar}
          </div>
          <div className="min-w-0">
            <p className="text-gray-800 text-sm font-semibold truncate group-hover:text-[#6c47ff] transition-colors">{patient.name}</p>
            <p className="text-gray-400 text-xs truncate max-w-[140px]">{patient.condition}</p>
          </div>
        </div>
      </td>

      {/* Department */}
      <td className="px-4 py-3.5">
        <p className="text-gray-700 text-xs font-semibold">{patient.department}</p>
        <p className="text-gray-400 text-[11px] mt-0.5">{patient.doctor}</p>
      </td>

      {/* Vitals */}
      <td className="px-4 py-3.5">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5">
            <Heart size={10} className="text-[#f43f5e] flex-shrink-0" />
            <span className="text-gray-600 text-xs font-medium">{patient.vitals.heartRate} bpm</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity size={10} className="text-[#06b6d4] flex-shrink-0" />
            <span className="text-gray-600 text-xs font-medium">{patient.vitals.oxygenSat}% O₂</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Thermometer size={10} className="text-[#10b981] flex-shrink-0" />
            <span className="text-gray-600 text-xs font-medium">{patient.vitals.temperature}°F</span>
          </div>
        </div>
      </td>

      {/* Last Visit */}
      <td className="px-4 py-3.5">
        <p className="text-gray-700 text-xs font-semibold">{patient.lastVisit}</p>
        <p className="text-gray-400 text-[11px] mt-0.5">Last visit</p>
      </td>

      {/* Next Appt */}
      <td className="px-4 py-3.5">
        <p className="text-gray-700 text-xs font-semibold">{patient.nextAppointment}</p>
        <p className="text-gray-400 text-[11px] mt-0.5">Next appt.</p>
      </td>

      {/* Status + Risk */}
      <td className="px-4 py-3.5">
        <div className="flex flex-col gap-1.5">
          <span className={`inline-flex items-center justify-center text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide w-fit ${statusStyle[patient.status]}`}>
            {patient.status}
          </span>
          <span className={`inline-flex items-center justify-center text-[10px] font-semibold px-2.5 py-0.5 rounded-full w-fit ${risk.badge}`}>
            <span className="w-1.5 h-1.5 rounded-full mr-1" style={{ background: risk.dot }} />
            {patient.riskLevel} Risk
          </span>
        </div>
      </td>

      {/* Blood type */}
      <td className="px-4 py-3.5">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-xs font-bold"
          style={{ background: '#ede9fe', color: '#6c47ff', border: '1.5px solid #c4b5fd' }}>
          {patient.bloodType}
        </span>
      </td>

      {/* Action */}
      <td className="px-3 py-3.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-all group-hover:bg-[#ede9fe]">
          <ChevronRight size={14} className="text-gray-300 group-hover:text-[#6c47ff] transition-colors" />
        </div>
      </td>
    </motion.tr>
  )
}

function PatientModal({ patient, onClose }: { patient: Patient; onClose: () => void }) {
  const grad = avatarGrads[0]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,21,53,0.45)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 16 }} transition={{ type: 'spring', stiffness: 380, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        style={{ border: '1px solid #e8ecf8' }}
      >
        {/* Header */}
        <div className="p-6 flex items-start justify-between" style={{ borderBottom: '1px solid #f0f3ff' }}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
              {patient.avatar}
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-gray-900">{patient.name}</h2>
              <p className="text-gray-500 text-sm">{patient.condition}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${statusStyle[patient.status]}`}>{patient.status}</span>
                <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${riskStyle[patient.riskLevel].badge}`}>{patient.riskLevel} Risk</span>
              </div>
            </div>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Vitals */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Current Vitals</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Heart,       label: 'Heart Rate',   value: `${patient.vitals.heartRate} bpm`, color: '#f43f5e', soft: '#fce7f3' },
                { icon: Activity,    label: 'Blood Press.',  value: patient.vitals.bloodPressure,      color: '#6c47ff', soft: '#ede9fe' },
                { icon: Thermometer, label: 'Temperature',  value: `${patient.vitals.temperature}°F`, color: '#f97316', soft: '#fff7ed' },
                { icon: Droplets,    label: 'O₂ Saturation',value: `${patient.vitals.oxygenSat}%`,    color: '#06b6d4', soft: '#e0f2fe' },
              ].map((v) => (
                <div key={v.label} className="rounded-2xl p-3.5 text-center"
                  style={{ background: v.soft, border: `1.5px solid ${v.color}22` }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-2"
                    style={{ background: 'white', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <v.icon size={16} style={{ color: v.color }} />
                  </div>
                  <p className="text-gray-900 font-bold text-sm">{v.value}</p>
                  <p className="text-gray-500 text-[11px] mt-0.5">{v.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Info grid */}
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3">Patient Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { icon: User,     label: 'Age / Gender',    value: `${patient.age} years, ${patient.gender}` },
                { icon: Droplets, label: 'Blood Type',       value: patient.bloodType },
                { icon: Phone,    label: 'Phone',            value: patient.phone },
                { icon: Mail,     label: 'Email',            value: patient.email },
                { icon: Calendar, label: 'Last Visit',       value: patient.lastVisit },
                { icon: Clock,    label: 'Next Appointment', value: patient.nextAppointment },
                { icon: Shield,   label: 'Insurance',        value: patient.insurance },
                { icon: MapPin,   label: 'Department',       value: patient.department },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: '#f8faff', border: '1px solid #e8ecf8' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: '#ede9fe' }}>
                    <item.icon size={13} className="text-[#6c47ff]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-400 text-[10px] uppercase tracking-wider font-semibold">{item.label}</p>
                    <p className="text-gray-700 text-xs font-semibold truncate">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Doctor */}
          <div className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #ede9fe, #e0f2fe)', border: '1.5px solid #c4b5fd' }}>
            <div className="w-11 h-11 rounded-xl grad-bg flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {patient.doctor.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="text-gray-900 text-sm font-bold">{patient.doctor}</p>
              <p className="text-[#6c47ff] text-xs font-medium">{patient.department} Specialist</p>
            </div>
            {patient.roomNumber && (
              <div className="ml-auto text-right">
                <p className="text-gray-900 text-sm font-bold">Room {patient.roomNumber}</p>
                <p className="text-gray-500 text-xs">Current room</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function PatientDetails() {
  const { patients, viewMode, setViewMode, searchQuery, setSearchQuery } = useStore()
  const [selected, setSelected] = useState<Patient | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [filterRisk, setFilterRisk] = useState<string>('All')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(9)

  const filtered = useMemo(() => {
    return patients.filter((p) => {
      const q = searchQuery.toLowerCase()
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.condition.toLowerCase().includes(q)
        || p.doctor.toLowerCase().includes(q) || p.department.toLowerCase().includes(q)
      const matchS = filterStatus === 'All' || p.status === filterStatus
      const matchR = filterRisk === 'All' || p.riskLevel === filterRisk
      return matchQ && matchS && matchR
    })
  }, [patients, searchQuery, filterStatus, filterRisk])

  // Reset to page 1 when filters change
  useEffect(() => { setCurrentPage(1) }, [searchQuery, filterStatus, filterRisk, pageSize])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = Math.min(startIndex + pageSize, filtered.length)
  const paginated = filtered.slice(startIndex, endIndex)

  const filterActive = filterStatus !== 'All' || filterRisk !== 'All'

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages]
    if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  }

  return (
    <div className="min-h-full bg-[#f0f3ff]">
      <Navbar title="Patients" subtitle={`${patients.length} total patients`} />

      <div className="p-4 lg:p-6 space-y-4">
        <Breadcrumb crumbs={[{ label: 'Patients' }]} />
        {/* Controls bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, condition, doctor..."
              className="input-ring w-full bg-white border border-gray-200 text-gray-800 placeholder-gray-400 rounded-xl pl-10 pr-4 py-2.5 text-sm shadow-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                showFilters || filterActive
                  ? 'bg-[#ede9fe] border-[#c4b5fd] text-[#6c47ff]'
                  : 'bg-white border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Filter size={14} />
              Filters
              {filterActive && (
                <span className="w-4 h-4 rounded-full grad-bg text-white text-[9px] flex items-center justify-center font-bold">
                  {(filterStatus !== 'All' ? 1 : 0) + (filterRisk !== 'All' ? 1 : 0)}
                </span>
              )}
            </button>

            {/* View toggle */}
            <div className="flex bg-white rounded-xl p-1 gap-1" style={{ border: '1px solid #e2e8f0' }}>
              {([
                { mode: 'grid', Icon: Grid3x3 },
                { mode: 'list', Icon: List },
              ] as const).map(({ mode, Icon }) => (
                <motion.button key={mode} whileTap={{ scale: 0.88 }}
                  onClick={() => setViewMode(mode)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    viewMode === mode ? 'grad-bg text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'
                  }`}
                  title={`${mode} view`}
                >
                  <Icon size={16} />
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} className="overflow-hidden"
            >
              <div className="bg-white rounded-2xl p-4 flex flex-wrap gap-5"
                style={{ border: '1px solid #e8ecf8' }}>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Status</p>
                  <div className="flex gap-1.5">
                    {['All', 'Active', 'Inactive', 'Pending'].map((s) => (
                      <button key={s} onClick={() => setFilterStatus(s)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          filterStatus === s
                            ? 'bg-[#ede9fe] border-[#c4b5fd] text-[#6c47ff]'
                            : 'border-gray-200 text-gray-500 hover:text-gray-700 bg-white'
                        }`}
                      >{s}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Risk Level</p>
                  <div className="flex gap-1.5">
                    {['All', 'Low', 'Medium', 'High'].map((r) => (
                      <button key={r} onClick={() => setFilterRisk(r)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                          filterRisk === r
                            ? 'bg-[#ede9fe] border-[#c4b5fd] text-[#6c47ff]'
                            : 'border-gray-200 text-gray-500 hover:text-gray-700 bg-white'
                        }`}
                      >{r}</button>
                    ))}
                  </div>
                </div>
                {filterActive && (
                  <button onClick={() => { setFilterStatus('All'); setFilterRisk('All') }}
                    className="self-end text-xs text-[#f43f5e] hover:underline font-semibold">
                    Clear filters
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats strip */}
        <div className="flex gap-2 flex-wrap">
          {[
            { label: 'Total',    count: filtered.length,                                   color: '#6c47ff', soft: '#ede9fe' },
            { label: 'Active',   count: filtered.filter((p) => p.status === 'Active').length,  color: '#10b981', soft: '#dcfce7' },
            { label: 'High Risk',count: filtered.filter((p) => p.riskLevel === 'High').length, color: '#f43f5e', soft: '#fce7f3' },
            { label: 'Pending',  count: filtered.filter((p) => p.status === 'Pending').length, color: '#f97316', soft: '#fff7ed' },
          ].map((s) => (
            <div key={s.label} className="px-3 py-1.5 rounded-xl flex items-center gap-2 text-xs font-semibold"
              style={{ background: s.soft, color: s.color, border: `1px solid ${s.color}22` }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: s.color }} />
              {s.label}: {s.count}
            </div>
          ))}
        </div>

        {/* Patient grid / list */}
        <LayoutGroup>
          <AnimatePresence mode="wait">
            {viewMode === 'grid' ? (
              <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.map((p, i) => (
                  <PatientCard key={p.id} patient={p} index={i} onClick={() => setSelected(p)} />
                ))}
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: '1px solid #e8ecf8', boxShadow: '0 2px 12px rgba(108,71,255,0.05)' }}
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[820px]" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ background: 'linear-gradient(90deg, #f8faff, #f0f3ff)', borderBottom: '2px solid #e8ecf8' }}>
                        {['Patient', 'Department', 'Vitals', 'Last Visit', 'Next Appt.', 'Status', 'Blood', ''].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {paginated.map((p, i) => (
                        <PatientTableRow key={p.id} patient={p} index={i} onClick={() => setSelected(p)} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>

        {/* Empty state */}
        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-4 shadow-sm"
              style={{ border: '1px solid #e8ecf8' }}>
              <User size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-700 font-semibold text-lg">No patients found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
            <button onClick={() => { setSearchQuery(''); setFilterStatus('All'); setFilterRisk('All') }}
              className="mt-4 px-5 py-2.5 grad-bg rounded-xl text-white text-sm font-bold shadow-sm glow-purple">
              Clear all
            </button>
          </motion.div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">

            {/* Showing X–Y of Z + page size */}
            <div className="flex items-center gap-3 text-sm">
              <span className="text-gray-500">
                Showing <span className="font-semibold text-gray-800">{startIndex + 1}–{endIndex}</span> of{' '}
                <span className="font-semibold text-gray-800">{filtered.length}</span> patients
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 text-xs">Per page:</span>
                <div className="flex bg-white rounded-lg p-0.5 gap-0.5" style={{ border: '1px solid #e2e8f0' }}>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <button key={size} onClick={() => setPageSize(size)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all ${
                        pageSize === size
                          ? 'grad-bg text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >{size}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Page numbers */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#6c47ff] hover:bg-[#ede9fe] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ border: '1px solid #e2e8f0', background: '#fff' }}
                >
                  <ChevronLeft size={14} />
                </button>

                {getPageNumbers().map((page, i) =>
                  page === '...' ? (
                    <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">…</span>
                  ) : (
                    <button key={page} onClick={() => setCurrentPage(page as number)}
                      className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                        currentPage === page
                          ? 'grad-bg text-white shadow-sm'
                          : 'text-gray-600 hover:text-[#6c47ff] hover:bg-[#ede9fe]'
                      }`}
                      style={currentPage !== page ? { border: '1px solid #e2e8f0', background: '#fff' } : {}}
                    >{page}</button>
                  )
                )}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-[#6c47ff] hover:bg-[#ede9fe] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ border: '1px solid #e2e8f0', background: '#fff' }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selected && <PatientModal patient={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
