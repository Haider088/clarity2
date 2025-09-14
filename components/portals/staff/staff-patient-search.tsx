"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, User, Phone, Calendar, FileText } from "lucide-react"

export function StaffPatientSearch() {
  const { patients, currentPracticeId, openModal, closeModal } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")

  const practicePatients = patients.filter((patient) => patient.practiceId === currentPracticeId)

  const filteredPatients = practicePatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleViewChart = (patient: any) => {
    openModal(
      <div className="space-y-4 max-w-2xl">
        <h3 className="text-lg font-semibold">Patient Chart - {patient.name}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Date of Birth:</span>
            <p>{patient.dateOfBirth}</p>
          </div>
          <div>
            <span className="font-medium">Phone:</span>
            <p>{patient.phone}</p>
          </div>
          <div>
            <span className="font-medium">Email:</span>
            <p>{patient.email}</p>
          </div>
          <div>
            <span className="font-medium">Status:</span>
            <p>{patient.status}</p>
          </div>
        </div>
        <div>
          <span className="font-medium">Medical History:</span>
          <p className="text-sm text-muted-foreground mt-1">
            {patient.problemList?.join(", ") || "No medical history on file"}
          </p>
        </div>
        <div className="flex justify-end">
          <Button onClick={closeModal}>Close</Button>
        </div>
      </div>,
    )
  }

  const handleScheduleAppointment = (patient: any) => {
    openModal(
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Schedule Appointment - {patient.name}</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Appointment Type</label>
            <select className="w-full p-2 border rounded">
              <option>Follow-up Visit</option>
              <option>Annual Physical</option>
              <option>Consultation</option>
              <option>Urgent Care</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preferred Date</label>
            <input type="date" className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Preferred Time</label>
            <select className="w-full p-2 border rounded">
              <option>9:00 AM</option>
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>2:00 PM</option>
              <option>3:00 PM</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              alert(`Appointment scheduled successfully for ${patient.name}`)
              closeModal()
            }}
          >
            Schedule Appointment
          </Button>
        </div>
      </div>,
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Patient Search</h1>
        <p className="text-muted-foreground">Find and manage patient information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient Directory ({filteredPatients.length} patients)
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPatients.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {searchTerm ? "No patients found matching your search" : "No patients in this practice"}
              </p>
            ) : (
              filteredPatients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{patient.name}</span>
                      <span className="text-sm text-muted-foreground">DOB: {patient.dateOfBirth}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{patient.email}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleScheduleAppointment(patient)}>
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewChart(patient)}>
                        <FileText className="h-4 w-4 mr-1" />
                        Chart
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
