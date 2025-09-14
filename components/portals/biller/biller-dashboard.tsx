"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, FileText, Users, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { fakeData } from "@/lib/data"
import { useEffect, useState } from "react"
import Link from "next/link"

export function BillerDashboard() {
  const { currentPracticeId, claims, denials, uncoded_encounters } = useAppStore()
  const [animatedMetrics, setAnimatedMetrics] = useState({
    claimsToday: 0,
    practicesManaged: 0,
    totalRevenue: 0,
    efficiency: 0,
  })

  // Calculate metrics based on current practice filter
  const filteredClaims =
    currentPracticeId === "all" ? claims || [] : (claims || []).filter((c) => c.practiceId === currentPracticeId)
  const filteredDenials =
    currentPracticeId === "all" ? denials || [] : (denials || []).filter((d) => d.practiceId === currentPracticeId)
  const filteredUncoded =
    currentPracticeId === "all"
      ? uncoded_encounters || []
      : (uncoded_encounters || []).filter((u) => u.practiceId === currentPracticeId)

  const metrics = {
    claimsToday: filteredClaims.length,
    practicesManaged: currentPracticeId === "all" ? Object.keys(fakeData.practices).length : 1,
    totalRevenue: filteredClaims.reduce((sum, claim) => sum + claim.amount, 0),
    efficiency: Math.round(
      ((filteredClaims.length - filteredDenials.length) / Math.max(filteredClaims.length, 1)) * 100,
    ),
  }

  // Animate metrics when they change
  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number, callback: (value: number) => void) => {
      const startTime = Date.now()
      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const current = start + (end - start) * progress
        callback(Math.round(current))
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      animate()
    }

    animateValue(animatedMetrics.claimsToday, metrics.claimsToday, 800, (value) =>
      setAnimatedMetrics((prev) => ({ ...prev, claimsToday: value })),
    )
    animateValue(animatedMetrics.practicesManaged, metrics.practicesManaged, 600, (value) =>
      setAnimatedMetrics((prev) => ({ ...prev, practicesManaged: value })),
    )
    animateValue(animatedMetrics.totalRevenue, metrics.totalRevenue, 1000, (value) =>
      setAnimatedMetrics((prev) => ({ ...prev, totalRevenue: value })),
    )
    animateValue(animatedMetrics.efficiency, metrics.efficiency, 900, (value) =>
      setAnimatedMetrics((prev) => ({ ...prev, efficiency: value })),
    )
  }, [metrics.claimsToday, metrics.practicesManaged, metrics.totalRevenue, metrics.efficiency])

  const teamMembers = [
    { name: "Sarah Johnson", role: "Senior Biller", status: "active", claims: 12 },
    { name: "Mike Chen", role: "Claims Specialist", status: "active", claims: 8 },
    { name: "Lisa Rodriguez", role: "Denial Manager", status: "break", claims: 15 },
    { name: "David Kim", role: "Coding Specialist", status: "active", claims: 10 },
  ]

  return (
    <div className="space-y-6">
      {/* Efficiency Banner */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-card-foreground">
                {animatedMetrics.efficiency}% Efficiency Rate
              </CardTitle>
              <CardDescription className="text-lg">
                {currentPracticeId === "all" ? "All Practices" : fakeData.practices[currentPracticeId]?.name}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-8 h-8 text-primary" />
              <Badge variant="secondary" className="text-sm">
                +5.2% vs last month
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={animatedMetrics.efficiency} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            {filteredClaims.length - filteredDenials.length} successful claims out of {filteredClaims.length} total
          </p>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claims Today</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{animatedMetrics.claimsToday}</div>
            <p className="text-xs text-muted-foreground">+12% from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Practices Managed</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{animatedMetrics.practicesManaged}</div>
            <p className="text-xs text-muted-foreground">Active practices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${animatedMetrics.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Items</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredUncoded.length + filteredDenials.length}</div>
            <p className="text-xs text-muted-foreground">
              {filteredUncoded.length} uncoded, {filteredDenials.length} denials
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Team Status Widget */}
      <Card>
        <CardHeader>
          <CardTitle>Team Status</CardTitle>
          <CardDescription>Current activity and performance of billing team members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {member.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{member.name}</div>
                    <div className="text-sm text-muted-foreground">{member.role}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-medium">{member.claims} claims</div>
                    <div className="text-xs text-muted-foreground">today</div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {member.status === "active" ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-green-600">Active</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-yellow-600">On Break</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/portal/biller/charge-capture">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <FileText className="w-12 h-12 text-primary mx-auto mb-2" />
              <CardTitle className="text-lg">Process Charges</CardTitle>
              <CardDescription>Review and code pending charges</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Badge variant="secondary">{filteredUncoded.length} pending</Badge>
            </CardContent>
          </Card>
        </Link>

        <Link href="/portal/biller/denials">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-2" />
              <CardTitle className="text-lg">Review Denials</CardTitle>
              <CardDescription>Address claim denials and appeals</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Badge variant="destructive">{filteredDenials.length} denials</Badge>
            </CardContent>
          </Card>
        </Link>

        <Link href="/portal/biller/pattern-analysis">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <TrendingUp className="w-12 h-12 text-secondary mx-auto mb-2" />
              <CardTitle className="text-lg">View Reports</CardTitle>
              <CardDescription>Analyze performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Badge variant="outline">Available</Badge>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
