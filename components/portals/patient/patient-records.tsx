"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"

export function PatientRecords() {
  const { appointments, currentUserId } = useAppStore()

  const patientVisits = appointments
    .filter((apt) => apt.patientId === currentUserId && apt.status === "completed")
    .slice(0, 10) // Show recent 10 visits

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Health Records</h1>
        <p className="text-muted-foreground">Your medical visit history and records</p>
      </div>

      <div className="space-y-4">
        {patientVisits.map((visit) => (
          <Card key={visit.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">
                    {visit.type === "telehealth" ? "Telehealth Visit" : "Office Visit"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {visit.date} at {visit.time}
                  </p>
                </div>
                <Badge variant="outline">{visit.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">Provider: </span>
                  <span>{visit.provider}</span>
                </div>
                <div>
                  <span className="font-medium">Visit Summary: </span>
                  <span>
                    Annual wellness exam completed. All vital signs within normal limits. Continue current medications.
                  </span>
                </div>
                <div>
                  <span className="font-medium">Diagnosis: </span>
                  <span>Z00.00 - Encounter for general adult medical examination without abnormal findings</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {patientVisits.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No visit records found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
