"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Settings,
  Users,
  Calendar,
  UserCheck,
  Receipt,
  CreditCard,
  UserPlus,
  DollarSign,
  PiggyBank,
  Clipboard,
  TestTube,
  BarChart,
  MessageSquare,
  ArrowRightLeft,
  Shield,
  CheckCircle,
  Video,
  Pill,
  ClipboardList,
  Megaphone,
} from "lucide-react"

const iconMap = {
  LayoutDashboard,
  FileText,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Settings,
  Users,
  Calendar,
  UserCheck,
  Receipt,
  CreditCard,
  UserPlus,
  DollarSign,
  PiggyBank,
  Clipboard,
  TestTube,
  BarChart,
  MessageSquare,
  ArrowRightLeft,
  Shield,
  CheckCircle,
  Video,
  Pill,
  ClipboardList,
  Megaphone,
}

interface SidebarProps {
  portalConfig: any
  activeViewId: string
  portalName: string
}

export function Sidebar({ portalConfig, activeViewId, portalName }: SidebarProps) {
  const { denials, uncoded_encounters, currentPracticeId } = useAppStore()

  const getBadgeCount = (badgeType: string) => {
    if (badgeType === "denials") {
      if (!denials || !Array.isArray(denials)) return 0
      return currentPracticeId === "all"
        ? denials.length
        : denials.filter((d) => d.practiceId === currentPracticeId).length
    }
    if (badgeType === "uncoded") {
      if (!uncoded_encounters || !Array.isArray(uncoded_encounters)) return 0
      return currentPracticeId === "all"
        ? uncoded_encounters.length
        : uncoded_encounters.filter((u) => u.practiceId === currentPracticeId).length
    }
    return 0
  }

  return (
    <div className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="font-bold text-sidebar-foreground">Clarity Health</div>
            <div className="text-xs text-muted-foreground">{portalConfig.name}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {portalConfig.navigation.map((item: any) => {
          const IconComponent = iconMap[item.icon as keyof typeof iconMap]
          const isActive = item.id === activeViewId
          const badgeCount = item.badge ? getBadgeCount(item.badge) : 0

          return (
            <Link
              key={item.id}
              href={`/portal/${portalName}/${item.id}`}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
              )}
            >
              <div className="flex items-center space-x-3">
                {IconComponent && <IconComponent className="h-4 w-4" />}
                <span>{item.label}</span>
              </div>
              {badgeCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {badgeCount}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
