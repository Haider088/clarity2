"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Clock, CheckCircle, UserCheck, Phone, AlertTriangle, MapPin } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function StaffDashboard() {
  const router = useRouter()
  const { openModal, closeModal, appointments, currentPracticeId } = useAppStore()
  const [checkingIn, setCheckingIn] = useState(false)

  const todayAppointments = appointments.filter(
    (apt) => apt.practiceId === currentPracticeId && new Date(apt.date).toDateString() === new Date().toDateString(),
  )

  const todayStats = {
    scheduledAppointments: todayAppointments.length,
    checkedIn: todayAppointments.filter((apt) => apt.status === "In Progress" || apt.status === "Completed").length,
    waitingRoom: todayAppointments.filter((apt) => apt.status === "Arriving").length,
    completed: todayAppointments.filter((apt) => apt.status === "Completed").length,
  }

  const upcomingAppointments = todayAppointments
    .filter((apt) => apt.status === "Scheduled" || apt.status === "Arriving" || apt.status === "In Progress")
    .slice(0, 4)
    .map((apt) => ({
      time: apt.time,
      patient: apt.patientName,
      type: apt.type,
      status: apt.status === "In Progress" ? "checked-in" : apt.status === "Arriving" ? "waiting" : "scheduled",
    }))

  const tasks = [
    { id: 1, task: "Verify insurance for Jane Smith", priority: "high", completed: false },
    { id: 2, task: "Schedule follow-up for John Doe", priority: "medium", completed: false },
    { id: 3, task: "Call pharmacy for prescription refill", priority: "low", completed: true },
    { id: 4, task: "Update patient contact information", priority: "medium", completed: false },
  ]

  const roomStatus = [
    {
      room: "Room 1",
      patient: "Maria Garcia",
      provider: "Dr. Smith",
      status: "occupied",
      duration: "25 min",
      type: "Annual Physical",
    },
    {
      room: "Room 2",
      patient: "John Doe",
      provider: "Dr. Johnson",
      status: "cleaning",
      duration: "5 min",
      type: "Follow-up",
    },
    { room: "Room 3", patient: null, provider: null, status: "available", duration: null, type: null },
    {
      room: "Room 4",
      patient: "Sarah Wilson",
      provider: "Dr. Brown",
      status: "ready",
      duration: "2 min",
      type: "Consultation",
    },
    { room: "Room 5", patient: null, provider: null, status: "maintenance", duration: null, type: null },
    {
      room: "Room 6",
      patient: "Mike Johnson",
      provider: "Dr. Davis",
      status: "occupied",
      duration: "15 min",
      type: "Check-up",
    },
  ]

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case "occupied":
        return "bg-red-100 text-red-800 border-red-200"
      case "ready":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "cleaning":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "maintenance":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleCheckIn = (patientName: string) => {
    const modalContent = (
      <div className="space-y-4">
        <div className="text-center">
          {!checkingIn ? (
            <div className="flex items-center justify-center space-x-2">
              <Clock className="w-5 h-5 animate-spin text-blue-500" />
              <span>Checking eligibility and benefits...</span>
            </div>
          ) : (
            <div className="space-y-3">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
              <div>
                <h3 className="font-semibold text-green-900">✅ Eligibility Verified</h3>
                <p className="text-sm text-green-700 mt-1">
                  {patientName} is eligible for today's visit. Insurance is active and benefits confirmed.
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-green-600">Copay:</span>
                    <div className="font-medium">$25.00</div>
                  </div>
                  <div>
                    <span className="text-green-600">Deductible:</span>
                    <div className="font-medium">$150 remaining</div>
                  </div>
                </div>
              </div>
              <Button onClick={closeModal} className="w-full">
                Complete Check-in
              </Button>
            </div>
          )}
        </div>
      </div>
    )

    openModal(`Check-in: ${patientName}`, modalContent)

    // Simulate the checking process
    setTimeout(() => {
      setCheckingIn(true)
    }, 1500)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "checked-in":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "waiting":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "scheduled":
        return <Calendar className="w-4 h-4 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "checked-in":
        return <Badge className="bg-green-100 text-green-800">Checked In</Badge>
      case "waiting":
        return (
          <Badge variant="outline" className="text-yellow-600">
            Waiting
          </Badge>
        )
      case "scheduled":
        return <Badge variant="outline">Scheduled</Badge>
      default:
        return null
    }
  }

  const handleCallPatient = () => {
    const modalContent = (
      <div className="space-y-4">
        <h3 className="font-semibold">Call Patient</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Select Patient</label>
            <select className="mt-1 w-full rounded border p-2">
              <option>Maria Garcia - (555) 123-4567</option>
              <option>John Smith - (555) 987-6543</option>
              <option>Sarah Johnson - (555) 456-7890</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Call Reason</label>
            <select className="mt-1 w-full rounded border p-2">
              <option>Appointment Reminder</option>
              <option>Insurance Verification</option>
              <option>Lab Results Available</option>
              <option>Prescription Ready</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={closeModal} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={() => {
                closeModal()
                // Simulate call initiation
                setTimeout(() => {
                  openModal("Call Status", <div className="text-center p-4">📞 Call initiated successfully!</div>)
                }, 500)
              }}
            >
              Start Call
            </Button>
          </div>
        </div>
      </div>
    )
    openModal("Call Patient", modalContent)
  }

  const handleScheduleAppointment = () => {
    router.push("/portal/staff/schedule")
  }

  const handleVerifyInsurance = () => {
    router.push("/portal/staff/eligibility")
  }

  const handleReportIssue = () => {
    const modalContent = (
      <div className="space-y-4">
        <h3 className="font-semibold">Report Issue</h3>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Issue Type</label>
            <select className="mt-1 w-full rounded border p-2">
              <option>Equipment Malfunction</option>
              <option>Software Problem</option>
              <option>Patient Complaint</option>
              <option>Scheduling Conflict</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Priority</label>
            <select className="mt-1 w-full rounded border p-2">
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="mt-1 w-full rounded border p-2"
              rows={3}
              placeholder="Describe the issue..."
            ></textarea>
          </div>
          <div className="flex gap-2">
            <Button onClick={closeModal} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={() => {
                closeModal()
                setTimeout(() => {
                  openModal(
                    "Issue Reported",
                    <div className="text-center p-4">✅ Issue reported successfully! Ticket #12345 created.</div>,
                  )
                }, 500)
              }}
            >
              Submit Report
            </Button>
          </div>
        </div>
      </div>
    )
    openModal("Report Issue", modalContent)
  }

  return (
    <div className="space-y-6">
      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.scheduledAppointments}</div>
            <p className="text-xs text-muted-foreground">appointments today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.checkedIn}</div>
            <p className="text-xs text-muted-foreground">patients processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting Room</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.waitingRoom}</div>
            <p className="text-xs text-muted-foreground">patients waiting</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayStats.completed}</div>
            <p className="text-xs text-muted-foreground">visits finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Practice Flow Real-Time Dashboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Practice Flow - Real-Time Room Status</span>
          </CardTitle>
          <CardDescription>Live tracking of room occupancy and patient flow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roomStatus.map((room) => (
              <div key={room.room} className={`p-4 rounded-lg border-2 ${getRoomStatusColor(room.status)}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{room.room}</h3>
                  <Badge variant="outline" className={`text-xs ${getRoomStatusColor(room.status)} border-0`}>
                    {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                  </Badge>
                </div>
                {room.patient ? (
                  <div className="space-y-1">
                    <div className="text-sm font-medium">{room.patient}</div>
                    <div className="text-xs opacity-75">{room.provider}</div>
                    <div className="text-xs opacity-75">{room.type}</div>
                    {room.duration && (
                      <div className="text-xs font-medium flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{room.duration}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm opacity-75">
                    {room.status === "available"
                      ? "Ready for next patient"
                      : room.status === "maintenance"
                        ? "Under maintenance"
                        : "Being cleaned"}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-200 rounded border border-red-300"></div>
              <span>Occupied</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-yellow-200 rounded border border-yellow-300"></div>
              <span>Patient Ready</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-200 rounded border border-green-300"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-200 rounded border border-blue-300"></div>
              <span>Cleaning</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-200 rounded border border-gray-300"></div>
              <span>Maintenance</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
          <CardDescription>Next appointments scheduled for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(appointment.status)}
                  <div>
                    <div className="font-medium">{appointment.patient}</div>
                    <div className="text-sm text-muted-foreground">
                      {appointment.time} - {appointment.type}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(appointment.status)}
                  {appointment.status === "scheduled" && (
                    <Button size="sm" onClick={() => handleCheckIn(appointment.patient)}>
                      Check In
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tasks & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Tasks</CardTitle>
            <CardDescription>Important tasks and reminders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3">
                  <input type="checkbox" checked={task.completed} className="rounded" readOnly />
                  <div className="flex-1">
                    <div className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                      {task.task}
                    </div>
                  </div>
                  <Badge
                    variant={
                      task.priority === "high" ? "destructive" : task.priority === "medium" ? "outline" : "secondary"
                    }
                    className="text-xs"
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common front office tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center space-y-1 bg-transparent"
                onClick={handleCallPatient}
              >
                <Phone className="w-5 h-5" />
                <span className="text-xs">Call Patient</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center space-y-1 bg-transparent"
                onClick={handleScheduleAppointment}
              >
                <Calendar className="w-5 h-5" />
                <span className="text-xs">Schedule</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center space-y-1 bg-transparent"
                onClick={handleVerifyInsurance}
              >
                <UserCheck className="w-5 h-5" />
                <span className="text-xs">Verify Insurance</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col items-center space-y-1 bg-transparent"
                onClick={handleReportIssue}
              >
                <AlertTriangle className="w-5 h-5" />
                <span className="text-xs">Report Issue</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
