"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Pill, Save, Star, Heart, TestTube, ArrowRightLeft, Calendar } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function ProviderOrders() {
  const { showToast, patients, currentPracticeId, addOrder, addLabOrder, addReferral } = useAppStore()

  const [orderData, setOrderData] = useState({
    patientName: "",
    patientId: "",
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    refills: "",
    pharmacy: "",
  })

  const [labOrderData, setLabOrderData] = useState({
    patientName: "",
    patientId: "",
    tests: [] as string[],
    priority: "",
    instructions: "",
    fastingRequired: false,
    schedulingNotes: "",
  })

  const [referralData, setReferralData] = useState({
    patientName: "",
    patientId: "",
    specialty: "",
    provider: "",
    reason: "",
    urgency: "",
    notes: "",
    preferredDate: "",
  })

  const practicePatients = patients.filter((p) => p.practiceId === currentPracticeId)

  const [favorites] = useState([
    {
      id: 1,
      name: "Lisinopril 10mg Daily",
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "once-daily",
      duration: "90 days",
      refills: "3",
      instructions: "Take with or without food. Monitor blood pressure regularly.",
    },
    {
      id: 2,
      name: "Metformin 500mg BID",
      medication: "Metformin",
      dosage: "500mg",
      frequency: "twice-daily",
      duration: "90 days",
      refills: "5",
      instructions: "Take with meals to reduce stomach upset. Monitor blood glucose.",
    },
    {
      id: 3,
      name: "Atorvastatin 20mg Evening",
      medication: "Atorvastatin",
      dosage: "20mg",
      frequency: "once-daily",
      duration: "90 days",
      refills: "3",
      instructions: "Take in the evening. Avoid grapefruit juice.",
    },
    {
      id: 4,
      name: "Amoxicillin 500mg TID",
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "three-times-daily",
      duration: "10 days",
      refills: "0",
      instructions: "Take with food. Complete entire course even if feeling better.",
    },
  ])

  const commonLabTests = [
    "Complete Blood Count (CBC)",
    "Basic Metabolic Panel (BMP)",
    "Comprehensive Metabolic Panel (CMP)",
    "Lipid Panel",
    "Thyroid Function Tests (TSH, T3, T4)",
    "Hemoglobin A1C",
    "Liver Function Tests",
    "Urinalysis",
    "Vitamin D",
    "B12 and Folate",
    "PSA (Prostate Specific Antigen)",
    "Inflammatory Markers (ESR, CRP)",
  ]

  const handlePatientSelect = (patientName: string, type: "medication" | "lab" | "referral") => {
    const patient = practicePatients.find((p) => p.name === patientName)
    if (patient) {
      if (type === "medication") {
        setOrderData((prev) => ({ ...prev, patientName, patientId: patient.id }))
      } else if (type === "lab") {
        setLabOrderData((prev) => ({ ...prev, patientName, patientId: patient.id }))
      } else if (type === "referral") {
        setReferralData((prev) => ({ ...prev, patientName, patientId: patient.id }))
      }
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setOrderData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLabInputChange = (field: string, value: string | boolean) => {
    setLabOrderData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLabTestToggle = (test: string, checked: boolean) => {
    setLabOrderData((prev) => ({
      ...prev,
      tests: checked ? [...prev.tests, test] : prev.tests.filter((t) => t !== test),
    }))
  }

  const handleReferralInputChange = (field: string, value: string) => {
    setReferralData((prev) => ({ ...prev, [field]: value }))
  }

  const loadFavorite = (favorite: any) => {
    setOrderData((prev) => ({
      ...prev,
      medication: favorite.medication,
      dosage: favorite.dosage,
      frequency: favorite.frequency,
      duration: favorite.duration,
      refills: favorite.refills,
      instructions: favorite.instructions,
    }))
    showToast(`Loaded favorite: ${favorite.name}`)
  }

  const saveAsFavorite = () => {
    if (!orderData.medication || !orderData.dosage) {
      showToast("Please enter medication and dosage to save as favorite")
      return
    }
    showToast(`Saved "${orderData.medication} ${orderData.dosage}" as favorite`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderData.patientId || !orderData.medication) {
      showToast("Please select a patient and enter medication details")
      return
    }

    const newOrder = {
      id: `rx_${Date.now()}`,
      patientId: orderData.patientId,
      patientName: orderData.patientName,
      type: "prescription" as const,
      medication: orderData.medication,
      dosage: orderData.dosage,
      frequency: orderData.frequency,
      duration: orderData.duration,
      instructions: orderData.instructions,
      refills: Number.parseInt(orderData.refills) || 0,
      pharmacy: orderData.pharmacy,
      status: "pending",
      orderedBy: "current_provider",
      orderedDate: new Date().toISOString().split("T")[0],
    }

    addOrder(newOrder)
    showToast("Prescription sent successfully")

    // Reset form
    setOrderData({
      patientName: "",
      patientId: "",
      medication: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
      refills: "",
      pharmacy: "",
    })
  }

  const handleLabSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!labOrderData.patientId || labOrderData.tests.length === 0) {
      showToast("Please select a patient and at least one lab test")
      return
    }

    const newLabOrder = {
      id: `lab_${Date.now()}`,
      patientId: labOrderData.patientId,
      patientName: labOrderData.patientName,
      type: "lab" as const,
      tests: labOrderData.tests,
      priority: labOrderData.priority || "routine",
      instructions: labOrderData.instructions,
      fastingRequired: labOrderData.fastingRequired,
      schedulingNotes: labOrderData.schedulingNotes,
      status: "pending",
      orderedBy: "current_provider",
      orderedDate: new Date().toISOString().split("T")[0],
    }

    addLabOrder(newLabOrder)
    showToast("Lab order submitted successfully")

    // Reset form
    setLabOrderData({
      patientName: "",
      patientId: "",
      tests: [],
      priority: "",
      instructions: "",
      fastingRequired: false,
      schedulingNotes: "",
    })
  }

  const handleReferralSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!referralData.patientId || !referralData.specialty || !referralData.reason) {
      showToast("Please select a patient, specialty, and provide a reason for referral")
      return
    }

    const newReferral = {
      id: `ref_${Date.now()}`,
      patientId: referralData.patientId,
      patientName: referralData.patientName,
      type: "referral" as const,
      specialty: referralData.specialty,
      provider: referralData.provider,
      reason: referralData.reason,
      urgency: referralData.urgency || "routine",
      notes: referralData.notes,
      preferredDate: referralData.preferredDate,
      status: "pending",
      orderedBy: "current_provider",
      orderedDate: new Date().toISOString().split("T")[0],
    }

    addReferral(newReferral)
    showToast("Referral submitted successfully")

    // Reset form
    setReferralData({
      patientName: "",
      patientId: "",
      specialty: "",
      provider: "",
      reason: "",
      urgency: "",
      notes: "",
      preferredDate: "",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Provider Orders</h1>
        <p className="text-muted-foreground">Create and manage prescriptions, lab orders, and referrals</p>
      </div>

      <Tabs defaultValue="medications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="medications" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            Medications
          </TabsTrigger>
          <TabsTrigger value="labs" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Lab Orders
          </TabsTrigger>
          <TabsTrigger value="referrals" className="flex items-center gap-2">
            <ArrowRightLeft className="h-4 w-4" />
            Referrals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="medications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Order Favorites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {favorites.map((favorite) => (
                  <Button
                    key={favorite.id}
                    variant="outline"
                    className="h-auto p-3 text-left justify-start bg-transparent"
                    onClick={() => loadFavorite(favorite)}
                  >
                    <div className="w-full">
                      <div className="font-medium text-sm">{favorite.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {favorite.frequency} • {favorite.duration}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Pill className="h-5 w-5" />
                    Prescription Details
                  </CardTitle>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={saveAsFavorite}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Heart className="h-4 w-4" />
                    Save as Favorite
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Patient *</Label>
                  <Select
                    value={orderData.patientName}
                    onValueChange={(value) => handlePatientSelect(value, "medication")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {practicePatients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.name}>
                          {patient.name} - DOB: {patient.dateOfBirth}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Medication Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medication">Medication *</Label>
                    <Input
                      id="medication"
                      value={orderData.medication}
                      onChange={(e) => handleInputChange("medication", e.target.value)}
                      placeholder="e.g., Lisinopril"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage *</Label>
                    <Input
                      id="dosage"
                      value={orderData.dosage}
                      onChange={(e) => handleInputChange("dosage", e.target.value)}
                      placeholder="e.g., 10mg"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency *</Label>
                    <Select
                      value={orderData.frequency}
                      onValueChange={(value) => handleInputChange("frequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once-daily">Once daily</SelectItem>
                        <SelectItem value="twice-daily">Twice daily</SelectItem>
                        <SelectItem value="three-times-daily">Three times daily</SelectItem>
                        <SelectItem value="four-times-daily">Four times daily</SelectItem>
                        <SelectItem value="as-needed">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={orderData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      placeholder="e.g., 30 days"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="refills">Number of Refills</Label>
                    <Select value={orderData.refills} onValueChange={(value) => handleInputChange("refills", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select refills" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0 refills</SelectItem>
                        <SelectItem value="1">1 refill</SelectItem>
                        <SelectItem value="2">2 refills</SelectItem>
                        <SelectItem value="3">3 refills</SelectItem>
                        <SelectItem value="5">5 refills</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pharmacy">Preferred Pharmacy</Label>
                    <Input
                      id="pharmacy"
                      value={orderData.pharmacy}
                      onChange={(e) => handleInputChange("pharmacy", e.target.value)}
                      placeholder="e.g., CVS Pharmacy"
                    />
                  </div>
                </div>

                {/* Instructions */}
                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={orderData.instructions}
                    onChange={(e) => handleInputChange("instructions", e.target.value)}
                    placeholder="Enter any special instructions for the patient..."
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary text-primary-foreground">
                    <Save className="h-4 w-4 mr-2" />
                    Send Prescription
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="labs" className="space-y-6">
          <form onSubmit={handleLabSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Laboratory Order
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="labPatientName">Patient *</Label>
                  <Select value={labOrderData.patientName} onValueChange={(value) => handlePatientSelect(value, "lab")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {practicePatients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.name}>
                          {patient.name} - DOB: {patient.dateOfBirth}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label>Laboratory Tests *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {commonLabTests.map((test) => (
                      <div key={test} className="flex items-center space-x-2">
                        <Checkbox
                          id={test}
                          checked={labOrderData.tests.includes(test)}
                          onCheckedChange={(checked) => handleLabTestToggle(test, checked as boolean)}
                        />
                        <Label htmlFor={test} className="text-sm font-normal cursor-pointer">
                          {test}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={labOrderData.priority}
                      onValueChange={(value) => handleLabInputChange("priority", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="stat">STAT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id="fasting"
                      checked={labOrderData.fastingRequired}
                      onCheckedChange={(checked) => handleLabInputChange("fastingRequired", checked as boolean)}
                    />
                    <Label htmlFor="fasting" className="text-sm font-normal cursor-pointer">
                      Fasting Required
                    </Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="labInstructions">Clinical Information & Instructions</Label>
                  <Textarea
                    id="labInstructions"
                    value={labOrderData.instructions}
                    onChange={(e) => handleLabInputChange("instructions", e.target.value)}
                    placeholder="Enter clinical indication and any special instructions..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedulingNotes">Scheduling Notes</Label>
                  <Textarea
                    id="schedulingNotes"
                    value={labOrderData.schedulingNotes}
                    onChange={(e) => handleLabInputChange("schedulingNotes", e.target.value)}
                    placeholder="Any special scheduling requirements or patient preferences..."
                    rows={2}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary text-primary-foreground">
                    <Save className="h-4 w-4 mr-2" />
                    Submit Lab Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <form onSubmit={handleReferralSubmit}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  Specialist Referral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="referralPatientName">Patient *</Label>
                  <Select
                    value={referralData.patientName}
                    onValueChange={(value) => handlePatientSelect(value, "referral")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      {practicePatients.map((patient) => (
                        <SelectItem key={patient.id} value={patient.name}>
                          {patient.name} - DOB: {patient.dateOfBirth}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Specialty *</Label>
                    <Select
                      value={referralData.specialty}
                      onValueChange={(value) => handleReferralInputChange("specialty", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                        <SelectItem value="dermatology">Dermatology</SelectItem>
                        <SelectItem value="endocrinology">Endocrinology</SelectItem>
                        <SelectItem value="gastroenterology">Gastroenterology</SelectItem>
                        <SelectItem value="neurology">Neurology</SelectItem>
                        <SelectItem value="orthopedics">Orthopedics</SelectItem>
                        <SelectItem value="psychiatry">Psychiatry</SelectItem>
                        <SelectItem value="pulmonology">Pulmonology</SelectItem>
                        <SelectItem value="rheumatology">Rheumatology</SelectItem>
                        <SelectItem value="urology">Urology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider">Preferred Provider</Label>
                    <Input
                      id="provider"
                      value={referralData.provider}
                      onChange={(e) => handleReferralInputChange("provider", e.target.value)}
                      placeholder="e.g., Dr. Smith at City Cardiology"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency</Label>
                    <Select
                      value={referralData.urgency}
                      onValueChange={(value) => handleReferralInputChange("urgency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine (2-4 weeks)</SelectItem>
                        <SelectItem value="urgent">Urgent (1-2 weeks)</SelectItem>
                        <SelectItem value="stat">STAT (24-48 hours)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="preferredDate">Preferred Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="preferredDate"
                        type="date"
                        value={referralData.preferredDate}
                        onChange={(e) => handleReferralInputChange("preferredDate", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Referral *</Label>
                  <Textarea
                    id="reason"
                    value={referralData.reason}
                    onChange={(e) => handleReferralInputChange("reason", e.target.value)}
                    placeholder="Enter the clinical reason for this referral..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={referralData.notes}
                    onChange={(e) => handleReferralInputChange("notes", e.target.value)}
                    placeholder="Any additional information for the specialist..."
                    rows={2}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-4">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary text-primary-foreground">
                    <Save className="h-4 w-4 mr-2" />
                    Submit Referral
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  )
}
