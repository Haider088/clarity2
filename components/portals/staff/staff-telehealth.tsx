"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Video, Phone } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function StaffTelehealth() {
  const { appointments, currentPracticeId, openModal, closeModal } = useAppStore()

  const telehealthAppointments = appointments
    .filter((apt) => apt.practiceId === currentPracticeId && apt.type === "telehealth")
    .map((apt) => ({
      ...apt,
      status: Math.random() > 0.5 ? "waiting" : "ready",
    }))

  const getStatusColor = (status: string) => {
    switch (status) {
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleStartVideo = (appointment: any) => {
    openModal(
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Start Video Call - {appointment.patientName}</h3>
        <p>Connecting to video session...</p>
        <div className="bg-gray-100 p-4 rounded text-center">
          <Video className="h-12 w-12 mx-auto mb-2 text-blue-500" />
          <p className="text-sm">Video call would start here in a real implementation</p>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeModal}>
            End Call
          </Button>
          <Button
            onClick={() => {
              alert(`Video call started with ${appointment.patientName}`)
              closeModal()
            }}
          >
            Join Call
          </Button>
        </div>
      </div>,
    )
  }

  const handleStartCall = (appointment: any) => {
    alert(`Calling ${appointment.patientName}... (Phone call functionality would be implemented here)`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Telehealth Waiting Room</h1>
        <p className="text-muted-foreground">Manage virtual patient visits</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Patients Waiting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {telehealthAppointments.filter((apt) => apt.status === "waiting").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ready to Connect</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {telehealthAppointments.filter((apt) => apt.status === "ready").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Wait Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 min</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Virtual Waiting Room</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Appointment Time</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {telehealthAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.patientName}</TableCell>
                  <TableCell>{appointment.time}</TableCell>
                  <TableCell>{appointment.provider}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleStartVideo(appointment)}>
                        <Video className="h-4 w-4 mr-1" />
                        Start Video
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleStartCall(appointment)}>
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
