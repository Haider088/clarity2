"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Send, Clock, User, History, TestTube, Pill, FileText } from "lucide-react"
import { useState, useEffect } from "react"
import { useAppStore } from "@/lib/store"

export function SoapNote() {
  const { showToast, patients, currentPracticeId, addEncounter } = useAppStore()
  const [isSaving, setIsSaving] = useState(false)
  const [isSigningFinalizing, setIsSigningFinalizing] = useState(false)
  const [aiScribeEnabled, setAiScribeEnabled] = useState(false)

  const currentPatient = patients.find((p) => p.practiceId === currentPracticeId) || patients[0]

  const [soapData, setSoapData] = useState({
    subjective:
      "Patient reports chest pain and shortness of breath that started this morning. Pain is described as sharp, 7/10 intensity, located in the center of chest. No radiation. Denies nausea, vomiting, or diaphoresis. Has history of anxiety disorder.",
    objective:
      "Vital Signs: BP 128/82, HR 88, RR 16, Temp 98.6°F, O2 Sat 98% on RA\nGeneral: Alert, oriented, appears anxious but in no acute distress\nCardiovascular: Regular rate and rhythm, no murmurs, rubs, or gallops\nRespiratory: Clear to auscultation bilaterally, no wheezes or crackles\nPsychiatric: Anxious affect, appropriate mood",
    assessment:
      "1. Chest pain - likely musculoskeletal vs anxiety-related, low suspicion for cardiac etiology given age and presentation\n2. Anxiety disorder - stable, currently managed",
    plan: "1. Reassurance provided regarding low cardiac risk\n2. Continue current anxiety management\n3. Follow-up in 2 weeks or sooner if symptoms worsen\n4. Return precautions discussed\n5. Consider stress management techniques",
  })

  const patientInfo = {
    name: currentPatient?.name || "John Doe",
    mrn: currentPatient?.id || "MRN001",
    dob: currentPatient?.dateOfBirth || "03/15/1985",
    age: currentPatient?.dateOfBirth
      ? new Date().getFullYear() - new Date(currentPatient.dateOfBirth).getFullYear()
      : 39,
    insurance: currentPatient?.insurance || "Cigna PPO",
    visitDate: new Date().toLocaleDateString(),
    visitType: "Office Visit - Follow-up",
  }

  const clinicalContext = {
    history: currentPatient?.problemList?.map((problem, index) => ({
      date: new Date(Date.now() - index * 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      condition: problem,
      status: "Active",
    })) || [
      { date: "2024-01-15", condition: "Anxiety Disorder", status: "Active" },
      { date: "2023-11-20", condition: "Hypertension", status: "Controlled" },
      { date: "2023-08-10", condition: "Seasonal Allergies", status: "Resolved" },
    ],
    labs: [
      { date: "2024-01-20", test: "Complete Blood Count", result: "Normal", status: "Final" },
      { date: "2024-01-20", test: "Basic Metabolic Panel", result: "Normal", status: "Final" },
      { date: "2023-12-15", test: "Lipid Panel", result: "Elevated LDL", status: "Final" },
    ],
    medications: currentPatient?.medications?.map((med) => ({
      name: med,
      dosage: "As prescribed",
      prescriber: "Dr. Johnson",
      status: "Active",
    })) || [
      { name: "Sertraline 50mg", dosage: "Once daily", prescriber: "Dr. Johnson", status: "Active" },
      { name: "Lisinopril 10mg", dosage: "Once daily", prescriber: "Dr. Smith", status: "Active" },
      { name: "Ibuprofen 400mg", dosage: "As needed", prescriber: "Dr. Johnson", status: "PRN" },
    ],
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (aiScribeEnabled) {
      const transcriptionTexts = [
        " Patient describes symptoms as worsening over the past few days...",
        " Reports difficulty sleeping due to discomfort...",
        " Mentions previous similar episodes that resolved spontaneously...",
        " States current pain level is manageable with rest...",
        " Denies any recent changes in medication or lifestyle...",
      ]

      let textIndex = 0
      interval = setInterval(() => {
        if (textIndex < transcriptionTexts.length) {
          setSoapData((prev) => ({
            ...prev,
            subjective: prev.subjective + transcriptionTexts[textIndex],
          }))
          textIndex++
        } else {
          if (interval) clearInterval(interval)
        }
      }, 3000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [aiScribeEnabled])

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    showToast("SOAP note saved as draft")
  }

  const handleSignFinalize = async () => {
    setIsSigningFinalizing(true)

    const newEncounter = {
      id: `ENC-${Date.now()}`,
      patientId: currentPatient?.id || "PAT-001",
      patientName: currentPatient?.name || "John Doe",
      providerId: "PROV-001",
      providerName: "Dr. Sarah Johnson",
      date: new Date().toISOString().split("T")[0],
      type: "Office Visit",
      status: "Completed" as const,
      subjective: soapData.subjective,
      objective: soapData.objective,
      assessment: soapData.assessment,
      plan: soapData.plan,
      practiceId: currentPracticeId,
      signedAt: new Date().toISOString(),
    }

    // Simulate signing process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    addEncounter(newEncounter)
    setIsSigningFinalizing(false)
    showToast("✅ Note Signed & Saved. Encounter created in patient record.")
  }

  return (
    <div className="flex gap-6">
      {/* Main SOAP Note Content */}
      <div className="flex-1 space-y-6">
        {/* Patient Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle>{patientInfo.name}</CardTitle>
                  <CardDescription>
                    MRN: {patientInfo.mrn} | DOB: {patientInfo.dob} | Age: {patientInfo.age}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <Badge variant="outline" className="mb-1">
                    {patientInfo.visitType}
                  </Badge>
                  <div className="text-sm text-muted-foreground">{patientInfo.visitDate}</div>
                </div>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="ai-scribe" className="text-sm font-medium">
                    AI Ambient Scribe
                  </Label>
                  <Switch id="ai-scribe" checked={aiScribeEnabled} onCheckedChange={setAiScribeEnabled} />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Insurance:</span>
                <div className="font-medium">{patientInfo.insurance}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Provider:</span>
                <div className="font-medium">Dr. Sarah Johnson</div>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <Badge variant="secondary">In Progress</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SOAP Note Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Subjective */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Subjective</CardTitle>
              <CardDescription>Patient's reported symptoms and history</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={soapData.subjective}
                onChange={(e) => setSoapData((prev) => ({ ...prev, subjective: e.target.value }))}
                className="min-h-32"
                placeholder="Patient reports..."
              />
            </CardContent>
          </Card>

          {/* Objective */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Objective</CardTitle>
              <CardDescription>Physical examination findings and vital signs</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={soapData.objective}
                onChange={(e) => setSoapData((prev) => ({ ...prev, objective: e.target.value }))}
                className="min-h-32"
                placeholder="Vital signs, physical exam findings..."
              />
            </CardContent>
          </Card>

          {/* Assessment */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assessment</CardTitle>
              <CardDescription>Clinical impression and diagnosis</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={soapData.assessment}
                onChange={(e) => setSoapData((prev) => ({ ...prev, assessment: e.target.value }))}
                className="min-h-32"
                placeholder="Primary and secondary diagnoses..."
              />
            </CardContent>
          </Card>

          {/* Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Plan</CardTitle>
              <CardDescription>Treatment plan and follow-up instructions</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={soapData.plan}
                onChange={(e) => setSoapData((prev) => ({ ...prev, plan: e.target.value }))}
                className="min-h-32"
                placeholder="Treatment plan, medications, follow-up..."
              />
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex space-x-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                variant="outline"
                className="flex items-center space-x-2 bg-transparent"
              >
                {isSaving ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Draft</span>
                  </>
                )}
              </Button>

              <Button
                onClick={handleSignFinalize}
                disabled={isSigningFinalizing}
                className="flex-1 flex items-center space-x-2"
              >
                {isSigningFinalizing ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Signing & Finalizing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Sign & Finalize</span>
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground mt-4">
              By signing, you confirm the accuracy of this documentation and authorize billing submission.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Clinical Context Sidebar */}
      <div className="w-80 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Clinical Context
            </CardTitle>
            <CardDescription>Patient history and relevant information</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="history" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="history" className="text-xs">
                  <History className="w-4 h-4 mr-1" />
                  History
                </TabsTrigger>
                <TabsTrigger value="labs" className="text-xs">
                  <TestTube className="w-4 h-4 mr-1" />
                  Labs
                </TabsTrigger>
                <TabsTrigger value="meds" className="text-xs">
                  <Pill className="w-4 h-4 mr-1" />
                  Meds
                </TabsTrigger>
              </TabsList>

              <TabsContent value="history" className="space-y-3 mt-4">
                {clinicalContext.history.map((item, index) => (
                  <div key={index} className="border-l-2 border-primary/20 pl-3 pb-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{item.condition}</span>
                      <Badge variant={item.status === "Active" ? "default" : "secondary"} className="text-xs">
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="labs" className="space-y-3 mt-4">
                {clinicalContext.labs.map((lab, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-3 pb-3">
                    <div className="font-medium text-sm">{lab.test}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{lab.result}</span>
                      <Badge variant="outline" className="text-xs">
                        {lab.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{lab.date}</p>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="meds" className="space-y-3 mt-4">
                {clinicalContext.medications.map((med, index) => (
                  <div key={index} className="border-l-2 border-green-200 pl-3 pb-3">
                    <div className="font-medium text-sm">{med.name}</div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">{med.dosage}</span>
                      <Badge variant={med.status === "Active" ? "default" : "secondary"} className="text-xs">
                        {med.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">By {med.prescriber}</p>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
