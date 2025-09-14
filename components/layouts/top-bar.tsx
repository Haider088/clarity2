"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Settings, User, LogOut, Shield } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { fakeData } from "@/lib/data"
import { useState } from "react"
import Link from "next/link"

interface TopBarProps {
  portalName: string
}

export function TopBar({ portalName }: TopBarProps) {
  const { currentPracticeId, setCurrentPracticeId } = useAppStore()
  const [showUserSettings, setShowUserSettings] = useState(false)

  const getUserData = () => {
    switch (portalName) {
      case "biller":
        return {
          name: "Sarah Johnson",
          role: "Billing Manager",
          avatar: "/professional-woman-doctor.png",
          initials: "SJ",
        }
      case "practice-admin":
        return {
          name: "Michael Chen",
          role: "Practice Administrator",
          avatar: "/professional-woman-doctor.png",
          initials: "MC",
        }
      case "provider":
        return {
          name: "Dr. Sarah Johnson",
          role: "Primary Care Physician",
          avatar: "/professional-woman-doctor.png",
          initials: "SJ",
        }
      case "staff":
        return {
          name: "Lisa Rodriguez",
          role: "Medical Assistant",
          avatar: "/professional-woman-doctor.png",
          initials: "LR",
        }
      case "patient":
        return {
          name: "John Smith",
          role: "Patient",
          avatar: "/professional-woman-doctor.png",
          initials: "JS",
        }
      default:
        return {
          name: "User",
          role: "Staff",
          avatar: "/professional-woman-doctor.png",
          initials: "U",
        }
    }
  }

  const user = getUserData()

  return (
    <>
      <header className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/portal-selection"
              className="flex items-center space-x-2 text-foreground hover:text-primary transition-colors"
            >
              <Shield className="w-5 h-5" />
              <span className="text-lg font-bold">Clarity Health</span>
            </Link>
            <div className="text-muted-foreground">|</div>
            <h1 className="text-xl font-semibold text-foreground">
              {portalName === "biller" && "Billing Dashboard"}
              {portalName === "practice-admin" && "Practice Management"}
              {portalName === "provider" && "Provider Portal"}
              {portalName === "staff" && "Staff Dashboard"}
              {portalName === "patient" && "Patient Portal"}
            </h1>

            {portalName === "biller" && (
              <Select value={currentPracticeId} onValueChange={setCurrentPracticeId}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select practice" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Practices</SelectItem>
                  {Object.values(fakeData.practices).map((practice: any) => (
                    <SelectItem key={practice.id} value={practice.id}>
                      {practice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">{user.name}</div>
              <div className="text-xs text-muted-foreground">{user.role}</div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar>
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => setShowUserSettings(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowUserSettings(true)}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {showUserSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-2xl rounded-lg bg-background p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">User Settings</h2>
              <Button variant="ghost" onClick={() => setShowUserSettings(false)}>
                ×
              </Button>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <input className="mt-1 w-full rounded border p-2" defaultValue={user.name} />
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input
                    className="mt-1 w-full rounded border p-2"
                    defaultValue={`${user.name.toLowerCase().replace(" ", ".")}@clarityhealth.com`}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <select className="mt-1 w-full rounded border p-2" defaultValue={user.role}>
                    <option>Billing Manager</option>
                    <option>Practice Administrator</option>
                    <option>Primary Care Physician</option>
                    <option>Medical Assistant</option>
                    <option>Patient</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <input className="mt-1 w-full rounded border p-2" defaultValue="(555) 123-4567" />
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Notification Preferences</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    Email notifications for claim updates
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" defaultChecked />
                    SMS alerts for urgent denials
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Weekly performance reports
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowUserSettings(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowUserSettings(false)}>Save Changes</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
