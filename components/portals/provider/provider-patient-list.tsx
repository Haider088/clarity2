"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Search, User, Calendar, FileText, Phone, Brain, AlertTriangle } from "lucide-react"

export function ProviderPatientList() {
  const { patients, currentPracticeId, openModal, closeModal, encounters, addEncounter } = useAppStore()
  const [searchTerm, setSearchTerm] = useState("")

  const practicePatients = patients.filter((patient) => patient.practiceId === currentPracticeId)

  const filteredPatients = practicePatients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase()),
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

  const handleChartAccess = (patient: any) => {
    if (patient.isRestricted) {
      let accessReason = ""

      openModal(
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Restricted Record Access</h3>
          <div className="flex items-center gap-2 text-amber-600 mb-4">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">This patient record has restricted access</span>
          </div>
          <div>
            <Label htmlFor="accessReason">Please provide a reason for accessing this restricted record:</Label>
            <Textarea
              id="accessReason"
              placeholder="Enter your reason for accessing this restricted patient record..."
              className="mt-2"
              onChange={(e) => (accessReason = e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (accessReason.trim()) {
                  console.log(`Break the glass access: ${patient.name}, Reason: ${accessReason}`)
                  showPatientChart(patient)
                  closeModal()
                } else {
                  alert("Please provide a reason for accessing this restricted record")
                }
              }}
            >
              Acknowledge & Proceed
            </Button>
          </div>
        </div>,
      )
    } else {
      showPatientChart(patient)
    }
  }

  const showPatientChart = (patient: any) => {
    const patientEncounters = encounters.filter((enc) => enc.patientId === patient.id)

    openModal(
      <div className="space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Medical Chart - {patient.name}</h3>
          <Badge className={getStatusColor(patient.status || "Active")}>{patient.status || "Active"}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">DEMOGRAPHICS</h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">DOB:</span> {patient.dateOfBirth || "Not provided"}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {patient.phone || "Not provided"}
                </p>
                <p>
                  <span className="font-medium">Email:</span> {patient.email || "Not provided"}
                </p>
                <p>
                  <span className="font-medium">Insurance:</span> {patient.insurance || "Not provided"}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">PROBLEM LIST</h4>
              <div className="space-y-1">
                {patient.problemList && patient.problemList.length > 0 ? (
                  patient.problemList.map((problem: string, index: number) => (
                    <Badge key={index} variant="outline" className="mr-1 mb-1">
                      {problem}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No active problems</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">ALLERGIES</h4>
              <div className="space-y-1">
                {patient.allergies && patient.allergies.length > 0 ? (
                  patient.allergies.map((allergy: string, index: number) => (
                    <Badge key={index} variant="destructive" className="mr-1 mb-1">
                      {allergy}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline">NKDA</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">CURRENT MEDICATIONS</h4>
              <div className="space-y-2">
                {patient.medications && patient.medications.length > 0 ? (
                  patient.medications.map((med: string, index: number) => (
                    <div key={index} className="text-sm p-2 bg-muted rounded">
                      {med}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No current medications</p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">RECENT ENCOUNTERS</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {patientEncounters.length > 0 ? (
                  patientEncounters.slice(0, 5).map((encounter) => (
                    <div key={encounter.id} className="text-sm p-2 bg-muted rounded">
                      <div className="font-medium">{encounter.date}</div>
                      <div className="text-muted-foreground">{encounter.type}</div>
                      {encounter.chiefComplaint && <div className="text-xs mt-1">CC: {encounter.chiefComplaint}</div>}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No recent encounters</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={closeModal}>
            Close
          </Button>
          <Button
            onClick={() => {
              // Create new encounter for this patient
              const newEncounter = {
                id: `enc_${Date.now()}`,
                patientId: patient.id,
                providerId: "current_provider",
                date: new Date().toISOString().split("T")[0],
                type: "Office Visit",
                status: "In Progress",
                chiefComplaint: "",
                subjective: "",
                objective: "",
                assessment: "",
                plan: "",
              }
              addEncounter(newEncounter)
              closeModal()
              alert(`New encounter started for ${patient.name}`)
            }}
          >
            Start New Encounter
          </Button>
        </div>
      </div>,
    )
  }

  const handleAISummary = (patient: any) => {
    const mockSummary = `This is a ${Math.floor(Math.random() * 30 + 25)}-year-old ${Math.random() > 0.5 ? "male" : "female"} with a history of ${patient.problemList?.join(", ") || "no significant medical history"}. Current medications include ${patient.medications?.join(", ") || "none"}. Known allergies: ${patient.allergies?.join(", ") || "NKDA"}. Last seen for routine follow-up where vital signs were stable and patient reported feeling well. Continues on current medication regimen with good adherence and no reported side effects. Plan includes routine monitoring and follow-up as scheduled.`

    openModal(
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">AI Clinical Summary for {patient.name}</h3>
        <div className="space-y-4">
          <p className="text-sm leading-relaxed">{mockSummary}</p>
        </div>
        <div className="flex justify-end pt-4">
          <Button onClick={closeModal}>Close</Button>
        </div>
      </div>,
    )
  }

  const handleScheduleAppointment = (patient: any) => {
    // Placeholder for scheduling logic
    alert(`Schedule appointment for ${patient.name}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Patient List</h1>
        <p className="text-muted-foreground">Manage your patient roster and medical records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            All Patients ({filteredPatients.length})
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
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
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{patient.name}</span>
                        {patient.isRestricted && (
                          <AlertTriangle className="h-4 w-4 text-amber-500" title="Restricted Record" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        DOB: {patient.dateOfBirth || "Not provided"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{patient.phone || "Not provided"}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Last Visit: {patient.lastVisit || "No recent visits"}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(patient.status || "Active")}>{patient.status || "Active"}</Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleScheduleAppointment(patient)}>
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleChartAccess(patient)}>
                        <FileText className="h-4 w-4 mr-1" />
                        Chart
                      </Button>
                      <Button size="sm" onClick={() => handleAISummary(patient)}>
                        <Brain className="h-4 w-4 mr-1" />
                        AI Summary
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
