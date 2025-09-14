"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

// Types for our healthcare system
interface Patient {
  id: string
  name: string
  email: string
  phone: string
  dateOfBirth: string
  practiceId: string
  status: string
  lastVisit: string
  problemList: string[]
  medications: string[]
  allergies: string[]
  isRestricted?: boolean
}

interface Appointment {
  id: string
  patientName: string
  date: string
  time: string
  type: string
  status: string
  practiceId: string
}

interface Claim {
  id: string
  patientName: string
  amount: number
  status: string
  practiceId: string
  date: string
  serviceCode: string
}

interface Denial {
  id: string
  claimId: string
  reason: string
  practiceId: string
  date: string
  amount: number
}

interface UncodedEncounter {
  id: string
  patientName: string
  date: string
  practiceId: string
  provider: string
}

interface HealthcareContextType {
  // Data
  patients: Patient[]
  appointments: Appointment[]
  claims: Claim[]
  denials: Denial[]
  uncoded_encounters: UncodedEncounter[]

  // UI State
  currentPracticeId: string
  setCurrentPracticeId: (id: string) => void
  currentPortal: string
  setCurrentPortal: (portal: string) => void
  activeView: string
  setActiveView: (view: string) => void
  isModalOpen: boolean
  modalContent: ReactNode
  modalTitle: string

  // Modal functions
  openModal: (title: string, content: ReactNode) => void
  closeModal: () => void

  // User permissions
  userPermissions: string[]

  // Idle modal state
  isIdleModalOpen: boolean
  openIdleModal: () => void
  closeIdleModal: () => void

  // Announcements
  announcements: Array<{
    id: string
    title: string
    message: string
    type: "info" | "warning" | "success" | "error"
    expiresAt: string
  }>
  dismissedAnnouncements: string[]
  dismissAnnouncement: (id: string) => void
}

const HealthcareContext = createContext<HealthcareContextType | undefined>(undefined)

// Sample data
const samplePatients: Patient[] = [
  {
    id: "1",
    name: "Maria Garcia",
    email: "maria.garcia@email.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-03-15",
    practiceId: "practice1",
    status: "Active",
    lastVisit: "2024-01-15",
    problemList: ["Hypertension", "Type 2 Diabetes"],
    medications: ["Metformin 500mg", "Lisinopril 10mg"],
    allergies: ["Penicillin"],
    isRestricted: true,
  },
  {
    id: "2",
    name: "John Smith",
    email: "john.smith@email.com",
    phone: "(555) 987-6543",
    dateOfBirth: "1978-07-22",
    practiceId: "practice1",
    status: "Active",
    lastVisit: "2024-01-10",
    problemList: ["Asthma", "Seasonal Allergies"],
    medications: ["Albuterol Inhaler", "Claritin 10mg"],
    allergies: ["Shellfish"],
  },
  {
    id: "3",
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(555) 456-7890",
    dateOfBirth: "1992-11-08",
    practiceId: "practice2",
    status: "Active",
    lastVisit: "2024-01-12",
    problemList: ["Anxiety", "Migraine"],
    medications: ["Sertraline 50mg", "Sumatriptan 50mg"],
    allergies: ["None known"],
  },
  {
    id: "4",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "(555) 321-0987",
    dateOfBirth: "1965-05-30",
    practiceId: "practice1",
    status: "Active",
    lastVisit: "2024-01-08",
    problemList: ["Coronary Artery Disease", "High Cholesterol"],
    medications: ["Atorvastatin 20mg", "Aspirin 81mg"],
    allergies: ["Sulfa drugs"],
  },
  {
    id: "5",
    name: "Emily Davis",
    email: "emily.davis@email.com",
    phone: "(555) 654-3210",
    dateOfBirth: "1988-09-12",
    practiceId: "practice2",
    status: "Active",
    lastVisit: "2024-01-14",
    problemList: ["Hypothyroidism", "Iron Deficiency Anemia"],
    medications: ["Levothyroxine 75mcg", "Iron Sulfate 325mg"],
    allergies: ["Latex"],
  },
]

const sampleAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Maria Garcia",
    date: new Date().toISOString().split("T")[0],
    time: "9:00 AM",
    type: "Annual Physical",
    status: "In Progress",
    practiceId: "practice1",
  },
  {
    id: "2",
    patientName: "John Smith",
    date: new Date().toISOString().split("T")[0],
    time: "10:30 AM",
    type: "Follow-up",
    status: "Scheduled",
    practiceId: "practice1",
  },
  {
    id: "3",
    patientName: "Sarah Johnson",
    date: new Date().toISOString().split("T")[0],
    time: "2:00 PM",
    type: "Consultation",
    status: "Arriving",
    practiceId: "practice2",
  },
  {
    id: "4",
    patientName: "Michael Brown",
    date: new Date().toISOString().split("T")[0],
    time: "3:30 PM",
    type: "Check-up",
    status: "Scheduled",
    practiceId: "practice1",
  },
  {
    id: "5",
    patientName: "Emily Davis",
    date: new Date().toISOString().split("T")[0],
    time: "4:15 PM",
    type: "Lab Review",
    status: "Completed",
    practiceId: "practice2",
  },
]

const sampleClaims: Claim[] = [
  {
    id: "1",
    patientName: "Maria Garcia",
    amount: 250.0,
    status: "paid",
    practiceId: "practice1",
    date: "2024-01-15",
    serviceCode: "99213",
  },
  {
    id: "2",
    patientName: "John Smith",
    amount: 180.0,
    status: "paid",
    practiceId: "practice1",
    date: "2024-01-14",
    serviceCode: "99212",
  },
  {
    id: "3",
    patientName: "Sarah Johnson",
    amount: 320.0,
    status: "pending",
    practiceId: "practice2",
    date: "2024-01-13",
    serviceCode: "99214",
  },
]

const sampleDenials: Denial[] = [
  {
    id: "1",
    claimId: "3",
    reason: "Prior authorization required",
    practiceId: "practice2",
    date: "2024-01-12",
    amount: 320.0,
  },
]

const sampleUncodedEncounters: UncodedEncounter[] = [
  {
    id: "1",
    patientName: "Michael Brown",
    date: "2024-01-16",
    practiceId: "practice1",
    provider: "Dr. Smith",
  },
]

export function HealthcareProvider({ children }: { children: ReactNode }) {
  const [currentPracticeId, setCurrentPracticeId] = useState("practice1")
  const [currentPortal, setCurrentPortal] = useState("")
  const [activeView, setActiveView] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<ReactNode>(null)
  const [modalTitle, setModalTitle] = useState("")
  const [isIdleModalOpen, setIsIdleModalOpen] = useState(false)
  const [dismissedAnnouncements, setDismissedAnnouncements] = useState<string[]>([])

  const openModal = (title: string, content: ReactNode) => {
    setModalTitle(title)
    setModalContent(content)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalContent(null)
    setModalTitle("")
  }

  const openIdleModal = () => setIsIdleModalOpen(true)
  const closeIdleModal = () => setIsIdleModalOpen(false)

  const dismissAnnouncement = (id: string) => {
    setDismissedAnnouncements((prev) => [...prev, id])
  }

  const announcements = [
    {
      id: "1",
      title: "System Maintenance",
      message: "Scheduled maintenance tonight from 11 PM to 1 AM EST",
      type: "info" as const,
      expiresAt: "2024-02-01",
    },
  ]

  const userPermissions = ["users:create", "users:edit", "reports:view", "billing:manage"]

  const value: HealthcareContextType = {
    patients: samplePatients,
    appointments: sampleAppointments,
    claims: sampleClaims,
    denials: sampleDenials,
    uncoded_encounters: sampleUncodedEncounters,
    currentPracticeId,
    setCurrentPracticeId,
    currentPortal,
    setCurrentPortal,
    activeView,
    setActiveView,
    isModalOpen,
    modalContent,
    modalTitle,
    openModal,
    closeModal,
    userPermissions,
    isIdleModalOpen,
    openIdleModal,
    closeIdleModal,
    announcements,
    dismissedAnnouncements,
    dismissAnnouncement,
  }

  return <HealthcareContext.Provider value={value}>{children}</HealthcareContext.Provider>
}

export function useHealthcare() {
  const context = useContext(HealthcareContext)
  if (context === undefined) {
    throw new Error("useHealthcare must be used within a HealthcareProvider")
  }
  return context
}

// For backward compatibility with existing components
export const useAppStore = useHealthcare
