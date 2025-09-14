import type React from "react"
// Core TypeScript interfaces for the healthcare management system
export interface User {
  id: string
  name: string
  email: string
  role: "biller" | "practice-admin" | "provider" | "staff" | "patient"
  practiceId: string
  avatar?: string
}

export interface Practice {
  id: string
  name: string
  address: string
  phone: string
  npi: string
}

export interface Patient {
  id: string
  name: string
  dateOfBirth: string
  phone: string
  email: string
  address: string
  insurance: string
  practiceId: string
  isRestricted?: boolean
  medicalHistory: string[]
  medications: string[]
  allergies: string[]
}

export interface Claim {
  id: string
  patientId: string
  patientName: string
  serviceDate: string
  amount: number
  status: "pending" | "approved" | "denied" | "paid"
  cpt: string
  diagnosis: string
  practiceId: string
  payer: string
}

export interface Appointment {
  id: string
  patientId: string
  patientName: string
  providerId: string
  providerName: string
  date: string
  time: string
  type: string
  status: "scheduled" | "checked-in" | "in-progress" | "completed" | "cancelled"
  practiceId: string
}

export interface Staff {
  id: string
  name: string
  role: string
  department: string
  email: string
  phone: string
  practiceId: string
  status: "active" | "inactive"
}

export interface Room {
  id: string
  name: string
  status: "available" | "occupied" | "cleaning" | "maintenance"
  patientName?: string
  providerName?: string
  appointmentType?: string
  duration?: number
}

export interface Announcement {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "success" | "error"
  createdAt: string
  expiresAt?: string
  isActive: boolean
}

export interface AppState {
  user: User | null
  currentPractice: Practice | null
  patients: Patient[]
  claims: Claim[]
  appointments: Appointment[]
  staff: Staff[]
  rooms: Room[]
  announcements: Announcement[]
  isModalOpen: boolean
  modalContent: React.ReactNode | null
  isIdleModalOpen: boolean
  userPermissions: string[]
}
