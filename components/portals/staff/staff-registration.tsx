"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, Save, AlertTriangle, Users, CheckCircle } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function StaffRegistration() {
  const { patients, currentPracticeId, addPatient } = useAppStore()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    insurance: "",
    emergencyContact: "",
    emergencyPhone: "",
    medicalHistory: "",
  })

  const [duplicateAlert, setDuplicateAlert] = useState<{
    show: boolean
    matches: Array<{ name: string; dob: string; phone: string }>
  }>({
    show: false,
    matches: [],
  })

  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  useEffect(() => {
    if (formData.firstName && formData.lastName && formData.dateOfBirth) {
      const practicePatients = patients.filter((p) => p.practiceId === currentPracticeId)

      const potentialDuplicates = practicePatients.filter((patient) => {
        const nameMatch =
          patient.name.toLowerCase().includes(formData.firstName.toLowerCase()) &&
          patient.name.toLowerCase().includes(formData.lastName.toLowerCase())
        const dobMatch = patient.dateOfBirth === formData.dateOfBirth
        const phoneMatch = formData.phone && patient.phone === formData.phone

        return nameMatch || dobMatch || phoneMatch
      })

      if (potentialDuplicates.length > 0) {
        setDuplicateAlert({
          show: true,
          matches: potentialDuplicates.map((p) => ({
            name: p.name,
            dob: p.dateOfBirth,
            phone: p.phone,
          })),
        })
      } else {
        setDuplicateAlert({ show: false, matches: [] })
      }
    } else {
      setDuplicateAlert({ show: false, matches: [] })
    }
  }, [formData.firstName, formData.lastName, formData.dateOfBirth, formData.phone, patients, currentPracticeId])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newPatient = {
      id: `PAT-${Date.now()}`,
      name: `${formData.firstName} ${formData.lastName}`,
      dateOfBirth: formData.dateOfBirth,
      phone: formData.phone,
      email: formData.email,
      address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
      insurance: formData.insurance,
      practiceId: currentPracticeId,
      status: "Active" as const,
      lastVisit: new Date().toISOString().split("T")[0],
      nextAppointment: "",
      problemList: formData.medicalHistory ? [formData.medicalHistory] : [],
      medications: [],
      allergies: [],
      emergencyContact: {
        name: formData.emergencyContact,
        phone: formData.emergencyPhone,
      },
    }

    addPatient(newPatient)

    setRegistrationSuccess(true)

    setTimeout(() => {
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        insurance: "",
        emergencyContact: "",
        emergencyPhone: "",
        medicalHistory: "",
      })
      setRegistrationSuccess(false)
      setDuplicateAlert({ show: false, matches: [] })
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">New Patient Registration</h1>
        <p className="text-muted-foreground">Register a new patient in the system</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {registrationSuccess && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <div className="font-medium">Patient Successfully Registered!</div>
                  <div className="text-sm">
                    {formData.firstName} {formData.lastName} has been added to the system.
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {duplicateAlert.show && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  <div className="space-y-2">
                    <div className="font-medium flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Potential Duplicate Patient Detected
                    </div>
                    <div className="text-sm">
                      Similar patients found in the system. Please verify this is not a duplicate:
                    </div>
                    <div className="space-y-1">
                      {duplicateAlert.matches.map((match, index) => (
                        <div key={index} className="text-sm bg-yellow-100 p-2 rounded border">
                          <div className="font-medium">{match.name}</div>
                          <div className="text-xs text-yellow-700">
                            DOB: {match.dob} | Phone: {match.phone}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm font-medium text-yellow-800">
                      Review existing records before proceeding with registration.
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select onValueChange={(value) => handleInputChange("state", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CA">California</SelectItem>
                      <SelectItem value="NY">New York</SelectItem>
                      <SelectItem value="TX">Texas</SelectItem>
                      <SelectItem value="FL">Florida</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Insurance & Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance Provider</Label>
                  <Input
                    id="insurance"
                    value={formData.insurance}
                    onChange={(e) => handleInputChange("insurance", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Medical History</h3>
              <div className="space-y-2">
                <Label htmlFor="medicalHistory">Medical History & Notes</Label>
                <Textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                  placeholder="Enter any relevant medical history, allergies, or notes..."
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    firstName: "",
                    lastName: "",
                    dateOfBirth: "",
                    phone: "",
                    email: "",
                    address: "",
                    city: "",
                    state: "",
                    zipCode: "",
                    insurance: "",
                    emergencyContact: "",
                    emergencyPhone: "",
                    medicalHistory: "",
                  })
                  setDuplicateAlert({ show: false, matches: [] })
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground" disabled={registrationSuccess}>
                <Save className="h-4 w-4 mr-2" />
                {registrationSuccess ? "Registered!" : "Register Patient"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
