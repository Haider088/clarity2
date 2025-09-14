"use client"

import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Modal } from "@/components/ui/modal"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, User, Plus } from "lucide-react"

export function StaffSchedule() {
  const { appointments, patients, providers, currentPracticeId, addAppointment, updateAppointment } = useAppStore()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    providerId: "",
    type: "",
    time: "",
    date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now())
      const todayAppointments = appointments.filter(
        (apt) =>
          apt.practiceId === currentPracticeId && new Date(apt.date).toDateString() === new Date().toDateString(),
      )

      todayAppointments.forEach((apt) => {
        if (apt.status === "Scheduled" && Math.random() > 0.8) {
          updateAppointment(apt.id, { status: "Arriving" })
        } else if (apt.status === "Arriving" && Math.random() > 0.7) {
          updateAppointment(apt.id, { status: "In Progress" })
        } else if (apt.status === "In Progress" && Math.random() > 0.9) {
          updateAppointment(apt.id, { status: "Completed" })
        }
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [appointments, currentPracticeId, updateAppointment])

  const dayAppointments = appointments.filter(
    (apt) => apt.practiceId === currentPracticeId && new Date(apt.date).toDateString() === selectedDate.toDateString(),
  )

  const getWeekAppointments = () => {
    const startOfWeek = new Date(selectedDate)
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay())
    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)

    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date)
      return apt.practiceId === currentPracticeId && aptDate >= startOfWeek && aptDate <= endOfWeek
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Arriving":
        return "bg-yellow-100 text-yellow-800"
      case "In Progress":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateAppointment = () => {
    const patient = patients.find((p) => p.id === newAppointment.patientId)
    const provider = providers.find((p) => p.id === newAppointment.providerId)

    if (patient && provider) {
      addAppointment({
        id: `apt-${Date.now()}`,
        patientId: newAppointment.patientId,
        patientName: patient.name,
        providerId: newAppointment.providerId,
        providerName: provider.name,
        practiceId: currentPracticeId,
        date: newAppointment.date,
        time: newAppointment.time,
        type: newAppointment.type,
        status: "Scheduled",
      })

      setShowNewAppointmentModal(false)
      setNewAppointment({
        patientId: "",
        providerId: "",
        type: "",
        time: "",
        date: new Date().toISOString().split("T")[0],
      })
    }
  }

  const handleStatusUpdate = (appointmentId: string, newStatus: string) => {
    updateAppointment(appointmentId, { status: newStatus })
  }

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment)
    setShowDetailsModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schedule Management</h1>
          <p className="text-muted-foreground">
            Manage appointments and patient flow • Last updated: {new Date(lastUpdate).toLocaleTimeString()}
          </p>
        </div>
        <Button onClick={() => setShowNewAppointmentModal(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <Tabs defaultValue="day" className="space-y-4">
        <TabsList>
          <TabsTrigger value="day">Day View</TabsTrigger>
          <TabsTrigger value="week">Week View</TabsTrigger>
          <TabsTrigger value="month">Month View</TabsTrigger>
        </TabsList>

        <TabsContent value="day" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {selectedDate.toLocaleDateString()} - Appointments ({dayAppointments.length})
                  <div className="ml-auto flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-muted-foreground">Live</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dayAppointments.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No appointments scheduled for this date</p>
                  ) : (
                    dayAppointments.map((appointment) => (
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
                          <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                          <Select
                            value={appointment.status}
                            onValueChange={(value) => handleStatusUpdate(appointment.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Scheduled">Scheduled</SelectItem>
                              <SelectItem value="Arriving">Arriving</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(appointment)}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Week View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => {
                  const dayDate = new Date(selectedDate)
                  dayDate.setDate(selectedDate.getDate() - selectedDate.getDay() + index)
                  const dayAppointments = getWeekAppointments().filter(
                    (apt) => new Date(apt.date).toDateString() === dayDate.toDateString(),
                  )

                  return (
                    <div key={day} className="border rounded-lg p-2 min-h-[200px]">
                      <div className="font-medium text-sm mb-2">
                        {day} {dayDate.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayAppointments.map((apt) => (
                          <div key={apt.id} className="text-xs p-1 bg-blue-100 rounded">
                            {apt.time} - {apt.patientName}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Month View</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border w-full"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Modal
        isOpen={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        title="Schedule New Appointment"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="patient">Patient</Label>
            <Select
              value={newAppointment.patientId}
              onValueChange={(value) => setNewAppointment((prev) => ({ ...prev, patientId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select patient" />
              </SelectTrigger>
              <SelectContent>
                {patients
                  .filter((p) => p.practiceId === currentPracticeId)
                  .map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="provider">Provider</Label>
            <Select
              value={newAppointment.providerId}
              onValueChange={(value) => setNewAppointment((prev) => ({ ...prev, providerId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                {providers
                  .filter((p) => p.practiceId === currentPracticeId)
                  .map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="type">Appointment Type</Label>
            <Select
              value={newAppointment.type}
              onValueChange={(value) => setNewAppointment((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Consultation">Consultation</SelectItem>
                <SelectItem value="Follow-up">Follow-up</SelectItem>
                <SelectItem value="Physical Exam">Physical Exam</SelectItem>
                <SelectItem value="Procedure">Procedure</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              type="date"
              value={newAppointment.date}
              onChange={(e) => setNewAppointment((prev) => ({ ...prev, date: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              type="time"
              value={newAppointment.time}
              onChange={(e) => setNewAppointment((prev) => ({ ...prev, time: e.target.value }))}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleCreateAppointment} className="flex-1">
              Schedule Appointment
            </Button>
            <Button variant="outline" onClick={() => setShowNewAppointmentModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} title="Appointment Details">
        {selectedAppointment && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Patient</Label>
                <p className="font-medium">{selectedAppointment.patientName}</p>
              </div>
              <div>
                <Label>Provider</Label>
                <p className="font-medium">{selectedAppointment.providerName}</p>
              </div>
              <div>
                <Label>Date</Label>
                <p className="font-medium">{new Date(selectedAppointment.date).toLocaleDateString()}</p>
              </div>
              <div>
                <Label>Time</Label>
                <p className="font-medium">{selectedAppointment.time}</p>
              </div>
              <div>
                <Label>Type</Label>
                <p className="font-medium">{selectedAppointment.type}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge className={getStatusColor(selectedAppointment.status)}>{selectedAppointment.status}</Badge>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={() => setShowDetailsModal(false)}>Close</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
