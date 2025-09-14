"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"

export function StaffReferrals() {
  const { referrals, openModal, closeModal } = useAppStore()

  const incomingReferrals = referrals?.filter((r) => r.direction === "Incoming") || []
  const outgoingReferrals = referrals?.filter((r) => r.direction === "Outgoing") || []

  const handleViewDetails = (referral: any) => {
    openModal(
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Referral Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Patient:</span>
            <p>{referral.patientName}</p>
          </div>
          <div>
            <span className="font-medium">Status:</span>
            <p>{referral.status}</p>
          </div>
          <div>
            <span className="font-medium">Referring Provider:</span>
            <p>{referral.referringProvider || "N/A"}</p>
          </div>
          <div>
            <span className="font-medium">Specialist:</span>
            <p>{referral.specialist || "N/A"}</p>
          </div>
        </div>
        <div>
          <span className="font-medium">Reason for Referral:</span>
          <p className="text-sm text-muted-foreground mt-1">{referral.reason || "No reason specified"}</p>
        </div>
        <div className="flex justify-end">
          <Button onClick={closeModal}>Close</Button>
        </div>
      </div>,
    )
  }

  const handleScheduleReferral = (referral: any) => {
    alert(
      `Scheduling appointment for ${referral.patientName} with ${referral.specialist || referral.referringProvider}`,
    )
  }

  const handleFollowUp = (referral: any) => {
    alert(`Following up on referral for ${referral.patientName}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Referral Management</h1>
        <p className="text-muted-foreground">Manage incoming and outgoing patient referrals</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Incoming Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Referring Provider</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomingReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">{referral.patientName}</TableCell>
                    <TableCell>{referral.referringProvider}</TableCell>
                    <TableCell>
                      <Badge variant={referral.status === "Scheduled" ? "default" : "secondary"}>
                        {referral.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleScheduleReferral(referral)}>
                        Schedule
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outgoing Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Specialist</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outgoingReferrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">{referral.patientName}</TableCell>
                    <TableCell>{referral.specialist}</TableCell>
                    <TableCell>
                      <Badge variant={referral.status === "Pending" ? "secondary" : "default"}>{referral.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => handleFollowUp(referral)}>
                        Follow Up
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
