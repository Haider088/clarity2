"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, Clock, AlertTriangle, Brain, Zap } from "lucide-react"
import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"

interface CheckItem {
  id: string
  label: string
  status: "pending" | "checking" | "complete" | "action_required"
  description?: string
}

export function AiClaimScrubber() {
  const router = useRouter()
  const { openModal, closeModal } = useAppStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)

  const checkItems: CheckItem[] = [
    {
      id: "patient-eligibility",
      label: "Patient Eligibility Verification",
      status: "pending",
      description: "Verifying active insurance coverage",
    },
    {
      id: "coding-accuracy",
      label: "Medical Coding Accuracy",
      status: "pending",
      description: "Validating ICD-10 and CPT codes",
    },
    {
      id: "documentation",
      label: "Supporting Documentation",
      status: "pending",
      description: "Checking for required clinical notes",
    },
    {
      id: "cigna-policies",
      label: "Cigna Prior Authorization Policies",
      status: "pending",
      description: "Reviewing payer-specific requirements",
    },
    {
      id: "billing-compliance",
      label: "Billing Compliance Check",
      status: "pending",
      description: "Ensuring regulatory compliance",
    },
  ]

  const [checks, setChecks] = useState(checkItems)

  const runClaimScrubberAnimation = async () => {
    setIsRunning(true)
    setProgress(0)

    for (let i = 0; i < checks.length; i++) {
      // Set current item to checking
      setChecks((prev) => prev.map((item, index) => (index === i ? { ...item, status: "checking" } : item)))
      setCurrentStep(i)
      setProgress(((i + 0.5) / checks.length) * 100)

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Special handling for Cigna policies check
      if (checks[i].id === "cigna-policies") {
        setChecks((prev) => prev.map((item, index) => (index === i ? { ...item, status: "action_required" } : item)))
        setProgress(((i + 1) / checks.length) * 100)
        setIsRunning(false)
        return
      }

      // Mark as complete
      setChecks((prev) => prev.map((item, index) => (index === i ? { ...item, status: "complete" } : item)))
      setProgress(((i + 1) / checks.length) * 100)
    }

    setIsRunning(false)
  }

  const handleResolveClick = () => {
    const modalContent = (
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
          <div>
            <p className="text-sm text-foreground mb-2">
              <strong>Prior Authorization Required</strong>
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Cigna requires prior authorization for CPT code 99214 for this patient's plan. The system detected this
              requirement during the automated policy check.
            </p>
            <p className="text-sm text-muted-foreground">
              Do you want to proceed with submission anyway? This may result in a denial.
            </p>
          </div>
        </div>
        <div className="flex space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              closeModal()
              // Could add logic to send to pending queue
            }}
            className="flex-1"
          >
            No, Send to Pending
          </Button>
          <Button
            onClick={() => {
              closeModal()
              router.push("/portal/biller/cms1500-submit")
            }}
            className="flex-1"
          >
            Yes, Continue Submission
          </Button>
        </div>
      </div>
    )

    openModal("Prior Authorization Required", modalContent)
  }

  const getStatusIcon = (status: CheckItem["status"]) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "checking":
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />
      case "action_required":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-muted-foreground" />
    }
  }

  const getStatusBadge = (status: CheckItem["status"]) => {
    switch (status) {
      case "complete":
        return (
          <Badge variant="secondary" className="text-green-600 bg-green-50">
            Passed
          </Badge>
        )
      case "checking":
        return (
          <Badge variant="outline" className="text-blue-600">
            Checking...
          </Badge>
        )
      case "action_required":
        return <Badge variant="destructive">Action Required</Badge>
      default:
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Pending
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-primary" />
            <div>
              <CardTitle>AI Claim Scrubber</CardTitle>
              <CardDescription>Automated pre-submission validation using machine learning algorithms</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Claim ID: CLM-2024-001</span>
            </div>
            <Button onClick={runClaimScrubberAnimation} disabled={isRunning} className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>{isRunning ? "Running Analysis..." : "Run AI Scrubber"}</span>
            </Button>
          </div>

          <Progress value={progress} className="mb-4" />

          <div className="text-sm text-muted-foreground">Progress: {Math.round(progress)}% complete</div>
        </CardContent>
      </Card>

      {/* Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Validation Checklist</CardTitle>
          <CardDescription>Real-time analysis of claim requirements and compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {checks.map((check, index) => (
              <div
                key={check.id}
                className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                  check.status === "checking"
                    ? "bg-blue-50 border-blue-200"
                    : check.status === "complete"
                      ? "bg-green-50 border-green-200"
                      : check.status === "action_required"
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-muted/30"
                }`}
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <div className="font-medium text-foreground">{check.label}</div>
                    <div className="text-sm text-muted-foreground">{check.description}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {getStatusBadge(check.status)}
                  {check.status === "action_required" && (
                    <Button size="sm" onClick={handleResolveClick} variant="outline">
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle>AI Insights</CardTitle>
          <CardDescription>Machine learning recommendations for claim optimization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <Brain className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Coding Optimization</p>
                <p className="text-sm text-blue-700">
                  Consider using modifier -25 with the E/M code to increase reimbursement potential.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Documentation Quality</p>
                <p className="text-sm text-green-700">
                  Clinical documentation supports the selected codes with 95% confidence.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Payer Alert</p>
                <p className="text-sm text-yellow-700">
                  Cigna has updated their prior authorization requirements for this procedure code.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
