"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { X, Info, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function AnnouncementBanner() {
  const { announcements, dismissedAnnouncements, dismissAnnouncement } = useAppStore()
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0)

  const activeAnnouncements = announcements.filter(
    (ann) =>
      ann.isActive &&
      !dismissedAnnouncements.includes(ann.id) &&
      (!ann.expiresAt || new Date(ann.expiresAt) > new Date()),
  )

  useEffect(() => {
    if (activeAnnouncements.length > 1) {
      const interval = setInterval(() => {
        setCurrentAnnouncementIndex((prev) => (prev + 1) % activeAnnouncements.length)
      }, 5000) // Rotate every 5 seconds
      return () => clearInterval(interval)
    }
  }, [activeAnnouncements.length])

  if (activeAnnouncements.length === 0) return null

  const currentAnnouncement = activeAnnouncements[currentAnnouncementIndex]

  const getIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "error":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const getVariant = (type: string) => {
    switch (type) {
      case "warning":
        return "default"
      case "error":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <Alert variant={getVariant(currentAnnouncement.type)} className="mb-4 border-l-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {getIcon(currentAnnouncement.type)}
          <AlertDescription className="font-medium">
            <span className="font-semibold">{currentAnnouncement.title}:</span> {currentAnnouncement.message}
          </AlertDescription>
        </div>
        <div className="flex items-center gap-2">
          {activeAnnouncements.length > 1 && (
            <span className="text-xs text-muted-foreground">
              {currentAnnouncementIndex + 1} of {activeAnnouncements.length}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dismissAnnouncement(currentAnnouncement.id)}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Alert>
  )
}
