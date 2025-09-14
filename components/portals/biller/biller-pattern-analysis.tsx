"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, AlertTriangle, CheckCircle, BarChart3 } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export function BillerPatternAnalysis() {
  const [isInvestigating, setIsInvestigating] = useState(false)
  const [showingDetails, setShowingDetails] = useState(false)
  const { showToast } = useAppStore()

  const handleInvestigatePattern = async () => {
    setIsInvestigating(true)

    // Simulate AI investigation process
    await new Promise((resolve) => setTimeout(resolve, 2500))

    setIsInvestigating(false)
    showToast("🔍 Pattern Investigation Complete - AI analysis reveals Aetna updated documentation requirements for 99213 on Dec 1st. Recommendation: Update templates to include required elements.")
  }

  const handleViewDetails = () => {
    setShowingDetails(!showingDetails)
    if (!showingDetails) {
      showToast("📊 Detailed Analysis - Showing comprehensive pattern breakdown and historical trends.")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AI Pattern Analysis</h1>
        <p className="text-muted-foreground">Intelligent insights and learning progress</p>
      </div>

      {/* AI Pattern Detection Alert */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="h-5 w-5" />
            AI Pattern Detection Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Brain className="h-5 w-5 text-orange-600 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold text-orange-800">Unusual Denial Pattern Detected</h3>
                <p className="text-orange-700 text-sm mt-1">
                  Our AI has identified an unusual increase in denials for CPT code 99213 from Aetna. This pattern
                  suggests a potential policy change or documentation requirement update.
                </p>
                <div className="flex gap-2 mt-3">
                  <Button
                    size="sm"
                    className="bg-orange-600 text-white hover:bg-orange-700"
                    onClick={handleInvestigatePattern}
                    disabled={isInvestigating}
                  >
                    {isInvestigating ? "Investigating..." : "Investigate Pattern"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-orange-300 text-orange-700 bg-transparent"
                    onClick={handleViewDetails}
                  >
                    {showingDetails ? "Hide Details" : "View Details"}
                  </Button>
                </div>
              </div>
            </div>

            {showingDetails && (
              <div className="mt-4 p-4 bg-white rounded-lg border border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-3">Detailed Pattern Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-orange-700">Affected Claims:</p>
                    <p className="text-orange-600">12 denials in past 7 days</p>
                  </div>
                  <div>
                    <p className="font-medium text-orange-700">Historical Average:</p>
                    <p className="text-orange-600">2-3 denials per week</p>
                  </div>
                  <div>
                    <p className="font-medium text-orange-700">Denial Reason:</p>
                    <p className="text-orange-600">"Insufficient documentation"</p>
                  </div>
                  <div>
                    <p className="font-medium text-orange-700">Confidence Level:</p>
                    <p className="text-orange-600">94% pattern match</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Learning Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            AI Learning Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">94%</div>
              <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              <Badge className="bg-green-100 text-green-800 mt-2">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.3% this month
              </Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">1,247</div>
              <div className="text-sm text-muted-foreground">Claims Processed</div>
              <Badge className="bg-blue-100 text-blue-800 mt-2">This Week</Badge>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">87%</div>
              <div className="text-sm text-muted-foreground">Auto-Resolution Rate</div>
              <Badge className="bg-green-100 text-green-800 mt-2">
                <CheckCircle className="h-3 w-3 mr-1" />
                Target: 85%
              </Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Denial Pattern Recognition</span>
                <span className="text-muted-foreground">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Code Optimization Suggestions</span>
                <span className="text-muted-foreground">88%</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Payer Policy Adaptation</span>
                <span className="text-muted-foreground">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Documentation Quality Assessment</span>
                <span className="text-muted-foreground">90%</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Recent AI Improvements</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Enhanced Medicare Advantage plan recognition
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Improved modifier usage suggestions
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Updated ICD-10 code mapping accuracy
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
