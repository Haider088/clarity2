"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Megaphone } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function AnnouncementsManager() {
  const { announcements, addAnnouncement, toggleAnnouncementStatus, showToast } = useAppStore()
  const [isCreating, setIsCreating] = useState(false)
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "warning" | "success" | "error",
    expiresAt: "",
  })

  const handleCreateAnnouncement = () => {
    if (!newAnnouncement.title || !newAnnouncement.message) {
      showToast("Please fill in title and message")
      return
    }

    addAnnouncement({
      ...newAnnouncement,
      isActive: true,
      expiresAt: newAnnouncement.expiresAt || undefined,
    })

    setNewAnnouncement({ title: "", message: "", type: "info", expiresAt: "" })
    setIsCreating(false)
    showToast("Announcement created successfully")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Announcements</h1>
          <p className="text-muted-foreground">Manage system-wide announcements and notifications</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Announcement
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Announcement</CardTitle>
            <CardDescription>Create a system-wide announcement for all users</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Announcement title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={newAnnouncement.type}
                  onValueChange={(value: any) => setNewAnnouncement((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Information</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={newAnnouncement.message}
                onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="Announcement message"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expires">Expires At (Optional)</Label>
              <Input
                id="expires"
                type="datetime-local"
                value={newAnnouncement.expiresAt}
                onChange={(e) => setNewAnnouncement((prev) => ({ ...prev, expiresAt: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreateAnnouncement}>Create Announcement</Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Active Announcements
          </CardTitle>
          <CardDescription>Manage existing system announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{announcement.title}</h3>
                      <Badge variant={announcement.type === "warning" ? "destructive" : "default"}>
                        {announcement.type}
                      </Badge>
                      <Badge variant={announcement.isActive ? "default" : "secondary"}>
                        {announcement.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{announcement.message}</p>
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(announcement.createdAt).toLocaleDateString()}
                      {announcement.expiresAt && (
                        <span className="ml-4">Expires: {new Date(announcement.expiresAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={announcement.isActive}
                      onCheckedChange={() => toggleAnnouncementStatus(announcement.id)}
                    />
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
