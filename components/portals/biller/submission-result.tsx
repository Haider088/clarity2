"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertTriangle, Clock, Download, Eye } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function SubmissionResult() {
  const { openModal, closeModal } = useAppStore()

  const results = [
    {
      claimId: "CLM-2024-001",
      patient: "John Doe",
      amount: 180.0,
      status: "accepted",
      submittedDate: "2024-01-25",
      responseDate: "2024-01-26",
      payerResponse: "Claim accepted for processing",
    },
    {
      claimId: "CLM-2024-002",
      patient: "Jane Smith",
      amount: 250.0,
      status: "pending",
      submittedDate: "2024-01-25",
      responseDate: null,
      payerResponse: "Under review",
    },
    {
      claimId: "CLM-2024-003",
      patient: "Bob Johnson",
      amount: 150.0,
      status: "rejected",
      submittedDate: "2024-01-24",
      responseDate: "2024-01-25",
      payerResponse: "Missing prior authorization",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "rejected":
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return <Badge className="bg-green-100 text-green-800">Accepted</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600">
            Pending
          </Badge>
        )
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return null
    }
  }

  const handleViewDetails = (result: any) => {
    openModal(
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Claim Details - {result.claimId}</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Patient:</span>
            <p>{result.patient}</p>
          </div>
          <div>
            <span className="font-medium">Amount:</span>
            <p>${result.amount.toFixed(2)}</p>
          </div>
          <div>
            <span className="font-medium">Status:</span>
            <p>{result.status}</p>
          </div>
          <div>
            <span className="font-medium">Payer Response:</span>
            <p>{result.payerResponse}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={closeModal}>Close</Button>
        </div>
      </div>,
    )
  }

  const handleResubmit = (result: any) => {
    if (result.status === "rejected") {
      openModal(
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Resubmit Claim - {result.claimId}</h3>
          <p>Are you sure you want to resubmit this claim? Please ensure all issues have been resolved.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                alert(`Claim ${result.claimId} has been resubmitted successfully`)
                closeModal()
              }}
            >
              Resubmit Claim
            </Button>
          </div>
        </div>,
      )
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submission Results</CardTitle>
          <CardDescription>Track the status of your submitted claims</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="font-medium">{result.claimId}</div>
                      <div className="text-sm text-muted-foreground">{result.patient}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">${result.amount.toFixed(2)}</div>
                    {getStatusBadge(result.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Submitted:</span>
                    <div>{result.submittedDate}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Response:</span>
                    <div>{result.responseDate || "Pending"}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div>{result.payerResponse}</div>
                  </div>
                </div>

                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline" onClick={() => handleViewDetails(result)}>
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleResubmit(result)}>
                    <Download className="w-4 h-4 mr-1" />
                    {result.status === "rejected" ? "Resubmit" : "Download ERA"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
