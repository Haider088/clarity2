"use client"

import { useParams } from "next/navigation"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { BillerDashboard } from "@/components/portals/biller/biller-dashboard"
import { PracticeOwnerDashboard } from "@/components/portals/practice-admin/practice-owner-dashboard"
import { AnalyticsDashboard } from "@/components/portals/practice-admin/analytics-dashboard"
import { AnnouncementsManager } from "@/components/portals/practice-admin/announcements-manager"
import { SoapNote } from "@/components/portals/provider/soap-note"
import { StaffDashboard } from "@/components/portals/staff/staff-dashboard"
import { PatientDashboard } from "@/components/portals/patient/patient-dashboard"
import { ChargeCapture } from "@/components/portals/biller/charge-capture"
import { DenialsView } from "@/components/portals/biller/denials-view"
import { AiClaimScrubber } from "@/components/portals/biller/ai-claim-scrubber"
import { Cms1500Submit } from "@/components/portals/biller/cms1500-submit"
import { SubmissionResult } from "@/components/portals/biller/submission-result"
import { StaffSchedule } from "@/components/portals/staff/staff-schedule"
import { StaffCheckIn } from "@/components/portals/staff/staff-check-in"
import { StaffMessages } from "@/components/portals/staff/staff-messages"
import { StaffPatientSearch } from "@/components/portals/staff/staff-patient-search"
import { StaffRegistration } from "@/components/portals/staff/staff-registration"
import { StaffPayments } from "@/components/portals/staff/staff-payments"
import { StaffReferrals } from "@/components/portals/staff/staff-referrals"
import { StaffCredentialing } from "@/components/portals/staff/staff-credentialing"
import { StaffEligibility } from "@/components/portals/staff/staff-eligibility"
import { ProviderDashboard } from "@/components/portals/provider/provider-dashboard"
import { ProviderPatientList } from "@/components/portals/provider/provider-patient-list"
import { ProviderOrders } from "@/components/portals/provider/provider-orders"
import { ProviderLabResults } from "@/components/portals/provider/provider-lab-results"
import { ProviderMips } from "@/components/portals/provider/provider-mips"
import { ProviderFinancials } from "@/components/portals/provider/provider-financials"
import { ProviderMessages } from "@/components/portals/provider/provider-messages"
import { BillerPatternAnalysis } from "@/components/portals/biller/biller-pattern-analysis"
import { BillerOnboarding } from "@/components/portals/biller/biller-onboarding"
import { PatientAppointments } from "@/components/portals/patient/patient-appointments"
import { PatientMedications } from "@/components/portals/patient/patient-medications"
import { PatientStatements } from "@/components/portals/patient/patient-statements"
import { PatientIntake } from "@/components/portals/patient/patient-intake"
import { StaffManagement } from "@/components/portals/practice-admin/staff-management"
import { PracticeSettings } from "@/components/portals/practice-admin/practice-settings"
import { BillerClaimsView } from "@/components/portals/biller/biller-claims-view"
import { BillerPaymentPosting } from "@/components/portals/biller/biller-payment-posting"
import { AdminReportsView } from "@/components/portals/biller/admin-reports-view"
import { CollectionsView } from "@/components/portals/practice-admin/collections-view"
import { SavingsView } from "@/components/portals/practice-admin/savings-view"
import { StaffTelehealth } from "@/components/portals/staff/staff-telehealth"
import { PatientRecords } from "@/components/portals/patient/patient-records"
import { PatientMessages } from "@/components/portals/patient/patient-messages"
import { FinancialClearance } from "@/components/portals/biller/financial-clearance"
import { UnderpaymentAnalysis } from "@/components/portals/biller/underpayment-analysis"
import { useHealthcare } from "@/lib/healthcare-context"
import { useEffect } from "react"

const portalComponents = {
  biller: {
    dashboard: BillerDashboard,
    "charge-capture": ChargeCapture,
    denials: DenialsView,
    "ai-scrubber": AiClaimScrubber,
    "cms1500-submit": Cms1500Submit,
    "submission-results": SubmissionResult,
    "pattern-analysis": BillerPatternAnalysis,
    onboarding: BillerOnboarding,
    "claims-view": BillerClaimsView,
    "payment-posting": BillerPaymentPosting,
    "admin-reports": AdminReportsView,
    "financial-clearance": FinancialClearance,
    "underpayment-analysis": UnderpaymentAnalysis,
  },
  "practice-admin": {
    dashboard: PracticeOwnerDashboard,
    analytics: AnalyticsDashboard,
    "staff-management": StaffManagement,
    collections: CollectionsView,
    savings: SavingsView,
    announcements: AnnouncementsManager,
    settings: PracticeSettings,
  },
  provider: {
    dashboard: ProviderDashboard,
    "soap-notes": SoapNote,
    "patient-list": ProviderPatientList,
    orders: ProviderOrders,
    "lab-results": ProviderLabResults,
    mips: ProviderMips,
    patients: ProviderPatientList,
    chart: SoapNote,
    financials: ProviderFinancials,
    messages: ProviderMessages,
  },
  staff: {
    dashboard: StaffDashboard,
    schedule: StaffSchedule,
    "check-in": StaffCheckIn,
    messages: StaffMessages,
    "patient-search": StaffPatientSearch,
    registration: StaffRegistration,
    payments: StaffPayments,
    telehealth: StaffTelehealth,
    referrals: StaffReferrals,
    credentialing: StaffCredentialing,
    eligibility: StaffEligibility,
  },
  patient: {
    dashboard: PatientDashboard,
    appointments: PatientAppointments,
    medications: PatientMedications,
    statements: PatientStatements,
    records: PatientRecords,
    messages: PatientMessages,
    intake: PatientIntake,
  },
}

export default function PortalPage() {
  const params = useParams()
  const portalName = params.portalName as string
  const viewId = params.viewId as string

  const { setCurrentPortal, setActiveView, setCurrentPracticeId } = useHealthcare()

  useEffect(() => {
    setCurrentPortal(portalName)
    setActiveView(viewId)
    if (portalName) {
      setCurrentPracticeId("practice1") // Default practice
    }
  }, [portalName, viewId, setCurrentPortal, setActiveView, setCurrentPracticeId])

  const PortalComponent =
    portalComponents[portalName as keyof typeof portalComponents]?.[
      viewId as keyof (typeof portalComponents)[keyof typeof portalComponents]
    ]

  if (!PortalComponent) {
    return (
      <DashboardLayout portalName={portalName} viewId={viewId}>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Coming Soon</h2>
            <p className="text-muted-foreground">This feature is under development.</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout portalName={portalName} viewId={viewId}>
      <PortalComponent />
    </DashboardLayout>
  )
}
