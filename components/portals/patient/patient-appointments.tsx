"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, MapPin, User, Phone, Plus } from "lucide-react"

export function PatientAppointments() {
  const { appointments, currentPracticeId, showToast, openModal, closeModal, addAppointment, updateAppointment } =
    useAppStore()
  const [showScheduleForm, setShowScheduleForm] = useState(false)

  const [scheduleData, setScheduleData] = useState({
    type: "",
    date: "",
    time: "",
    reason: "",
    preferredProvider: "",
  })

  const [rescheduleData, setRescheduleData] = useState({
    date: "",
    time: "",
  })

  const [summaryData, setSummaryData] = useState({
    appointmentId: "",
    summary: "",
  })

  // For patient portal, we'd typically filter by current patient ID
  // For demo purposes, showing all appointments for the practice
  const patientAppointments = appointments.filter((apt) => apt.practiceId === currentPracticeId)

  const upcomingAppointments = patientAppointments.filter((apt) => new Date(apt.date) >= new Date())

  const pastAppointments = patientAppointments.filter((apt) => new Date(apt.date) < new Date())

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "bg-blue-100 text-blue-800"
      case "Confirmed":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-gray-100 text-gray-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleScheduleAppointment = () => {
    openModal(
      <div className="space-y-6 max-w-md">
        <h3 className="text-lg font-semibold">Schedule New Appointment</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="appointmentType">Appointment Type</Label>
            <Select
              value={scheduleData.type}
              onValueChange={(value) => setScheduleData((prev) => ({ ...prev, type: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Annual Physical">Annual Physical</SelectItem>
                <SelectItem value="Follow-up">Follow-up Visit</SelectItem>
                <SelectItem value="Consultation">Consultation</SelectItem>
                <SelectItem value="Urgent Care">Urgent Care</SelectItem>
                <SelectItem value="Preventive Care">Preventive Care</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="appointmentDate">Preferred Date</Label>
              <Input
                id="appointmentDate"
                type="date"
                value={scheduleData.date}
                onChange={(e) => setScheduleData((prev) => ({ ...prev, date: e.target.value }))}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label htmlFor="appointmentTime">Preferred Time</Label>
              <Select
                value={scheduleData.time}
                onValueChange={(value) => setScheduleData((prev) => ({ ...prev, time: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                  <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                  <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                  <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                  <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                  <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                  <SelectItem value="4:00 PM">4:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="preferredProvider">Preferred Provider</Label>
            <Select
              value={scheduleData.preferredProvider}
              onValueChange={(value) => setScheduleData((prev) => ({ ...prev, preferredProvider: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dr. Johnson">Dr. Johnson</SelectItem>
                <SelectItem value="Dr. Smith">Dr. Smith</SelectItem>
                <SelectItem value="Dr. Williams">Dr. Williams</SelectItem>
                <SelectItem value="No Preference">No Preference</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="reason">Reason for Visit</Label>
            <Textarea
              id="reason"
              placeholder="Please describe the reason for your appointment..."
              value={scheduleData.reason}
              onChange={(e) => setScheduleData((prev) => ({ ...prev, reason: e.target.value }))}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              closeModal()
              setScheduleData({ type: "", date: "", time: "", reason: "", preferredProvider: "" })
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!scheduleData.type || !scheduleData.date || !scheduleData.time) {
                showToast("Please fill in all required fields")
                return
              }

              const newAppointment = {
                id: `apt_${Date.now()}`,
                patientId: "current_patient",
                patientName: "Current Patient",
                practiceId: currentPracticeId,
                type: scheduleData.type,
                date: scheduleData.date,
                time: scheduleData.time,
                status: "Scheduled",
                provider: scheduleData.preferredProvider || "Dr. Johnson",
                reason: scheduleData.reason,
              }

              addAppointment(newAppointment)
              showToast("Appointment request submitted successfully!")
              closeModal()
              setScheduleData({ type: "", date: "", time: "", reason: "", preferredProvider: "" })
            }}
          >
            Schedule Appointment
          </Button>
        </div>
      </div>,
    )
  }

  const handleCancelAppointment = (appointment: any) => {
    openModal(
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Cancel Appointment</h3>
        <p className="text-muted-foreground">
          Are you sure you want to cancel your {appointment.type} appointment on {appointment.date} at{" "}
          {appointment.time}?
        </p>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={closeModal}>
            Keep Appointment
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              updateAppointment(appointment.id, { ...appointment, status: "Cancelled" })
              showToast("Appointment cancelled successfully")
              closeModal()
            }}
          >
            Cancel Appointment
          </Button>
        </div>
      </div>,
    )
  }

  const handleRescheduleAppointment = (appointment: any) => {
    setRescheduleData({
      date: appointment.date,
      time: appointment.time,
    })

    openModal(
      <div className="space-y-4 max-w-md">
        <h3 className="text-lg font-semibold">Reschedule Appointment</h3>
        <p className="text-sm text-muted-foreground">
          Current: {appointment.type} on {appointment.date} at {appointment.time}
        </p>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="newDate">New Date</Label>
            <Input
              id="newDate"
              type="date"
              value={rescheduleData.date}
              onChange={(e) => setRescheduleData((prev) => ({ ...prev, date: e.target.value }))}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div>
            <Label htmlFor="newTime">New Time</Label>
            <Select
              value={rescheduleData.time}
              onValueChange={(value) => setRescheduleData((prev) => ({ ...prev, time: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="9:00 AM">9:00 AM</SelectItem>
                <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                <SelectItem value="1:00 PM">1:00 PM</SelectItem>
                <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                <SelectItem value="4:00 PM">4:00 PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              updateAppointment(appointment.id, {
                ...appointment,
                date: rescheduleData.date,
                time: rescheduleData.time,
                status: "Scheduled",
              })
              showToast("Appointment rescheduled successfully")
              closeModal()
            }}
          >
            Reschedule
          </Button>
        </div>
      </div>,
    )
  }

  const handleViewSummary = (appointment: any) => {
    openModal(
      <div className="space-y-4 max-w-md">
        <h3 className="text-lg font-semibold">Appointment Summary</h3>
        <p className="text-sm text-muted-foreground">
          Summary for {appointment.type} on {appointment.date} at {appointment.time}
        </p>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={closeModal}>
            Close
          </Button>
        </div>
      </div>,
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
          <p className="text-muted-foreground">View and manage your healthcare appointments</p>
        </div>
        <Button onClick={handleScheduleAppointment} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Schedule Appointment
        </Button>
      </div>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Appointments ({upcomingAppointments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No upcoming appointments scheduled</p>
                <Button onClick={handleScheduleAppointment} className="bg-primary text-primary-foreground">
                  Schedule Appointment
                </Button>
              </div>
            ) : (
              upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-primary">{new Date(appointment.date).getDate()}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(appointment.date).toLocaleDateString("en-US", { month: "short" })}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{appointment.type}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{appointment.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{appointment.provider || "Dr. Johnson"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleRescheduleAppointment(appointment)}>
                          Reschedule
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleCancelAppointment(appointment)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>Main Office - Room 201</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>(555) 123-4567</span>
                    </div>
                  </div>
                  {appointment.reason && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <strong>Reason:</strong> {appointment.reason}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Past Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Past Appointments ({pastAppointments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pastAppointments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No past appointments</p>
            ) : (
              pastAppointments.slice(0, 5).map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-muted-foreground">
                          {new Date(appointment.date).getDate()}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(appointment.date).toLocaleDateString("en-US", { month: "short" })}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{appointment.type}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>{appointment.time}</span>
                          <span>{appointment.provider || "Dr. Johnson"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor("Completed")}>Completed</Badge>
                      <Button variant="outline" size="sm" onClick={() => handleViewSummary(appointment)}>
                        View Summary
                      </Button>
                    </div>
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
