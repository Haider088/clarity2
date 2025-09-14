"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { AlertTriangle, Calendar, DollarSign, TrendingUp } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { fakeData } from "@/lib/data"
import { useState } from "react"

export function DenialsView() {
  const { denials, currentPracticeId, openModal, closeModal } = useAppStore()
  const [processingClaim, setProcessingClaim] = useState<string | null>(null)

  const filteredDenials =
    currentPracticeId === "all" ? denials : denials.filter((d) => d.practiceId === currentPracticeId)

  const handleReview = (claimId: string) => {
    setProcessingClaim(claimId)
    // Simulate review process
    setTimeout(() => {
      setProcessingClaim(null)
      alert(`Claim ${claimId} has been reviewed and documentation updated.`)
    }, 1500)
  }

  const handleAppeal = (claimId: string) => {
    setProcessingClaim(claimId)
    // Simulate appeal process
    setTimeout(() => {
      setProcessingClaim(null)
      alert(`Appeal submitted for claim ${claimId}. Expected response in 14-21 business days.`)
    }, 2000)
  }

  const handleDraftAIAppeal = (denial: any) => {
    const appealLetter = `Dear Claims Review Department,

Regarding the denial of claim ${denial.claimId} for patient John Doe due to '${denial.reason}', this letter serves as a formal appeal based on medical necessity and proper documentation.

The services provided were medically necessary and appropriate for the patient's condition. We have reviewed the denial reason and believe there may have been a misunderstanding regarding the documentation or coding.

Please find the following supporting documentation:
- Complete medical records
- Physician notes justifying medical necessity
- Relevant diagnostic codes and procedures

We respectfully request that you reconsider this claim and process payment accordingly. The total amount in question is $${denial.amount.toLocaleString()}.

Thank you for your prompt attention to this matter.

Sincerely,
Clarity Health RCM Team`

    openModal(
      `AI-Generated Appeal Draft for Claim: ${denial.claimId}`,
      <div className="space-y-4">
        <Textarea value={appealLetter} readOnly className="min-h-[300px] text-sm" />
        <div className="flex justify-end space-x-2">
          <Button
            onClick={() => {
              alert("Appeal submitted successfully!")
              closeModal()
            }}
          >
            Submit Appeal
          </Button>
          <Button variant="outline" onClick={closeModal}>
            Close
          </Button>
        </div>
      </div>,
    )
  }

  const denialReasons = [
    { reason: "Missing documentation", count: 3, trend: "+2" },
    { reason: "Prior authorization required", count: 2, trend: "-1" },
    { reason: "Incorrect coding", count: 1, trend: "0" },
  ]

  return (
    <div className="space-y-6">
      {/* Denials Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Denials</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{filteredDenials.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denial Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${filteredDenials.reduce((sum, denial) => sum + denial.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Revenue at risk</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 days</div>
            <p className="text-xs text-muted-foreground">-2 days vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Appeal success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Denial Reasons */}
      <Card>
        <CardHeader>
          <CardTitle>Common Denial Reasons</CardTitle>
          <CardDescription>Most frequent reasons for claim denials this month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {denialReasons.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-destructive">{item.count}</span>
                  </div>
                  <span className="font-medium">{item.reason}</span>
                </div>
                <Badge
                  variant={
                    item.trend.startsWith("+") ? "destructive" : item.trend.startsWith("-") ? "secondary" : "outline"
                  }
                >
                  {item.trend !== "0" && item.trend}
                  {item.trend === "0" && "No change"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Denials Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Denials</CardTitle>
          <CardDescription>Claims requiring attention and follow-up</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredDenials.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">No Denials Found</h3>
              <p className="text-sm text-muted-foreground">
                {currentPracticeId === "all"
                  ? "Great! No claim denials to review at this time."
                  : "No denials found for the selected practice."}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>Practice</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDenials.map((denial) => {
                  const practice = fakeData.practices[denial.practiceId]
                  const isProcessing = processingClaim === denial.claimId
                  return (
                    <TableRow key={denial.id}>
                      <TableCell className="font-mono text-sm">{denial.claimId}</TableCell>
                      <TableCell>John Doe</TableCell>
                      <TableCell>{practice?.name || "Unknown"}</TableCell>
                      <TableCell className="font-medium">${denial.amount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant="destructive" className="text-xs">
                          {denial.reason}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{denial.date}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReview(denial.claimId)}
                            disabled={isProcessing}
                          >
                            {isProcessing ? "Processing..." : "Review"}
                          </Button>
                          <Button size="sm" onClick={() => handleAppeal(denial.claimId)} disabled={isProcessing}>
                            {isProcessing ? "Submitting..." : "Appeal"}
                          </Button>
                          <Button size="sm" onClick={() => handleDraftAIAppeal(denial)} disabled={isProcessing}>
                            Draft AI Appeal
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
