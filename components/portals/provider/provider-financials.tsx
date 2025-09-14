"use client"

import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"

export function ProviderFinancials() {
  const { claims, currentPracticeId } = useAppStore()

  const practiceClaims = (claims || []).filter((c) => c.practiceId === currentPracticeId)

  const monthlyRevenue = practiceClaims.reduce((sum, claim) => {
    const claimDate = new Date(claim.dateOfService)
    const currentMonth = new Date().getMonth()
    if (claimDate.getMonth() === currentMonth) {
      return sum + claim.amount
    }
    return sum
  }, 0)

  const collectionRate =
    practiceClaims.length > 0
      ? (practiceClaims.filter((c) => c.status === "Paid").length / practiceClaims.length) * 100
      : 0

  const denialRate =
    practiceClaims.length > 0
      ? (practiceClaims.filter((c) => c.status === "Denied").length / practiceClaims.length) * 100
      : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Practice Financials</h1>
        <p className="text-muted-foreground">View-only financial dashboard for providers</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denial Rate</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{denialRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -1.2% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Total Claims This Month</h3>
                <p className="text-sm text-muted-foreground">Claims submitted for current month</p>
              </div>
              <div className="text-2xl font-bold">{practiceClaims.length}</div>
            </div>

            <div className="flex justify-between items-center p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Average Claim Amount</h3>
                <p className="text-sm text-muted-foreground">Mean value per claim</p>
              </div>
              <div className="text-2xl font-bold">
                ${practiceClaims.length > 0 ? (monthlyRevenue / practiceClaims.length).toFixed(0) : "0"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
