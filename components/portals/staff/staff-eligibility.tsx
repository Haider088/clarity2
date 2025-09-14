"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"

export function StaffEligibility() {
  const { appointments, currentPracticeId } = useAppStore()

  const upcomingAppointments =
    appointments?.filter((appt) => appt.practiceId === currentPracticeId && appt.status === "Scheduled") || []

  const handleCheckEligibility = (appointment: any) => {
    alert(`Checking eligibility for ${appointment.patientName}... (Real eligibility check would be performed here)`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Eligibility Worklist</h1>
        <p className="text-muted-foreground">Verify insurance eligibility for upcoming appointments</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments - Eligibility Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient</TableHead>
                <TableHead>Date/Time</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Eligibility Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcomingAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">{appointment.patientName}</TableCell>
                  <TableCell>
                    {appointment.date} at {appointment.time}
                  </TableCell>
                  <TableCell>{appointment.provider}</TableCell>
                  <TableCell>
                    <Badge variant="default">Verified</Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => handleCheckEligibility(appointment)}>
                      Re-verify
                    </Button>
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
