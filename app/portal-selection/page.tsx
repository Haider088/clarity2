"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, FileText, Users, Stethoscope, UserCheck, Heart } from "lucide-react"
import Link from "next/link"
import { portalConfigs } from "@/lib/data"

const portalIcons = {
  biller: FileText,
  "practice-admin": Users,
  provider: Stethoscope,
  staff: UserCheck,
  patient: Heart,
}

export default function PortalSelectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="text-lg font-semibold text-foreground">Select Your Portal</div>
        </div>
      </header>

      {/* Portal Selection */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Choose Your Access Portal</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the portal that matches your role to access the appropriate tools and features.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {Object.entries(portalConfigs).map(([key, config]) => {
            const Icon = portalIcons[key as keyof typeof portalIcons]
            const isBiller = key === "biller"

            return (
              <Card
                key={key}
                className={`relative cursor-pointer transition-all hover:shadow-lg ${
                  isBiller ? "ring-2 ring-primary" : ""
                }`}
              >
                <Link href={`/portal/${key}/dashboard`}>
                  <CardHeader className="text-center">
                    {config.badge && (
                      <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                        {config.badge}
                      </Badge>
                    )}
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{config.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base">{config.description}</CardDescription>
                    <Button className="w-full mt-4" variant={isBiller ? "default" : "outline"}>
                      Access Portal
                    </Button>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
