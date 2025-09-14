"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useAppStore } from "@/lib/store"
import { Download, FileText, TrendingUp } from "lucide-react"

export function AdminReportsView() {
  const { claims, currentPracticeId } = useAppStore()
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const practicesClaims = claims.filter((claim) => claim.practiceId === currentPracticeId)

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsGenerating(false)
    // Show success feedback
    const event = new CustomEvent("showToast", {
      detail: { message: "✅ Monthly report generated successfully", type: "success" },
    })
    window.dispatchEvent(event)
  }

  const handleExport = async () => {
    setIsExporting(true)
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsExporting(false)
    // Show success feedback
    const event = new CustomEvent("showToast", {
      detail: { message: "📊 Report exported to CSV successfully", type: "success" },
    })
    window.dispatchEvent(event)
  }

  // Calculate collections by payer
  const payerData = practicesClaims.reduce(
    (acc, claim) => {
      if (claim.status === "paid") {
        const existing = acc.find((item) => item.payer === claim.client)
        if (existing) {
          existing.amount += claim.amount
        } else {
          acc.push({ payer: claim.client, amount: claim.amount })
        }
      }
      return acc
    },
    [] as { payer: string; amount: number }[],
  )

  const totalCollections = payerData.reduce((sum, item) => sum + item.amount, 0)
  const avgClaimAmount = practicesClaims.length > 0 ? totalCollections / practicesClaims.length : 0
  const paidClaims = practicesClaims.filter((c) => c.status === "paid").length
  const collectionRate = practicesClaims.length > 0 ? (paidClaims / practicesClaims.length) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Client Reports</h1>
          <p className="text-muted-foreground">Financial analytics and performance metrics</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleGenerateReport} disabled={isGenerating} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Report"}
          </Button>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 bg-transparent"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export CSV"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCollections.toLocaleString()}</div>
            <Badge variant="secondary" className="mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectionRate.toFixed(1)}%</div>
            <Badge variant="secondary" className="mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3.2%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Claim Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgClaimAmount.toFixed(0)}</div>
            <Badge variant="secondary" className="mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.1%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Claims Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{practicesClaims.length}</div>
            <Badge variant="secondary" className="mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.3%
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Collections by Payer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={payerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="payer" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Collections"]} />
                <Bar dataKey="amount" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
