"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { TrendingDown, AlertTriangle } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function UnderpaymentAnalysis() {
  const { openModal, closeModal, claims, payments, currentPracticeId, addTask } = useAppStore()

  const practicePayments = (payments || []).filter((p) => p.practiceId === currentPracticeId)
  const practiceClaims = (claims || []).filter((c) => c.practiceId === currentPracticeId)

  const underpaymentClaims = practiceClaims
    .map((claim) => {
      const claimPayments = practicePayments.filter((p) => p.claimId === claim.id)
      const totalPaid = claimPayments.reduce((sum, p) => sum + p.amount, 0)
      const expectedAmount = claim.totalAmount * 0.85 // Assume 85% expected reimbursement rate
      const variance = totalPaid - expectedAmount

      if (variance < -20) {
        // Only show significant underpayments
        return {
          claimId: claim.id,
          patientName: claim.patientName,
          payer: claim.payer,
          billedAmount: claim.totalAmount,
          expectedAmount: Math.round(expectedAmount),
          amountPaid: totalPaid,
          variance: Math.round(variance),
          serviceDate: claim.serviceDate,
        }
      }
      return null
    })
    .filter(Boolean)

  const handleAppeal = (claimId: string) => {
    const claim = underpaymentClaims.find((c) => c.claimId === claimId)
    if (claim) {
      openModal(
        `Appeal Underpayment for ${claimId}`,
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">Underpayment Detected</span>
          </div>
          <p className="text-sm">
            Initiating appeal for underpayment of ${Math.abs(claim.variance)} for patient {claim.patientName}.
          </p>
          <div className="p-3 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Patient:</span>
              <span className="text-sm font-medium">{claim.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Service Date:</span>
              <span className="text-sm">{claim.serviceDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Billed Amount:</span>
              <span className="text-sm">${claim.billedAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Expected Amount:</span>
              <span className="text-sm">${claim.expectedAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Amount Paid:</span>
              <span className="text-sm">${claim.amountPaid}</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span className="text-sm font-medium">Underpayment:</span>
              <span className="text-sm font-medium text-red-600">${Math.abs(claim.variance)}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                const appealTask = {
                  id: `APPEAL-${Date.now()}`,
                  title: `Appeal underpayment for ${claimId}`,
                  description: `Underpayment of $${Math.abs(claim.variance)} from ${claim.payer}`,
                  status: "pending" as const,
                  priority: "high" as const,
                  assignedTo: "Billing Team",
                  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 7 days
                  practiceId: currentPracticeId,
                  createdAt: new Date().toISOString(),
                }
                addTask(appealTask)
                closeModal()
              }}
            >
              Submit Appeal
            </Button>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
        </div>,
      )
    }
  }

  const totalUnderpayment = underpaymentClaims.reduce((sum, claim) => sum + Math.abs(claim.variance), 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Underpayment Analysis</h1>
        <p className="text-muted-foreground">Identify and appeal underpaid claims</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Underpayments</p>
                <p className="text-2xl font-bold text-red-600">${totalUnderpayment}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Claims Requiring Appeal</p>
                <p className="text-2xl font-bold">{underpaymentClaims.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-muted-foreground">Average Underpayment</p>
              <p className="text-2xl font-bold">
                ${underpaymentClaims.length > 0 ? Math.round(totalUnderpayment / underpaymentClaims.length) : 0}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Underpayment Work Queue ({underpaymentClaims.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {underpaymentClaims.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendingDown className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <p>No significant underpayments detected!</p>
              <p className="text-sm">All claims are being reimbursed within expected ranges.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Payer</TableHead>
                  <TableHead>Service Date</TableHead>
                  <TableHead>Billed</TableHead>
                  <TableHead>Expected</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Variance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {underpaymentClaims.map((claim) => (
                  <TableRow key={claim.claimId}>
                    <TableCell className="font-mono text-sm">{claim.claimId}</TableCell>
                    <TableCell>{claim.patientName}</TableCell>
                    <TableCell>{claim.payer}</TableCell>
                    <TableCell>{claim.serviceDate}</TableCell>
                    <TableCell>${claim.billedAmount}</TableCell>
                    <TableCell>${claim.expectedAmount}</TableCell>
                    <TableCell>${claim.amountPaid}</TableCell>
                    <TableCell>
                      <Badge variant="destructive">${claim.variance}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleAppeal(claim.claimId)}>
                        Appeal
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
