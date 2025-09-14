"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, DollarSign, Clock, Users } from "lucide-react"

export function SavingsView() {
  const savingsData = [
    {
      category: "Automated Claim Processing",
      monthlySavings: 12500,
      annualSavings: 150000,
      description: "Reduced manual claim review time by 85%",
    },
    {
      category: "Denial Prevention",
      monthlySavings: 8200,
      annualSavings: 98400,
      description: "AI-powered pre-submission validation",
    },
    {
      category: "Staff Efficiency",
      monthlySavings: 6800,
      annualSavings: 81600,
      description: "Streamlined workflows and automation",
    },
    {
      category: "Compliance Management",
      monthlySavings: 3500,
      annualSavings: 42000,
      description: "Automated regulatory compliance checks",
    },
  ]

  const totalMonthlySavings = savingsData.reduce((sum, item) => sum + item.monthlySavings, 0)
  const totalAnnualSavings = savingsData.reduce((sum, item) => sum + item.annualSavings, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Cost Savings Report</h1>
        <p className="text-muted-foreground">Clarity Health RCM efficiency and cost reduction analysis</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalMonthlySavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Projection</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAnnualSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Based on current trends</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">240 hrs</div>
            <p className="text-xs text-muted-foreground">Per month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Impact</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">Efficiency increase</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {savingsData.map((item, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-lg">{item.category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Monthly Savings:</span>
                <span className="font-semibold">${item.monthlySavings.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Annual Projection:</span>
                <span className="font-semibold">${item.annualSavings.toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
