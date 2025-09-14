"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, FileText, Send, Clock, DollarSign } from "lucide-react"
import { useState } from "react"

export function Cms1500Submit() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate submission process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const claimData = {
    claimId: "CLM-2024-001",
    patient: "John Doe",
    dob: "03/15/1985",
    insurance: "Cigna PPO",
    provider: "Dr. Sarah Johnson",
    serviceDate: "01/25/2024",
    codes: [
      { code: "99214", description: "Office visit, established patient", amount: 180.0 },
      { code: "R07.9", description: "Chest pain, unspecified", amount: 0.0 },
    ],
    totalAmount: 180.0,
  }

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <CardTitle className="text-green-900">Claim Successfully Submitted</CardTitle>
            </div>
            <CardDescription className="text-green-700">
              Your CMS-1500 claim has been electronically submitted to the payer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{claimData.claimId}</div>
                <div className="text-sm text-green-700">Claim ID</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">${claimData.totalAmount}</div>
                <div className="text-sm text-green-700">Claim Amount</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">2-5 days</div>
                <div className="text-sm text-green-700">Expected Processing</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>What happens after submission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">1</span>
                </div>
                <div>
                  <p className="font-medium">Electronic Acknowledgment</p>
                  <p className="text-sm text-muted-foreground">Payer confirms receipt within 24 hours</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">2</span>
                </div>
                <div>
                  <p className="font-medium">Claims Processing</p>
                  <p className="text-sm text-muted-foreground">Automated review and adjudication (2-5 days)</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">3</span>
                </div>
                <div>
                  <p className="font-medium">Payment or Denial</p>
                  <p className="text-sm text-muted-foreground">Electronic remittance advice (ERA) received</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Claim Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>CMS-1500 Claim Submission</CardTitle>
              <CardDescription>Review and submit electronic claim to payer</CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              Ready for Submission
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Patient Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name:</span>
                  <span>{claimData.patient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">DOB:</span>
                  <span>{claimData.dob}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Insurance:</span>
                  <span>{claimData.insurance}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Service Information</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider:</span>
                  <span>{claimData.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service Date:</span>
                  <span>{claimData.serviceDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Claim ID:</span>
                  <span className="font-mono">{claimData.claimId}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Procedure Codes */}
      <Card>
        <CardHeader>
          <CardTitle>Procedure Codes & Charges</CardTitle>
          <CardDescription>Billable services and associated charges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {claimData.codes.map((code, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="font-mono">
                    {code.code}
                  </Badge>
                  <span className="text-sm">{code.description}</span>
                </div>
                <div className="font-medium">{code.amount > 0 ? `$${code.amount.toFixed(2)}` : "No charge"}</div>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between text-lg font-semibold">
            <span>Total Claim Amount:</span>
            <span className="flex items-center space-x-1">
              <DollarSign className="w-5 h-5" />
              <span>{claimData.totalAmount.toFixed(2)}</span>
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Pre-submission Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Pre-submission Validation</CardTitle>
          <CardDescription>All requirements verified for successful submission</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              "Patient eligibility verified",
              "Prior authorization obtained",
              "Medical coding validated",
              "Supporting documentation attached",
              "Payer requirements met",
            ].map((check, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">{check}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex space-x-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex-1 flex items-center space-x-2"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Submitting Claim...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit to Payer</span>
                </>
              )}
            </Button>

            <Button variant="outline" size="lg" className="flex items-center space-x-2 bg-transparent">
              <FileText className="w-4 h-4" />
              <span>Save as Draft</span>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-4">
            By submitting, you confirm all information is accurate and complete
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
