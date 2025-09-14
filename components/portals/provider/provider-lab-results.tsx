"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Calendar, AlertCircle, CheckCircle } from "lucide-react"

const mockLabResults = [
  {
    id: "1",
    patientName: "John Martinez",
    testType: "Complete Blood Count (CBC)",
    orderDate: "2024-01-15",
    resultDate: "2024-01-16",
    status: "Abnormal",
    priority: "High",
    results: "WBC: 12.5 (High), RBC: 4.2 (Normal), Hemoglobin: 13.8 (Normal)",
  },
  {
    id: "2",
    patientName: "Maria Garcia",
    testType: "Lipid Panel",
    orderDate: "2024-01-14",
    resultDate: "2024-01-15",
    status: "Normal",
    priority: "Routine",
    results: "Total Cholesterol: 180, HDL: 55, LDL: 110, Triglycerides: 120",
  },
  {
    id: "3",
    patientName: "Robert Chen",
    testType: "Hemoglobin A1C",
    orderDate: "2024-01-13",
    resultDate: "2024-01-14",
    status: "Abnormal",
    priority: "Medium",
    results: "A1C: 7.2% (Target: <7.0%)",
  },
]

export function ProviderLabResults() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedResult, setSelectedResult] = useState<(typeof mockLabResults)[0] | null>(null)

  const filteredResults = mockLabResults.filter(
    (result) =>
      result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.testType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Normal":
        return "bg-green-100 text-green-800"
      case "Abnormal":
        return "bg-red-100 text-red-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Routine":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Lab Results</h1>
        <p className="text-muted-foreground">Review and manage laboratory test results</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Lab Results ({filteredResults.length})
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by patient name or test type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredResults.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {searchTerm ? "No lab results found matching your search" : "No lab results available"}
              </p>
            ) : (
              filteredResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{result.patientName}</span>
                      <span className="text-sm text-muted-foreground">{result.testType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Ordered: {result.orderDate}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">Result: {result.resultDate}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getPriorityColor(result.priority)}>{result.priority}</Badge>
                    <Badge className={getStatusColor(result.status)}>
                      {result.status === "Normal" ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                      {result.status}
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => setSelectedResult(result)}>
                      View Details
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Result Details Modal would go here */}
      {selectedResult && (
        <Card>
          <CardHeader>
            <CardTitle>Lab Result Details - {selectedResult.patientName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Test Type:</span>
                  <p className="text-muted-foreground">{selectedResult.testType}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <Badge className={getStatusColor(selectedResult.status)}>{selectedResult.status}</Badge>
                </div>
              </div>
              <div>
                <span className="font-medium">Results:</span>
                <p className="text-muted-foreground mt-1">{selectedResult.results}</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedResult(null)}>
                  Close
                </Button>
                <Button>Add to Chart</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
