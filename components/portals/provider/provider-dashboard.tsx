"use client"

import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Activity, Users, Calendar, FileText, Clock, User, AlertTriangle, DollarSign } from "lucide-react"

export function ProviderDashboard() {
  const router = useRouter()
  const { appointments, patients, claims, currentPracticeId } = useAppStore()

  const todayAppointments = appointments.filter(
    (apt) => apt.practiceId === currentPracticeId && new Date(apt.date).toDateString() === new Date().toDateString(),
  )

  const practicePatients = patients.filter((p) => p.practiceId === currentPracticeId)
  const activePatients = practicePatients.filter((p) => p.status === "Active")

  const practiceClaims = claims.filter((c) => c.practiceId === currentPracticeId)
  const monthlyRevenue = practiceClaims.filter((c) => c.status === "paid").reduce((sum, c) => sum + c.amount, 0)

  const currentQueue = todayAppointments.filter((apt) => apt.status === "In Progress" || apt.status === "Arriving")

  const alerts = [
    { id: 1, type: "critical", message: "Lab results pending review for Maria Garcia", time: "10 min ago" },
    { id: 2, type: "warning", message: "Prior authorization needed for John Smith MRI", time: "25 min ago" },
    { id: 3, type: "info", message: "Insurance verification completed for 3 patients", time: "1 hour ago" },
  ]

  const handleStartVisit = (patientName: string) => {
    // Navigate to SOAP notes with patient context
    const patientId = patientName.toLowerCase().replace(" ", "-")
    router.push(`/portal/provider/soap-notes?patientId=${patientId}`)
  }

  const handleReviewAlert = (alertId: number) => {
    const alert = alerts.find((a) => a.id === alertId)
    if (alert) {
      // Navigate to appropriate page based on alert type
      if (alert.message.includes("Lab results")) {
        router.push("/portal/provider/provider-lab-results")
      } else if (alert.message.includes("Prior authorization")) {
        router.push("/portal/provider/provider-orders")
      } else {
        router.push("/portal/provider/provider-patient-list")
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Provider Dashboard</h1>
        <p className="text-muted-foreground">Clinical overview and patient management</p>
      </div>

      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Health Maintenance Alert</AlertTitle>
        <AlertDescription>
          Patient John Doe is overdue for an annual mammogram. Last screening was 18 months ago.
        </AlertDescription>
      </Alert>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today's Appointments</p>
                <p className="text-2xl font-bold text-foreground">{todayAppointments.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Patients</p>
                <p className="text-2xl font-bold text-foreground">{activePatients.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Queue</p>
                <p className="text-2xl font-bold text-foreground">{currentQueue.length}</p>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notes Pending</p>
                <p className="text-2xl font-bold text-foreground">3</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold text-foreground">${monthlyRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Clinical Alerts & Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      alert.type === "critical"
                        ? "bg-red-500"
                        : alert.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                    }`}
                  />
                  <span className="text-sm">{alert.message}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{alert.time}</span>
                  <Button variant="outline" size="sm" onClick={() => handleReviewAlert(alert.id)}>
                    Review
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Patient Queue */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Current Patient Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentQueue.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No patients in queue</p>
            ) : (
              currentQueue.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-foreground">{appointment.time}</div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{appointment.patientName}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{appointment.type}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        appointment.status === "In Progress"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {appointment.status}
                    </Badge>
                    <Button
                      onClick={() => handleStartVisit(appointment.patientName)}
                      className="bg-primary text-primary-foreground"
                    >
                      Start Visit
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
