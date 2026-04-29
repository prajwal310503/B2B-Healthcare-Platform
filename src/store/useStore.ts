import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Notification, ViewMode, Patient } from '../types'
import { mockPatients } from '../data/mockPatients'

interface AppState {
  user: User | null
  isAuthenticated: boolean
  viewMode: ViewMode
  patients: Patient[]
  selectedPatient: Patient | null
  notifications: Notification[]
  unreadCount: number
  sidebarOpen: boolean
  searchQuery: string

  setUser: (user: User | null) => void
  setAuthenticated: (val: boolean) => void
  setViewMode: (mode: ViewMode) => void
  setSelectedPatient: (p: Patient | null) => void
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAllRead: () => void
  markRead: (id: string) => void
  toggleSidebar: () => void
  setSidebarOpen: (val: boolean) => void
  setSearchQuery: (q: string) => void
  logout: () => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      viewMode: 'grid',
      patients: mockPatients,
      selectedPatient: null,
      notifications: [
        {
          id: 'n1',
          title: 'Critical Alert',
          message: 'Patient Suresh Patel — O2 saturation dropped to 91%',
          type: 'error',
          timestamp: new Date(),
          read: false,
        },
        {
          id: 'n2',
          title: 'Lab Results Ready',
          message: 'Rajesh Kumar cardiac panel results available',
          type: 'info',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          read: false,
        },
        {
          id: 'n3',
          title: 'Appointment Reminder',
          message: 'Deepika Iyer has an appointment in 30 minutes',
          type: 'warning',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          read: false,
        },
        {
          id: 'n4',
          title: 'New Patient Admitted',
          message: 'Priya Sharma has been admitted to Endocrinology',
          type: 'success',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          read: true,
        },
      ],
      unreadCount: 3,
      sidebarOpen: true,
      searchQuery: '',

      setUser: (user) => set({ user }),
      setAuthenticated: (val) => set({ isAuthenticated: val }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setSelectedPatient: (p) => set({ selectedPatient: p }),

      addNotification: (n) =>
        set((s) => {
          const newN: Notification = {
            ...n,
            id: `n${Date.now()}`,
            timestamp: new Date(),
            read: false,
          }
          return {
            notifications: [newN, ...s.notifications],
            unreadCount: s.unreadCount + 1,
          }
        }),

      markAllRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      markRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, s.unreadCount - 1),
        })),

      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (val) => set({ sidebarOpen: val }),
      setSearchQuery: (q) => set({ searchQuery: q }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          selectedPatient: null,
          searchQuery: '',
        }),
    }),
    {
      name: 'medisync-store',
      partialize: (s) => ({
        user: s.user,
        isAuthenticated: s.isAuthenticated,
        viewMode: s.viewMode,
      }),
    }
  )
)
