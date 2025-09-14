"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, FileText, AlertCircle } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function PatientIntake() {
  const { showToast, addPatient, currentPracticeId } = useAppStore()
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Insurance Information
    insuranceProvider: "",
    policyNumber: "",
    groupNumber: "",
    subscriberName: "",

    // Medical History
    allergies: "",
    medications: "",
    medicalConditions: "",
    surgicalHistory: "",
    familyHistory: "",

    // Emergency Contact
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelationship: "",

    // Consent
    consentTreatment: false,
    consentPrivacy: false,
    consentCommunication: false,
  })

  const totalSteps = 5
  const progress = (currentStep / totalSteps) * 100

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
        if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
        if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"
        if (!formData.gender) newErrors.gender = "Gender is required"
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email format is invalid"
        break
      case 2:
        if (!formData.address.trim()) newErrors.address = "Address is required"
        if (!formData.city.trim()) newErrors.city = "City is required"
        if (!formData.state.trim()) newErrors.state = "State is required"
        if (!formData.zipCode.trim()) newErrors.zipCode = "ZIP code is required"
        break
      case 5:
        if (!formData.emergencyName.trim()) newErrors.emergencyName = "Emergency contact name is required"
        if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = "Emergency contact phone is required"
        if (!formData.emergencyRelationship.trim()) newErrors.emergencyRelationship = "Relationship is required"
        if (!formData.consentTreatment) newErrors.consentTreatment = "Treatment consent is required"
        if (!formData.consentPrivacy) newErrors.consentPrivacy = "Privacy acknowledgment is required"
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    if (!validateStep(currentStep)) {
      return
    }

    const newPatient = {
      id: `patient_${Date.now()}`,
      name: `${formData.firstName} ${formData.lastName}`,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender,
      phone: formData.phone,
      email: formData.email,
      address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
      insurance: formData.insuranceProvider,
      practiceId: currentPracticeId,
      status: "Active",
      lastVisit: new Date().toISOString().split("T")[0],
      allergies: formData.allergies ? formData.allergies.split(",").map((a) => a.trim()) : [],
      medications: formData.medications ? formData.medications.split(",").map((m) => m.trim()) : [],
      problemList: formData.medicalConditions ? formData.medicalConditions.split(",").map((c) => c.trim()) : [],
      emergencyContact: {
        name: formData.emergencyName,
        phone: formData.emergencyPhone,
        relationship: formData.emergencyRelationship,
      },
      insuranceDetails: {
        provider: formData.insuranceProvider,
        policyNumber: formData.policyNumber,
        groupNumber: formData.groupNumber,
        subscriberName: formData.subscriberName,
      },
    }

    addPatient(newPatient)
    showToast("Intake form submitted successfully! Your information has been saved.")

    // Reset form
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      insuranceProvider: "",
      policyNumber: "",
      groupNumber: "",
      subscriberName: "",
      allergies: "",
      medications: "",
      medicalConditions: "",
      surgicalHistory: "",
      familyHistory: "",
      emergencyName: "",
      emergencyPhone: "",
      emergencyRelationship: "",
      consentTreatment: false,
      consentPrivacy: false,
      consentCommunication: false,
    })
    setCurrentStep(1)
    setErrors({})
  }

  const renderError = (field: string) => {
    if (errors[field]) {
      return (
        <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
          <AlertCircle className="h-3 w-3" />
          {errors[field]}
        </div>
      )
    }
    return null
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {renderError("firstName")}
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {renderError("lastName")}
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
                  className={errors.dateOfBirth ? "border-red-500" : ""}
                />
                {renderError("dateOfBirth")}
              </div>
              <div>
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => updateFormData("gender", value)}>
                  <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                {renderError("gender")}
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {renderError("phone")}
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {renderError("email")}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Address Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
                  className={errors.address ? "border-red-500" : ""}
                />
                {renderError("address")}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => updateFormData("city", e.target.value)}
                    className={errors.city ? "border-red-500" : ""}
                  />
                  {renderError("city")}
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateFormData("state", e.target.value)}
                    className={errors.state ? "border-red-500" : ""}
                  />
                  {renderError("state")}
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code *</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => updateFormData("zipCode", e.target.value)}
                    className={errors.zipCode ? "border-red-500" : ""}
                  />
                  {renderError("zipCode")}
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Insurance Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                <Input
                  id="insuranceProvider"
                  value={formData.insuranceProvider}
                  onChange={(e) => updateFormData("insuranceProvider", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input
                  id="policyNumber"
                  value={formData.policyNumber}
                  onChange={(e) => updateFormData("policyNumber", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="groupNumber">Group Number</Label>
                <Input
                  id="groupNumber"
                  value={formData.groupNumber}
                  onChange={(e) => updateFormData("groupNumber", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="subscriberName">Subscriber Name</Label>
                <Input
                  id="subscriberName"
                  value={formData.subscriberName}
                  onChange={(e) => updateFormData("subscriberName", e.target.value)}
                />
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Medical History</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="allergies">Allergies</Label>
                <Textarea
                  id="allergies"
                  placeholder="List any known allergies (separate with commas)..."
                  value={formData.allergies}
                  onChange={(e) => updateFormData("allergies", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea
                  id="medications"
                  placeholder="List current medications and dosages (separate with commas)..."
                  value={formData.medications}
                  onChange={(e) => updateFormData("medications", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Textarea
                  id="medicalConditions"
                  placeholder="List any chronic conditions or ongoing health issues (separate with commas)..."
                  value={formData.medicalConditions}
                  onChange={(e) => updateFormData("medicalConditions", e.target.value)}
                />
                {formData.medicalConditions.toLowerCase().includes("asthma") && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>AI Suggestion:</strong> To help your provider, please also list any rescue inhalers you
                      use.
                    </p>
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="surgicalHistory">Surgical History</Label>
                <Textarea
                  id="surgicalHistory"
                  placeholder="List any previous surgeries and dates..."
                  value={formData.surgicalHistory}
                  onChange={(e) => updateFormData("surgicalHistory", e.target.value)}
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="emergencyName">Contact Name *</Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyName}
                    onChange={(e) => updateFormData("emergencyName", e.target.value)}
                    className={errors.emergencyName ? "border-red-500" : ""}
                  />
                  {renderError("emergencyName")}
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Contact Phone *</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) => updateFormData("emergencyPhone", e.target.value)}
                    className={errors.emergencyPhone ? "border-red-500" : ""}
                  />
                  {renderError("emergencyPhone")}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="emergencyRelationship">Relationship *</Label>
                  <Input
                    id="emergencyRelationship"
                    value={formData.emergencyRelationship}
                    onChange={(e) => updateFormData("emergencyRelationship", e.target.value)}
                    className={errors.emergencyRelationship ? "border-red-500" : ""}
                  />
                  {renderError("emergencyRelationship")}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Consent & Authorization</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consentTreatment"
                    checked={formData.consentTreatment}
                    onCheckedChange={(checked) => updateFormData("consentTreatment", checked)}
                    className={errors.consentTreatment ? "border-red-500" : ""}
                  />
                  <Label htmlFor="consentTreatment" className="text-sm">
                    I consent to treatment and understand the risks and benefits *
                  </Label>
                </div>
                {renderError("consentTreatment")}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consentPrivacy"
                    checked={formData.consentPrivacy}
                    onCheckedChange={(checked) => updateFormData("consentPrivacy", checked)}
                    className={errors.consentPrivacy ? "border-red-500" : ""}
                  />
                  <Label htmlFor="consentPrivacy" className="text-sm">
                    I acknowledge receipt of the Notice of Privacy Practices *
                  </Label>
                </div>
                {renderError("consentPrivacy")}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="consentCommunication"
                    checked={formData.consentCommunication}
                    onCheckedChange={(checked) => updateFormData("consentCommunication", checked)}
                  />
                  <Label htmlFor="consentCommunication" className="text-sm">
                    I consent to electronic communication for appointment reminders
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Online Intake Form</h1>
        <p className="text-muted-foreground">Complete your medical intake before your appointment</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Step {currentStep} of {totalSteps}
          </CardTitle>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStep()}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2 bg-transparent"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentStep === totalSteps ? (
              <Button onClick={handleSubmit} className="flex items-center gap-2">
                Submit Form
              </Button>
            ) : (
              <Button onClick={nextStep} className="flex items-center gap-2">
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
