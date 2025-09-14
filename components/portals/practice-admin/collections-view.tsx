"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useAppStore } from "@/lib/store"
import { useState } from "react"

export function CollectionsView() {
  const { claims, currentPracticeId } = useAppStore()
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null)

  const practicesClaims = claims.filter((claim) => claim.practiceId === currentPracticeId)

  const agingBuckets = [
    { name: "0-30 Days", min: 0, max: 30, amount: 0, count: 0 },
    { name: "31-60 Days", min: 31, max: 60, amount: 0, count: 0 },
    { name: "61-90 Days", min: 61, max: 90, amount: 0, count: 0 },
    { name: "91-120 Days", min: 91, max: 120, amount: 0, count: 0 },
    { name: "120+ Days", min: 121, max: 999, amount: 0, count: 0 },
  ]

  // Calculate aging for unpaid claims
  practicesClaims.forEach((claim) => {
    if (claim.status !== "paid") {
      const daysSinceSubmission = Math.floor(Math.random() * 150) // Simulate aging
      const bucket = agingBuckets.find((b) => daysSinceSubmission >= b.min && daysSinceSubmission <= b.max)
      if (bucket) {
        bucket.amount += claim.amount
        bucket.count += 1
      }
    }
  })

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

  const chartData = payerData.length > 0 ? payerData : [{ payer: "No Data", amount: 0 }]

  const totalCollections = payerData.reduce((sum, item) => sum + item.amount, 0)
  const totalOutstanding = agingBuckets.reduce((sum, bucket) => sum + bucket.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Collections Analysis</h1>
        <p className="text-muted-foreground">Revenue performance and aging analysis</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Collections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCollections.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalOutstanding.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Accounts receivable</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Payer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payerData[0]?.payer || "N/A"}</div>
            <p className="text-xs text-muted-foreground">${payerData[0]?.amount.toLocaleString() || "0"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aging Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Age Range</TableHead>
                <TableHead>Claims Count</TableHead>
                <TableHead>Outstanding Amount</TableHead>
                <TableHead>Percentage</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agingBuckets.map((bucket) => (
                <TableRow key={bucket.name}>
                  <TableCell className="font-medium">{bucket.name}</TableCell>
                  <TableCell>{bucket.count}</TableCell>
                  <TableCell>${bucket.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        bucket.name.includes("120+")
                          ? "destructive"
                          : bucket.name.includes("91-120")
                            ? "secondary"
                            : "default"
                      }
                    >
                      {totalOutstanding > 0 ? ((bucket.amount / totalOutstanding) * 100).toFixed(1) : 0}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => setSelectedBucket(bucket.name)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Collections by Payer</CardTitle>
        </CardHeader>
        <CardContent>
          {payerData.length === 0 ? (
            <div className="h-80 flex items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">No collections data available</p>
                <p className="text-sm text-muted-foreground">
                  Collections data will appear here once payments are processed
                </p>
              </div>
            </div>
          ) : (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="payer" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, "Collections"]} />
                  <Bar dataKey="amount" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
