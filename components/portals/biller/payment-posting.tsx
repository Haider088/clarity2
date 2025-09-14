"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, DollarSign, CheckCircle, AlertCircle } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function BillerPaymentPosting() {
  const { claims, currentPracticeId, updateClaimStatus, addPayment, showToast } = useAppStore()
  const [selectedClaim, setSelectedClaim] = useState<string>("")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [adjustmentAmount, setAdjustmentAmount] = useState("")
  const [adjustmentReason, setAdjustmentReason] = useState("")

  const unpaidClaims = claims.filter((claim) => claim.practiceId === currentPracticeId && claim.status !== "Paid")

  const selectedClaimData = claims.find((claim) => claim.id === selectedClaim)

  const handlePostPayment = () => {
    if (!selectedClaim || !paymentAmount) {
      showToast("Please select a claim and enter payment amount")
      return
    }

    const payment = {
      id: `PAY-${Date.now()}`,
      claimId: selectedClaim,
      amount: Number.parseFloat(paymentAmount),
      method: paymentMethod,
      adjustmentAmount: adjustmentAmount ? Number.parseFloat(adjustmentAmount) : 0,
      adjustmentReason,
      postingDate: new Date().toISOString().split("T")[0],
      practiceId: currentPracticeId,
    }

    addPayment(payment)
    updateClaimStatus(selectedClaim, "Paid")
    showToast("✅ Payment posted successfully")

    // Reset form
    setSelectedClaim("")
    setPaymentAmount("")
    setPaymentMethod("")
    setAdjustmentAmount("")
    setAdjustmentReason("")
  }

  const calculateBalance = () => {
    if (!selectedClaimData || !paymentAmount) return selectedClaimData?.totalAmount || selectedClaimData?.amount || 0
    const payment = Number.parseFloat(paymentAmount) || 0
    const adjustment = Number.parseFloat(adjustmentAmount) || 0
    const total = selectedClaimData.totalAmount || selectedClaimData.amount || 0
    return total - payment - adjustment
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Payment Posting</h1>
        <p className="text-muted-foreground">Post payments and adjustments for submitted claims</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unpaid Claims List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Unpaid Claims ({unpaidClaims.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unpaidClaims.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>All claims have been paid!</p>
                </div>
              ) : (
                unpaidClaims.map((claim) => (
                  <div
                    key={claim.id}
                    onClick={() => setSelectedClaim(claim.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedClaim === claim.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{claim.patientName}</span>
                      <Badge variant={claim.status === "Submitted" ? "default" : "secondary"}>{claim.status}</Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>Claim ID: {claim.id}</div>
                      <div>Service Date: {claim.serviceDate || claim.date}</div>
                      <div>Amount: ${(claim.totalAmount || claim.amount).toLocaleString()}</div>
                      <div>Payer: {claim.payer || claim.client}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Posting Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Post Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {!selectedClaim ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                <p>Select a claim to post payment</p>
              </div>
            ) : (
              <>
                {/* Claim Summary */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Selected Claim</h4>
                  <div className="text-sm space-y-1">
                    <div>Patient: {selectedClaimData?.patientName}</div>
                    <div>Claim ID: {selectedClaimData?.id}</div>
                    <div>Total Billed: ${(selectedClaimData?.totalAmount || selectedClaimData?.amount || 0).toLocaleString()}</div>
                    <div>Payer: {selectedClaimData?.payer || selectedClaimData?.client}</div>
                  </div>
                </div>

                <Separator />

                {/* Payment Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentAmount">Payment Amount *</Label>
                      <Input
                        id="paymentAmount"
                        type="number"
                        step="0.01"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select onValueChange={setPaymentMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="check">Check</SelectItem>
                          <SelectItem value="eft">Electronic Transfer</SelectItem>
                          <SelectItem value="credit-card">Credit Card</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="adjustmentAmount">Adjustment Amount</Label>
                      <Input
                        id="adjustmentAmount"
                        type="number"
                        step="0.01"
                        value={adjustmentAmount}
                        onChange={(e) => setAdjustmentAmount(e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adjustmentReason">Adjustment Reason</Label>
                      <Select onValueChange={setAdjustmentReason}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="contractual">Contractual Adjustment</SelectItem>
                          <SelectItem value="bad-debt">Bad Debt</SelectItem>
                          <SelectItem value="courtesy">Courtesy Adjustment</SelectItem>
                          <SelectItem value="insurance">Insurance Adjustment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Payment Summary */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2 text-green-800">Payment Summary</h4>
                  <div className="text-sm space-y-1 text-green-700">
                    <div className="flex justify-between">
                      <span>Total Billed:</span>
                      <span>${(selectedClaimData?.totalAmount || selectedClaimData?.amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Amount:</span>
                      <span>${paymentAmount || "0.00"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Adjustment:</span>
                      <span>${adjustmentAmount || "0.00"}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Remaining Balance:</span>
                      <span>${calculateBalance().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handlePostPayment} disabled={!paymentAmount} className="w-full">
                  Post Payment
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}