"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  DollarSign,
  Users,
  Clock,
  Target,
  BarChart3,
  Calendar,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function PracticeOwnerDashboard() {
  const { openModal, claims, denials, currentPracticeId, appointments, patients } = useAppStore()
  const [animatedROI, setAnimatedROI] = useState(0)
  const router = useRouter()

  const practicesClaims = (claims || []).filter((claim) => claim.practiceId === currentPracticeId)
  const practicesDenials = (denials || []).filter((denial) => denial.practiceId === currentPracticeId)
  const practicesAppointments = (appointments || []).filter((apt) => apt.practiceId === currentPracticeId)
  const practicesPatients = (patients || []).filter((patient) => patient.practiceId === currentPracticeId)

  const totalRevenue = practicesClaims
    .filter((claim) => claim.status === "paid")
    .reduce((sum, claim) => sum + claim.amount, 0)

  const denialRate = practicesClaims.length > 0 ? (practicesDenials.length / practicesClaims.length) * 100 : 0
  const collectionRate =
    practicesClaims.length > 0
      ? (practicesClaims.filter((c) => c.status === "paid").length / practicesClaims.length) * 100
      : 0

  const roiData = {
    monthlyROI: Math.round(totalRevenue * 0.38), // 38% ROI improvement
    percentageIncrease: 23.5,
    comparedToPrevious: "vs previous quarter",
  }

  const kpiMetrics = [
    {
      title: "Monthly Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      change: "+12.3%",
      trend: "up",
      icon: DollarSign,
      description: "Total practice revenue this month",
    },
    {
      title: "Patient Volume",
      value: practicesPatients.length.toString(),
      change: "+8.7%",
      trend: "up",
      icon: Users,
      description: "Active patients seen this month",
    },
    {
      title: "Avg Wait Time",
      value: "12 min",
      change: "-15%",
      trend: "down",
      icon: Clock,
      description: "Average patient wait time",
    },
    {
      title: "Collection Rate",
      value: `${collectionRate.toFixed(1)}%`,
      change: "+2.1%",
      trend: "up",
      icon: Target,
      description: "Percentage of billed amounts collected",
    },
  ]

  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number) => {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const current = start + (end - start) * progress
        setAnimatedROI(Math.round(current))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      animate()
    }

    animateValue(0, roiData.monthlyROI, 2000)
  }, [roiData.monthlyROI])

  const handleSeeBreakdown = () => {
    const modalContent = (
      <div className="space-y-4">
        <div className="text-sm text-muted-foreground mb-4">Detailed ROI calculation for Q1 2024 vs Q4 2023</div>

        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="font-medium text-green-900">Increased Collections</span>
            <span className="font-bold text-green-600">+$28,500</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="font-medium text-blue-900">Reduced Denials</span>
            <span className="font-bold text-blue-600">+$15,200</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
            <span className="font-medium text-purple-900">Faster Processing</span>
            <span className="font-bold text-purple-600">+$8,900</span>
          </div>

          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
            <span className="font-medium text-yellow-900">Operational Efficiency</span>
            <span className="font-bold text-yellow-600">+$6,200</span>
          </div>

          <div className="border-t pt-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total ROI Improvement</span>
              <span className="text-xl font-bold text-primary">${roiData.monthlyROI.toLocaleString()}</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {roiData.percentageIncrease}% increase {roiData.comparedToPrevious}
            </div>
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-lg mt-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> ROI calculations include direct revenue improvements, cost savings from reduced
            manual processes, and efficiency gains from automated workflows.
          </p>
        </div>
      </div>
    )

    openModal("ROI Breakdown Analysis", modalContent)
  }

  const practiceMetrics = [
    {
      label: "Claims Processed",
      value: practicesClaims.length,
      target: 150,
      status: practicesClaims.length >= 120 ? "on-track" : "attention",
    },
    {
      label: "Denial Rate",
      value: Math.round(denialRate),
      target: 5,
      status: denialRate > 5 ? "attention" : "good",
    },
    {
      label: "Patient Satisfaction",
      value: 4.8,
      target: 4.5,
      status: "excellent",
    },
  ]

  const handleViewAnalytics = () => {
    router.push("/portal/practice-admin/analytics-dashboard")
  }

  const handleManageStaff = () => {
    router.push("/portal/practice-admin/staff-management")
  }

  const handleViewSchedule = () => {
    router.push("/portal/staff/staff-schedule")
  }

  return (
    <div className="space-y-6">
      {/* ROI Banner */}
      <Card className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-card-foreground">
                ${animatedROI.toLocaleString()} ROI
              </CardTitle>
              <CardDescription className="text-lg">
                Monthly return on investment from Clarity Health platform
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                <Badge variant="secondary" className="text-green-600 bg-green-50">
                  +{roiData.percentageIncrease}%
                </Badge>
              </div>
              <Button variant="outline" onClick={handleSeeBreakdown} className="text-sm bg-transparent">
                See Breakdown
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-card-foreground">Revenue Growth</div>
              <div className="text-muted-foreground">Compared to {roiData.comparedToPrevious}</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-card-foreground">Cost Reduction</div>
              <div className="text-muted-foreground">Through automation</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-card-foreground">Efficiency Gains</div>
              <div className="text-muted-foreground">Streamlined workflows</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric, index) => {
          const Icon = metric.icon
          const isPositive = metric.trend === "up" || (metric.trend === "down" && metric.title.includes("Wait"))

          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge
                    variant={isPositive ? "secondary" : "destructive"}
                    className={isPositive ? "text-green-600 bg-green-50" : ""}
                  >
                    {metric.change}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Practice Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Practice Performance</CardTitle>
            <CardDescription>Key metrics vs targets for this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {practiceMetrics.map((metric, index) => {
                const percentage =
                  typeof metric.value === "number" && typeof metric.target === "number"
                    ? Math.min((metric.value / metric.target) * 100, 100)
                    : 0

                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{metric.label}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">
                          {typeof metric.value === "number" && metric.label === "Patient Satisfaction"
                            ? `${metric.value}/5.0`
                            : metric.label === "Denial Rate"
                              ? `${metric.value}%`
                              : metric.value}
                        </span>
                        {metric.status === "excellent" && <CheckCircle className="w-4 h-4 text-green-500" />}
                        {metric.status === "attention" && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                      </div>
                    </div>
                    <Progress
                      value={percentage}
                      className={`h-2 ${
                        metric.status === "excellent"
                          ? "bg-green-100"
                          : metric.status === "attention"
                            ? "bg-yellow-100"
                            : ""
                      }`}
                    />
                    <div className="text-xs text-muted-foreground">
                      Target:{" "}
                      {typeof metric.target === "number" && metric.label === "Patient Satisfaction"
                        ? `${metric.target}/5.0`
                        : metric.label === "Denial Rate"
                          ? `<${metric.target}%`
                          : metric.target}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest practice management updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Monthly billing cycle completed</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">New staff member onboarded</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Insurance verification updated</p>
                  <p className="text-xs text-muted-foreground">2 days ago</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Quarterly report generated</p>
                  <p className="text-xs text-muted-foreground">1 week ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <BarChart3 className="w-12 h-12 text-primary mx-auto mb-2" />
            <CardTitle className="text-lg">Analytics Dashboard</CardTitle>
            <CardDescription>View detailed practice analytics</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full bg-transparent" onClick={handleViewAnalytics}>
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <Users className="w-12 h-12 text-secondary mx-auto mb-2" />
            <CardTitle className="text-lg">Staff Management</CardTitle>
            <CardDescription>Manage team and permissions</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full bg-transparent" onClick={handleManageStaff}>
              Manage Staff
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="text-center">
            <Calendar className="w-12 h-12 text-accent mx-auto mb-2" />
            <CardTitle className="text-lg">Schedule Overview</CardTitle>
            <CardDescription>View practice schedule</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button variant="outline" className="w-full bg-transparent" onClick={handleViewSchedule}>
              View Schedule
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
