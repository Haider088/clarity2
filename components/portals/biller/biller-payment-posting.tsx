"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function BillerPaymentPosting() {
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const { showToast } = useAppStore()

  const aetnaEraData = [
    { claimId: "CLM-2024-001", patientName: "Sarah Johnson", amount: 250.0, allowedAmount: 200.0, adjustment: 50.0 },
    { claimId: "CLM-2024-002", patientName: "Michael Chen", amount: 180.0, allowedAmount: 180.0, adjustment: 0.0 },
    { claimId: "CLM-2024-003", patientName: "Emily Davis", amount: 320.0, allowedAmount: 280.0, adjustment: 40.0 },
  ]

  const cignaEraData = [
    { claimId: "CLM-2024-004", patientName: "Robert Wilson", amount: 450.0, allowedAmount: 400.0, adjustment: 50.0 },
    { claimId: "CLM-2024-005", patientName: "Lisa Anderson", amount: 275.0, allowedAmount: 275.0, adjustment: 0.0 },
    { claimId: "CLM-2024-006", patientName: "David Martinez", amount: 380.0, allowedAmount: 320.0, adjustment: 60.0 },
    { claimId: "CLM-2024-007", patientName: "Jennifer Taylor", amount: 195.0, allowedAmount: 195.0, adjustment: 0.0 },
  ]

  const handleAutoPost = async (eraType: string) => {
    setIsProcessing(eraType)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsProcessing(null)
    const count = eraType === "aetna" ? aetnaEraData.length : cignaEraData.length
    showToast(`✅ Payments Posted Successfully - AI has automatically posted ${count} ${eraType.toUpperCase()} payments with 100% accuracy.`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payment Posting</h1>
        <p className="text-muted-foreground">Process Electronic Remittance Advice (ERA)</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Unposted ERA - Aetna</CardTitle>
            <p className="text-sm text-muted-foreground">Received: Today, 2:30 PM</p>
          </div>
          <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Billed Amount</TableHead>
                <TableHead>Allowed Amount</TableHead>
                <TableHead>Adjustment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aetnaEraData.map((item) => (
                <TableRow key={item.claimId}>
                  <TableCell className="font-medium">{item.claimId}</TableCell>
                  <TableCell>{item.patientName}</TableCell>
                  <TableCell>${item.amount.toFixed(2)}</TableCell>
                  <TableCell>${item.allowedAmount.toFixed(2)}</TableCell>
                  <TableCell>${item.adjustment.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => handleAutoPost("aetna")}
              disabled={isProcessing === "aetna"}
              className="bg-primary hover:bg-primary/90"
            >
              {isProcessing === "aetna" ? "Processing..." : "AI Auto-Post"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Unposted ERA - Cigna</CardTitle>
            <p className="text-sm text-muted-foreground">Received: Today, 1:15 PM</p>
          </div>
          <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Claim ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Billed Amount</TableHead>
                <TableHead>Allowed Amount</TableHead>
                <TableHead>Adjustment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cignaEraData.map((item) => (
                <TableRow key={item.claimId}>
                  <TableCell className="font-medium">{item.claimId}</TableCell>
                  <TableCell>{item.patientName}</TableCell>
                  <TableCell>${item.amount.toFixed(2)}</TableCell>
                  <TableCell>${item.allowedAmount.toFixed(2)}</TableCell>
                  <TableCell>${item.adjustment.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end pt-4">
            <Button
              onClick={() => handleAutoPost("cigna")}
              disabled={isProcessing === "cigna"}
              className="bg-primary hover:bg-primary/90"
            >
              {isProcessing === "cigna" ? "Processing..." : "AI Auto-Post"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
