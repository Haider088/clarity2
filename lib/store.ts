import type React from "react"
import { create } from "zustand"
import { definitiveSampleData } from "./data"

interface AppState {
  // Static data
  practices: any[]
  providers: any[]
  users: any[]
  patients: any[]
  appointments: any[]
  claims: any[]
  denials: any[]
  referrals: any[]
  uncoded_encounters: any[]
  onboarding_practices: any[]
  payments: any[]
  encounters: any[]
  orders: any[]
  tasks: any[]

  // Dynamic state
  currentPortal: string
  currentPracticeId: string
  activeView: string
  currentUserId: string

  // UI state
  isModalOpen: boolean
  modalContent: { title: string; body: React.ReactNode | null }
  toastMessage: string
  isIdleModalOpen: boolean
  userPermissions: string[]
  announcements: Array<{
    id: string
    title: string
    message: string
    type: "info" | "warning" | "success" | "error"
    isActive: boolean
    createdAt: string
    expiresAt?: string
  }>
  dismissedAnnouncements: string[]

  // Actions
  setCurrentPortal: (portal: string) => void
  setCurrentPracticeId: (practiceId: string) => void
  setActiveView: (view: string) => void
  openModal: (title: string, body: React.ReactNode) => void
  closeModal: () => void
  showToast: (message: string) => void
  clearToast: () => void
  openIdleModal: () => void
  closeIdleModal: () => void
  resetIdleTimer: () => void
  initializeData: () => void
  addClaim: (claim: any) => void
  addAnnouncement: (announcement: Omit<AppState["announcements"][0], "id" | "createdAt">) => void
  dismissAnnouncement: (id: string) => void
  toggleAnnouncementStatus: (id: string) => void
  updateAppointmentStatus: (id: string, status: string) => void
  addAppointment: (appointment: any) => void
  updateAppointment: (id: string, updates: any) => void
  addPatient: (patient: any) => void
  updateClaimStatus: (id: string, status: string) => void
  addPayment: (payment: any) => void
  addEncounter: (encounter: any) => void
  addOrder: (order: any) => void
  addLabOrder: (order: any) => void
  addReferral: (referral: any) => void
  addTask: (task: any) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  practices: definitiveSampleData.practices,
  providers: definitiveSampleData.providers,
  users: definitiveSampleData.users,
  patients: definitiveSampleData.patients,
  appointments: definitiveSampleData.appointments,
  claims: definitiveSampleData.claims,
  denials: definitiveSampleData.denials,
  referrals: definitiveSampleData.referrals,
  uncoded_encounters: definitiveSampleData.uncoded_encounters,
  onboarding_practices: definitiveSampleData.onboarding_practices,
  payments: [],
  encounters: [],
  orders: [],
  tasks: [],

  // Initial dynamic state
  currentPortal: "biller",
  currentPracticeId: "practice-1",
  activeView: "dashboard",
  currentUserId: "user-1",

  // Initial UI state
  isModalOpen: false,
  modalContent: { title: "", body: null },
  toastMessage: "",
  isIdleModalOpen: false,
  userPermissions: ["claims:read", "schedule:read", "users:create", "users:edit", "reports:view", "billing:manage"],
  announcements: [
    {
      id: "ann-1",
      title: "System Maintenance Scheduled",
      message: "Planned maintenance window on Sunday 2AM-4AM EST. Some features may be temporarily unavailable.",
      type: "warning",
      isActive: true,
      createdAt: "2024-01-25T10:00:00Z",
      expiresAt: "2024-01-28T23:59:59Z",
    },
    {
      id: "ann-2",
      title: "New AI Features Available",
      message: "Enhanced AI claim scrubbing and pattern analysis features are now live across all portals.",
      type: "success",
      isActive: true,
      createdAt: "2024-01-24T14:30:00Z",
    },
  ],
  dismissedAnnouncements: [],

  // Actions
  setCurrentPortal: (portal) => set({ currentPortal: portal }),
  setCurrentPracticeId: (practiceId) => set({ currentPracticeId: practiceId }),
  setActiveView: (view) => set({ activeView: view }),
  openModal: (title, body) => set({ isModalOpen: true, modalContent: { title, body } }),
  closeModal: () => set({ isModalOpen: false, modalContent: { title: "", body: null } }),
  showToast: (message) => set({ toastMessage: message }),
  clearToast: () => set({ toastMessage: "" }),
  openIdleModal: () => set({ isIdleModalOpen: true }),
  closeIdleModal: () => set({ isIdleModalOpen: false }),
  resetIdleTimer: () => {}, // This will be handled by the hook
  initializeData: () =>
    set({
      practices: definitiveSampleData.practices,
      providers: definitiveSampleData.providers,
      users: definitiveSampleData.users,
      patients: definitiveSampleData.patients,
      appointments: definitiveSampleData.appointments,
      claims: definitiveSampleData.claims,
      denials: definitiveSampleData.denials,
      referrals: definitiveSampleData.referrals,
      uncoded_encounters: definitiveSampleData.uncoded_encounters,
      onboarding_practices: definitiveSampleData.onboarding_practices,
    }),
  addClaim: (claim) =>
    set((state) => ({
      claims: [...state.claims, claim],
    })),
  addAnnouncement: (announcement) =>
    set((state) => ({
      announcements: [
        ...state.announcements,
        {
          ...announcement,
          id: `ann-${Date.now()}`,
          createdAt: new Date().toISOString(),
        },
      ],
    })),
  dismissAnnouncement: (id) =>
    set((state) => ({
      dismissedAnnouncements: [...state.dismissedAnnouncements, id],
    })),
  toggleAnnouncementStatus: (id) =>
    set((state) => ({
      announcements: state.announcements.map((ann) => (ann.id === id ? { ...ann, isActive: !ann.isActive } : ann)),
    })),
  updateAppointmentStatus: (id, status) =>
    set((state) => ({
      appointments: state.appointments.map((apt) => (apt.id === id ? { ...apt, status } : apt)),
    })),
  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [...state.appointments, appointment],
    })),
  updateAppointment: (id, updates) =>
    set((state) => ({
      appointments: state.appointments.map((apt) => (apt.id === id ? { ...apt, ...updates } : apt)),
    })),
  addPatient: (patient) =>
    set((state) => ({
      patients: [...state.patients, patient],
    })),
  updateClaimStatus: (id, status) =>
    set((state) => ({
      claims: state.claims.map((claim) => (claim.id === id ? { ...claim, status } : claim)),
    })),
  addPayment: (payment) =>
    set((state) => ({
      payments: [...state.payments, payment],
    })),
  addEncounter: (encounter) =>
    set((state) => ({
      encounters: [...state.encounters, encounter],
    })),
  addOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
    })),
  addLabOrder: (order) =>
    set((state) => ({
      orders: [...state.orders, order],
    })),
  addReferral: (referral) =>
    set((state) => ({
      referrals: [...state.referrals, referral],
    })),
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
}))