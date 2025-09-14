"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, Brain, AlertTriangle, Edit3 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"

export function ChargeCapture() {
  const [hoveredCode, setHoveredCode] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [clinicalNote, setClinicalNote] = useState(`Patient presents with chest pain and shortness of breath. 
  Comprehensive examination performed including cardiovascular and respiratory assessment. 
  Patient has history of anxiety disorder. Discussed treatment options and provided reassurance. 
  Follow-up scheduled in 2 weeks.`)
  const router = useRouter()
  const { openModal, closeModal, addClaim, currentPracticeId } = useAppStore()

  const suggestedCodes = [
    {
      code: "99214",
      description: "Office visit, established patient, moderate complexity",
      confidence: 95,
      reasoning: "Comprehensive examination with moderate medical decision making",
    },
    {
      code: "R07.9",
      description: "Chest pain, unspecified",
      confidence: 88,
      reasoning: "Primary presenting symptom documented in chief complaint",
    },
    {
      code: "G47.00",
      description: "Insomnia, unspecified",
      confidence: 45,
      reasoning: "AI detected potential sleep-related concerns",
      isAmbiguous: true,
    },
  ]

  const highlightText = (text: string, code: string) => {
    if (!hoveredCode || hoveredCode !== code) return text

    const highlights: Record<string, string[]> = {
      "99214": ["Comprehensive examination", "treatment options"],
      "R07.9": ["chest pain", "shortness of breath"],
      "G47.00": ["anxiety"],
    }

    let highlightedText = text
    const terms = highlights[code] || []

    terms.forEach((term) => {
      const regex = new RegExp(`(${term})`, "gi")
      highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
    })

    return highlightedText
  }

  const handleAcceptAllCodes = () => {
    const newClaim = {
      id: `CLM-${Date.now()}`,
      patientName: "John Doe",
      patientId: "PAT-001",
      serviceDate: new Date().toISOString().split("T")[0],
      dateOfService: new Date().toISOString().split("T")[0],
      provider: "Dr. Smith",
      client: "Blue Cross Blue Shield",
      payer: "Blue Cross Blue Shield",
      codes: suggestedCodes.map((code) => ({
        code: code.code,
        description: code.description,
        amount: code.code === "99214" ? 250 : code.code === "R07.9" ? 75 : 50,
      })),
      totalAmount: 375,
      amount: 375,
      status: "Submitted" as const,
      practiceId: currentPracticeId,
      submissionDate: new Date().toISOString().split("T")[0],
      claimType: "Professional",
    }

    addClaim(newClaim)

    openModal(
      "Codes Accepted Successfully",
      <div className="space-y-4">
        <p className="text-green-600 font-medium">✅ Claim created successfully!</p>
        <div className="space-y-2">
          <p className="text-sm">Claim ID: {newClaim.id}</p>
          <p className="text-sm">Total Amount: ${newClaim.totalAmount}</p>
          <p className="text-sm">Status: {newClaim.status}</p>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => {
              closeModal()
              router.push("/portal/biller/ai-scrubber")
            }}
          >
            Continue to AI Scrubber
          </Button>
        </div>
      </div>,
    )
  }

  const handleReviewAndEdit = () => {
    openModal(
      "Code Review Interface",
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">Review and modify individual codes before submission:</p>
        {suggestedCodes.map((code, index) => (
          <div key={index} className="p-3 border rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold">{code.code}</span>
              <Button size="sm" variant="outline">
                Edit
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{code.description}</p>
          </div>
        ))}
        <div className="flex justify-end gap-2">
          <Button
            onClick={() => {
              handleAcceptAllCodes()
            }}
          >
            Submit Reviewed Codes
          </Button>
          <Button variant="outline" onClick={closeModal}>
            Cancel
          </Button>
        </div>
      </div>,
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Clinical Note */}
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Clinical Documentation</CardTitle>
              <CardDescription>Patient: John Doe | Date: January 25, 2024</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              <Edit3 className="w-4 h-4" />
              {isEditing ? "Save" : "Edit"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">CHIEF COMPLAINT</h4>
              {isEditing ? (
                <Textarea
                  value={clinicalNote}
                  onChange={(e) => setClinicalNote(e.target.value)}
                  className="min-h-[120px] text-sm leading-relaxed"
                  placeholder="Enter clinical documentation..."
                />
              ) : (
                <div
                  className="text-sm leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(clinicalNote, hoveredCode || ""),
                  }}
                />
              )}
            </div>

            <Separator />

            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">ASSESSMENT & PLAN</h4>
              <div className="text-sm leading-relaxed text-muted-foreground">
                1. Chest pain - likely musculoskeletal, reassurance provided
                <br />
                2. Anxiety disorder - continue current management
                <br />
                3. Follow-up in 2 weeks or sooner if symptoms worsen
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Code Analysis */}
      <Card className="flex flex-col">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <CardTitle>AI Code Analysis</CardTitle>
          </div>
          <CardDescription>Intelligent coding suggestions based on clinical documentation</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <TooltipProvider>
            {suggestedCodes.map((suggestion, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  suggestion.isAmbiguous ? "border-yellow-200 bg-yellow-50" : "border-border bg-card hover:bg-muted/50"
                }`}
                onMouseEnter={() => setHoveredCode(suggestion.code)}
                onMouseLeave={() => setHoveredCode(null)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-mono font-bold text-primary">{suggestion.code}</span>
                      <Badge variant={suggestion.isAmbiguous ? "destructive" : "secondary"}>
                        {suggestion.confidence}% confidence
                      </Badge>
                      {suggestion.isAmbiguous && <AlertTriangle className="w-4 h-4 text-yellow-600" />}
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">{suggestion.description}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.reasoning}</p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="p-1">
                        <HelpCircle className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        {suggestion.isAmbiguous
                          ? "This code has low confidence. Review documentation for accuracy."
                          : "High confidence suggestion based on documented symptoms and procedures."}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            ))}
          </TooltipProvider>

          <Separator />

          <div className="flex space-x-2">
            <Button className="flex-1" onClick={handleAcceptAllCodes}>
              Accept All Codes
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent" onClick={handleReviewAndEdit}>
              Review & Edit
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Hover over codes to highlight relevant text in the clinical note
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
