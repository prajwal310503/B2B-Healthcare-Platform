export interface Patient {
  id: string
  name: string
  age: number
  gender: 'Male' | 'Female' | 'Other'
  condition: string
  status: 'Active' | 'Inactive' | 'Pending'
  doctor: string
  lastVisit: string
  nextAppointment: string
  bloodType: string
  phone: string
  email: string
  avatar: string
  riskLevel: 'Low' | 'Medium' | 'High'
  department: string
  insurance: string
  admissionDate: string
  roomNumber?: string
  vitals: {
    heartRate: number
    bloodPressure: string
    temperature: number
    oxygenSat: number
  }
}

export interface User {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
}

export interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  timestamp: Date
  read: boolean
}

export interface AnalyticsData {
  label: string
  value: number
  change: number
}

export type ViewMode = 'grid' | 'list'
