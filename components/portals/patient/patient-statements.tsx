"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Download, CreditCard, Calendar, DollarSign, Search, Lightbulb } from "lucide-react"
import { useAppStore } from "@/lib/store"

const mockStatements = [
  {
    id: "1",
    statementDate: "2024-01-15",
    serviceDate: "2024-01-10",
    description: "Annual Physical Exam",
    provider: "Dr. Sarah Johnson",
    totalAmount: 350.0,
    insurancePaid: 280.0,
    patientResponsibility: 70.0,
    status: "Outstanding",
    dueDate: "2024-02-15",
  },
  {
    id: "2",
    statementDate: "2024-01-08",
    serviceDate: "2024-01-05",
    description: "Lab Work - Blood Panel",
    provider: "Quest Diagnostics",
    totalAmount: 125.0,
    insurancePaid: 100.0,
    patientResponsibility: 25.0,
    status: "Paid",
    dueDate: "2024-02-08",
  },
  {
    id: "3",
    statementDate: "2023-12-20",
    serviceDate: "2023-12-15",
    description: "Follow-up Visit",
    provider: "Dr. Michael Chen",
    totalAmount: 200.0,
    insurancePaid: 160.0,
    patientResponsibility: 40.0,
    status: "Paid",
    dueDate: "2024-01-20",
  },
  {
    id: "4",
    statementDate: "2023-12-10",
    serviceDate: "2023-12-05",
    description: "Prescription Refill Consultation",
    provider: "Dr. Sarah Johnson",
    totalAmount: 150.0,
    insurancePaid: 120.0,
    patientResponsibility: 30.0,
    status: "Outstanding",
    dueDate: "2024-01-10",
  },
]

export function PatientStatements() {
  const [searchTerm, setSearchTerm] = useState("")
  const { openModal, closeModal } = useAppStore()

  const filteredStatements = mockStatements.filter(
    (statement) =>
      statement.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      statement.provider.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800"
      case "Outstanding":
        return "bg-red-100 text-red-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleExplainBill = (statement: any) => {
    const explanation = `You visited ${statement.provider} for ${statement.description.toLowerCase()}. Your insurance, Cigna, covered $${statement.insurancePaid} of the $${statement.totalAmount} total cost. The remaining $${statement.patientResponsibility} is your responsibility based on your plan's co-insurance. This amount includes your deductible and the portion your insurance plan requires you to pay for this type of service.`

    openModal(
      `Explanation for Your Statement on ${statement.statementDate}`,
      <div className="space-y-4">
        <p className="text-sm leading-relaxed">{explanation}</p>
        <div className="flex justify-end">
          <Button onClick={closeModal}>Close</Button>
        </div>
      </div>,
    )
  }

  const handleDownloadPDF = (statement: any) => {
    // Implement PDF download logic here
    console.log(`Downloading PDF for statement ${statement.id}`)
  }

  const outstandingBalance = mockStatements
    .filter((s) => s.status === "Outstanding")
    .reduce((sum, s) => sum + s.patientResponsibility, 0)

  const totalPaid = mockStatements
    .filter((s) => s.status === "Paid")
    .reduce((sum, s) => sum + s.patientResponsibility, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Billing Statements</h1>
        <p className="text-muted-foreground">View and manage your medical bills and payments</p>
      </div>

      {/* Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Outstanding Balance</p>
                <p className="text-2xl font-bold text-red-600">${outstandingBalance.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Paid This Year</p>
                <p className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Statements</p>
                <p className="text-2xl font-bold text-foreground">{mockStatements.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outstanding Bills Alert */}
      {outstandingBalance > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-800">
              <DollarSign className="h-5 w-5" />
              Outstanding Balance: ${outstandingBalance.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 text-sm mb-3">
              You have outstanding bills that require payment. Click below to pay online or set up a payment plan.
            </p>
            <div className="flex gap-2">
              <Button className="bg-red-600 text-white hover:bg-red-700">
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Now
              </Button>
              <Button variant="outline" className="border-red-300 text-red-700 bg-transparent">
                Set Up Payment Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statements List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            All Statements ({filteredStatements.length})
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search statements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStatements.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {searchTerm ? "No statements found matching your search" : "No statements available"}
              </p>
            ) : (
              filteredStatements.map((statement) => (
                <div key={statement.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{statement.description}</h3>
                      <p className="text-sm text-muted-foreground">{statement.provider}</p>
                    </div>
                    <Badge className={getStatusColor(statement.status)}>{statement.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                    <div>
                      <span className="font-medium">Service Date:</span>
                      <p className="text-muted-foreground">{statement.serviceDate}</p>
                    </div>
                    <div>
                      <span className="font-medium">Total Amount:</span>
                      <p className="text-muted-foreground">${statement.totalAmount.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Insurance Paid:</span>
                      <p className="text-muted-foreground">${statement.insurancePaid.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="font-medium">Your Responsibility:</span>
                      <p className="font-semibold text-foreground">${statement.patientResponsibility.toFixed(2)}</p>
                    </div>
                  </div>

                  {statement.status === "Outstanding" && (
                    <div className="mb-3 p-2 bg-red-50 rounded text-sm">
                      <div className="flex items-center gap-1 text-red-700">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Due Date: {statement.dueDate}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleDownloadPDF(statement)}>
                      <Download className="h-4 w-4 mr-1" />
                      Download PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleExplainBill(statement)}>
                      <Lightbulb className="h-4 w-4 mr-1" />
                      Explain My Bill
                    </Button>
                    {statement.status === "Outstanding" && (
                      <Button size="sm" className="bg-primary text-primary-foreground">
                        <CreditCard className="h-4 w-4 mr-1" />
                        Pay ${statement.patientResponsibility.toFixed(2)}
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
