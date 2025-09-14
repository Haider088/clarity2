"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building2, CheckCircle, Clock, AlertCircle, Users, X, Calendar, FileText, User } from "lucide-react"
import { useState } from "react"

const onboardingPipeline = [
  {
    id: "1",
    practiceName: "Sunset Medical Group",
    stage: "Documentation Review",
    progress: 75,
    status: "In Progress",
    assignee: "Sarah Johnson",
    daysInStage: 3,
    nextAction: "Complete credentialing verification",
  },
  {
    id: "2",
    practiceName: "Valley Health Partners",
    stage: "System Integration",
    progress: 45,
    status: "In Progress",
    assignee: "Mike Chen",
    daysInStage: 7,
    nextAction: "Configure EHR integration",
  },
  {
    id: "3",
    practiceName: "Metro Cardiology Associates",
    stage: "Training & Testing",
    progress: 90,
    status: "Nearly Complete",
    assignee: "Lisa Rodriguez",
    daysInStage: 2,
    nextAction: "Final user acceptance testing",
  },
  {
    id: "4",
    practiceName: "Riverside Family Medicine",
    stage: "Contract Finalization",
    progress: 25,
    status: "Pending",
    assignee: "David Park",
    daysInStage: 12,
    nextAction: "Awaiting legal review",
  },
]

export function BillerOnboarding() {
  const [viewingDetails, setViewingDetails] = useState<string | null>(null)
  const [selectedPractice, setSelectedPractice] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Nearly Complete":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStageIcon = (progress: number) => {
    if (progress >= 90) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (progress >= 50) return <Clock className="h-4 w-4 text-blue-600" />
    return <AlertCircle className="h-4 w-4 text-yellow-600" />
  }

  const handleViewDetails = (practiceId: string, practiceName: string) => {
    setViewingDetails(practiceId)
    const practice = onboardingPipeline.find((p) => p.id === practiceId)

    setTimeout(() => {
      setViewingDetails(null)
      setSelectedPractice(practice)
      setShowModal(true)
    }, 1000)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPractice(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">New Practice Onboarding</h1>
        <p className="text-muted-foreground">Track and manage new practice integration pipeline</p>
      </div>

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Onboardings</p>
                <p className="text-2xl font-bold text-foreground">{onboardingPipeline.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nearly Complete</p>
                <p className="text-2xl font-bold text-foreground">
                  {onboardingPipeline.filter((p) => p.progress >= 90).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg. Days in Pipeline</p>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(
                    onboardingPipeline.reduce((acc, p) => acc + p.daysInStage, 0) / onboardingPipeline.length,
                  )}
                </p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold text-foreground">4</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Onboarding Pipeline Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Onboarding Pipeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {onboardingPipeline.map((practice) => {
              const isViewing = viewingDetails === practice.id
              return (
                <div key={practice.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getStageIcon(practice.progress)}
                      <div>
                        <h3 className="font-semibold text-foreground">{practice.practiceName}</h3>
                        <p className="text-sm text-muted-foreground">{practice.stage}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(practice.status)}>{practice.status}</Badge>
                      <span className="text-sm text-muted-foreground">{practice.daysInStage} days</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{practice.progress}%</span>
                    </div>
                    <Progress value={practice.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Assigned to: </span>
                      <span className="font-medium">{practice.assignee}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(practice.id, practice.practiceName)}
                      disabled={isViewing}
                    >
                      {isViewing ? "Loading..." : "View Details"}
                    </Button>
                  </div>

                  <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                    <span className="font-medium">Next Action: </span>
                    <span className="text-muted-foreground">{practice.nextAction}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal for detailed practice view */}
      {showModal && selectedPractice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedPractice.practiceName}</h2>
                <p className="text-muted-foreground">Onboarding Details</p>
              </div>
              <Button variant="ghost" size="sm" onClick={closeModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-medium">Timeline</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Days in current stage</p>
                    <p className="text-xl font-bold">{selectedPractice.daysInStage} days</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-primary" />
                      <span className="font-medium">Assignee</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Project manager</p>
                    <p className="text-xl font-bold">{selectedPractice.assignee}</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Progress Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{selectedPractice.stage}</span>
                        <span className="text-sm text-muted-foreground">{selectedPractice.progress}%</span>
                      </div>
                      <Progress value={selectedPractice.progress} className="h-3" />
                    </div>
                    <Badge className={getStatusColor(selectedPractice.status)}>{selectedPractice.status}</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Next Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="font-medium text-sm">Immediate Action Required</p>
                      <p className="text-sm text-muted-foreground mt-1">{selectedPractice.nextAction}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-medium text-sm">Upcoming Milestones:</p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Complete documentation review</li>
                        <li>• Schedule training sessions</li>
                        <li>• Finalize system integration</li>
                        <li>• Conduct user acceptance testing</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={closeModal}>
                  Close
                </Button>
                <Button>Update Progress</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
