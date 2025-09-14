"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Award, Target, BarChart3 } from "lucide-react"

const mipsData = {
  overallScore: 87,
  categories: [
    {
      name: "Quality",
      score: 92,
      weight: "45%",
      status: "Excellent",
      measures: [
        { name: "Diabetes HbA1c Control", score: 95, target: 90 },
        { name: "Blood Pressure Control", score: 88, target: 85 },
        { name: "Preventive Care Screening", score: 93, target: 90 },
      ],
    },
    {
      name: "Promoting Interoperability",
      score: 85,
      weight: "25%",
      status: "Good",
      measures: [
        { name: "e-Prescribing", score: 90, target: 85 },
        { name: "Health Information Exchange", score: 80, target: 75 },
      ],
    },
    {
      name: "Improvement Activities",
      score: 90,
      weight: "15%",
      status: "Excellent",
      measures: [
        { name: "Care Coordination", score: 95, target: 90 },
        { name: "Patient Safety", score: 85, target: 80 },
      ],
    },
    {
      name: "Cost",
      score: 78,
      weight: "15%",
      status: "Fair",
      measures: [
        { name: "Total Per Capita Cost", score: 75, target: 80 },
        { name: "Medicare Spending Per Beneficiary", score: 80, target: 85 },
      ],
    },
  ],
}

export function ProviderMips() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent":
        return "bg-green-100 text-green-800"
      case "Good":
        return "bg-blue-100 text-blue-800"
      case "Fair":
        return "bg-yellow-100 text-yellow-800"
      case "Poor":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">MIPS Quality Reporting</h1>
        <p className="text-muted-foreground">Merit-based Incentive Payment System performance tracking</p>
      </div>

      {/* Overall Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Overall MIPS Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">{mipsData.overallScore}</div>
              <div className="text-sm text-muted-foreground">out of 100</div>
            </div>
            <div className="flex-1">
              <Progress value={mipsData.overallScore} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground mt-2">
                <span>0</span>
                <span>Exceptional Performance (85+)</span>
                <span>100</span>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              Exceptional
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mipsData.categories.map((category, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {category.name}
                </CardTitle>
                <Badge className={getStatusColor(category.status)}>{category.status}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                Weight: {category.weight} • Score: {category.score}/100
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={category.score} className="h-2" />

              <div className="space-y-3">
                {category.measures.map((measure, measureIndex) => (
                  <div key={measureIndex} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="text-sm font-medium">{measure.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={measure.score} className="h-1 flex-1" />
                        <span className="text-xs text-muted-foreground">
                          {measure.score}% (Target: {measure.target}%)
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      {measure.score >= measure.target ? (
                        <Badge className="bg-green-100 text-green-800">
                          <Target className="h-3 w-3 mr-1" />
                          Met
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800">Needs Improvement</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
