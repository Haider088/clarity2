"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"

export function FinancialClearance() {
  const [formData, setFormData] = useState({
    patientName: "",
    cptCodes: "",
  })
  const [showEstimate, setShowEstimate] = useState(false)

  const handleGenerateEstimate = () => {
    if (formData.patientName && formData.cptCodes) {
      setShowEstimate(true)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Clearance / Patient Estimate</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                value={formData.patientName}
                onChange={(e) => setFormData((prev) => ({ ...prev, patientName: e.target.value }))}
                placeholder="Enter patient name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cptCodes">CPT Code(s)</Label>
              <Input
                id="cptCodes"
                value={formData.cptCodes}
                onChange={(e) => setFormData((prev) => ({ ...prev, cptCodes: e.target.value }))}
                placeholder="Enter CPT codes (e.g., 99213, 90834)"
              />
            </div>
          </div>
          <Button onClick={handleGenerateEstimate} className="w-full">
            Generate Estimate
          </Button>
        </CardContent>
      </Card>

      {showEstimate && (
        <Card>
          <CardHeader>
            <CardTitle>Good Faith Estimate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Service Cost:</span>
              <span className="font-medium">$500</span>
            </div>
            <div className="flex justify-between">
              <span>Patient's Plan Coverage:</span>
              <span className="font-medium text-green-600">-$350</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining Deductible:</span>
              <span className="font-medium">$50</span>
            </div>
            <hr />
            <div className="flex justify-between text-lg font-bold">
              <span>Estimated Patient Responsibility:</span>
              <span className="text-primary">$200</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
