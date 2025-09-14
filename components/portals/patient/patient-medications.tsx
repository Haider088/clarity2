"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pill, Calendar, AlertCircle, RefreshCw, Phone } from "lucide-react"
import { useState } from "react"

const mockMedications = [
  {
    id: "1",
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    prescribedBy: "Dr. Sarah Johnson",
    prescribedDate: "2024-01-15",
    refillsRemaining: 3,
    lastFilled: "2024-01-15",
    nextRefill: "2024-02-15",
    status: "Active",
    instructions: "Take with food in the morning",
  },
  {
    id: "2",
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    prescribedBy: "Dr. Sarah Johnson",
    prescribedDate: "2024-01-10",
    refillsRemaining: 1,
    lastFilled: "2024-01-10",
    nextRefill: "2024-02-10",
    status: "Active",
    instructions: "Take with meals",
  },
  {
    id: "3",
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    prescribedBy: "Dr. Michael Chen",
    prescribedDate: "2023-12-20",
    refillsRemaining: 0,
    lastFilled: "2023-12-20",
    nextRefill: "2024-01-20",
    status: "Needs Refill",
    instructions: "Take in the evening",
  },
]

export function PatientMedications() {
  const [showRefillModal, setShowRefillModal] = useState(false)
  const [selectedMedication, setSelectedMedication] = useState<any>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Needs Refill":
        return "bg-red-100 text-red-800"
      case "Discontinued":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const activeMedications = mockMedications.filter((med) => med.status === "Active")
  const needsRefill = mockMedications.filter((med) => med.status === "Needs Refill")

  const handleRequestRefill = (medication: any) => {
    setSelectedMedication(medication)
    setShowRefillModal(true)
  }

  const handleContactProvider = (medication: any) => {
    alert(`Contacting ${medication.prescribedBy} about ${medication.name}`)
  }

  const handleCallPharmacy = (medication: any) => {
    alert(`Calling pharmacy for ${medication.name} refill`)
  }

  const handleSetReminder = (medication: any) => {
    alert(`Reminder set for ${medication.name}`)
  }

  const handleSubmitRefill = () => {
    if (selectedMedication) {
      alert(`Refill request submitted for ${selectedMedication.name}`)
      setShowRefillModal(false)
      setSelectedMedication(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">My Medications</h1>
        <p className="text-muted-foreground">Manage your prescriptions and refills</p>
      </div>

      {/* Refill Alerts */}
      {needsRefill.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              Refill Needed ({needsRefill.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {needsRefill.map((medication) => (
                <div key={medication.id} className="flex items-center justify-between p-3 bg-white rounded border">
                  <div>
                    <span className="font-medium text-red-800">
                      {medication.name} {medication.dosage}
                    </span>
                    <p className="text-sm text-red-600">Last refill: {medication.lastFilled}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-red-600 text-white hover:bg-red-700"
                      onClick={() => handleRequestRefill(medication)}
                    >
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Request Refill
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-300 text-red-700 bg-transparent"
                      onClick={() => handleCallPharmacy(medication)}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Call Pharmacy
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Medications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5" />
            Active Medications ({activeMedications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeMedications.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No active medications</p>
            ) : (
              activeMedications.map((medication) => (
                <div key={medication.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {medication.name} {medication.dosage}
                      </h3>
                      <p className="text-sm text-muted-foreground">{medication.frequency}</p>
                    </div>
                    <Badge className={getStatusColor(medication.status)}>{medication.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Prescribed by:</span>
                      <p className="text-muted-foreground">{medication.prescribedBy}</p>
                    </div>
                    <div>
                      <span className="font-medium">Prescribed date:</span>
                      <p className="text-muted-foreground">{medication.prescribedDate}</p>
                    </div>
                    <div>
                      <span className="font-medium">Refills remaining:</span>
                      <p className="text-muted-foreground">{medication.refillsRemaining}</p>
                    </div>
                    <div>
                      <span className="font-medium">Next refill due:</span>
                      <p className="text-muted-foreground">{medication.nextRefill}</p>
                    </div>
                  </div>

                  <div className="mt-3 p-2 bg-muted/50 rounded">
                    <span className="font-medium text-sm">Instructions: </span>
                    <span className="text-sm text-muted-foreground">{medication.instructions}</span>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" onClick={() => handleRequestRefill(medication)}>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Request Refill
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleSetReminder(medication)}>
                      <Calendar className="h-4 w-4 mr-1" />
                      Set Reminder
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* All Medications History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Medication History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockMedications.map((medication) => (
              <div key={medication.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-4">
                  <Pill className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <span className="font-medium">
                      {medication.name} {medication.dosage}
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {medication.frequency} • Prescribed {medication.prescribedDate}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(medication.status)}>{medication.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Refill Request Modal */}
      {showRefillModal && selectedMedication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Request Refill</h3>
            <div className="space-y-4">
              <div>
                <span className="font-medium">Medication:</span>
                <p>
                  {selectedMedication.name} {selectedMedication.dosage}
                </p>
              </div>
              <div>
                <span className="font-medium">Prescribing Provider:</span>
                <p>{selectedMedication.prescribedBy}</p>
              </div>
              <div>
                <span className="font-medium">Refills Remaining:</span>
                <p>{selectedMedication.refillsRemaining}</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Preferred Pharmacy</label>
                <select className="w-full p-2 border rounded">
                  <option>CVS Pharmacy - Main St</option>
                  <option>Walgreens - Oak Ave</option>
                  <option>Rite Aid - Center Blvd</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Special Instructions</label>
                <textarea
                  className="w-full p-2 border rounded h-20"
                  placeholder="Any special instructions..."
                ></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowRefillModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitRefill}>Submit Request</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
