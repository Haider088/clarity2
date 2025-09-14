"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"

export function StaffCredentialing() {
  const { providers } = useAppStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Provider Credentialing</h1>
        <p className="text-muted-foreground">Monitor provider credentialing status with payers</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Credentialing Status</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Provider</TableHead>
                <TableHead>Aetna</TableHead>
                <TableHead>Cigna</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers?.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell className="font-medium">{provider.name}</TableCell>
                  <TableCell>
                    <Badge variant={provider.credentials.Aetna === "In-Network" ? "default" : "secondary"}>
                      {provider.credentials.Aetna}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={provider.credentials.Cigna === "In-Network" ? "default" : "destructive"}>
                      {provider.credentials.Cigna}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {provider.credentials.Cigna.includes("Expires") && (
                      <Badge variant="destructive">Action Required</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
