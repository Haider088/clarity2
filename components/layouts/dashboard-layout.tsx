"use client"

import type React from "react"

import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import { AnnouncementBanner } from "./announcement-banner"
import { portalConfigs } from "@/lib/data"
import { useIdleTimer } from "@/hooks/use-idle-timer"
import { useHealthcare } from "@/lib/healthcare-context"

interface DashboardLayoutProps {
  portalName: string
  viewId: string
  children: React.ReactNode
}

export function DashboardLayout({ portalName, viewId, children }: DashboardLayoutProps) {
  const portalConfig = portalConfigs[portalName as keyof typeof portalConfigs]
  const { openIdleModal } = useHealthcare()

  useIdleTimer({
    timeout: 15 * 60 * 1000, // 15 minutes in milliseconds
    onIdle: openIdleModal,
  })

  if (!portalConfig) {
    return <div>Portal not found</div>
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar portalConfig={portalConfig} activeViewId={viewId} portalName={portalName} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar portalName={portalName} />
        <main className="flex-1 overflow-auto p-6">
          <AnnouncementBanner />
          {children}
        </main>
      </div>
    </div>
  )
}
