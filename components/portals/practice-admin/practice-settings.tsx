"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Modal } from "@/components/ui/modal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Shield, Building, Plus, Edit, Trash2 } from "lucide-react"

export function PracticeSettings() {
  const { users, currentPracticeId } = useAppStore()
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showEditRoleModal, setShowEditRoleModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [newUser, setNewUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    role: "",
  })

  const practiceUsers = (users || []).filter((u) => u.practiceId === currentPracticeId)

  const roles = [
    {
      id: "admin",
      name: "Practice Administrator",
      permissions: ["manage_users", "view_reports", "manage_settings", "manage_billing"],
    },
    {
      id: "provider",
      name: "Healthcare Provider",
      permissions: ["view_patients", "create_notes", "view_reports", "manage_orders"],
    },
    {
      id: "staff",
      name: "Front Desk Staff",
      permissions: ["manage_appointments", "check_in_patients", "view_schedule"],
    },
    {
      id: "biller",
      name: "Billing Specialist",
      permissions: ["manage_claims", "view_denials", "process_payments"],
    },
  ]

  const allPermissions = [
    { id: "manage_users", label: "Manage Users" },
    { id: "view_reports", label: "View Reports" },
    { id: "manage_settings", label: "Manage Settings" },
    { id: "manage_billing", label: "Manage Billing" },
    { id: "view_patients", label: "View Patients" },
    { id: "create_notes", label: "Create Notes" },
    { id: "manage_orders", label: "Manage Orders" },
    { id: "manage_appointments", label: "Manage Appointments" },
    { id: "check_in_patients", label: "Check-in Patients" },
    { id: "view_schedule", label: "View Schedule" },
    { id: "manage_claims", label: "Manage Claims" },
    { id: "view_denials", label: "View Denials" },
    { id: "process_payments", label: "Process Payments" },
  ]

  const handleInviteUser = () => {
    // Handle user invitation
    console.log("Inviting user:", newUser)
    setShowInviteModal(false)
    setNewUser({ email: "", firstName: "", lastName: "", role: "" })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Practice Settings</h1>
        <p className="text-muted-foreground">Manage your practice configuration and users</p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger value="practice" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Practice Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <Button onClick={() => setShowInviteModal(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Invite New User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {practiceUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="default">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Roles & Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {roles.map((role) => (
                  <div key={role.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{role.name}</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRole(role.id)
                          setShowEditRoleModal(true)
                        }}
                      >
                        Edit Permissions
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary">
                          {allPermissions.find((p) => p.id === permission)?.label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="practice" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Practice Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="practiceName">Practice Name</Label>
                    <Input id="practiceName" defaultValue="Clarity Medical Group" />
                  </div>
                  <div>
                    <Label htmlFor="npi">NPI Number</Label>
                    <Input id="npi" defaultValue="1234567890" />
                  </div>
                  <div>
                    <Label htmlFor="taxId">Tax ID</Label>
                    <Input id="taxId" defaultValue="12-3456789" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="(555) 123-4567" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    defaultValue="123 Medical Center Dr, Suite 100&#10;Healthcare City, HC 12345"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="specialty">Primary Specialty</Label>
                    <Select defaultValue="family-medicine">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family-medicine">Family Medicine</SelectItem>
                        <SelectItem value="internal-medicine">Internal Medicine</SelectItem>
                        <SelectItem value="pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="cardiology">Cardiology</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="est">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="est">Eastern Time</SelectItem>
                        <SelectItem value="cst">Central Time</SelectItem>
                        <SelectItem value="mst">Mountain Time</SelectItem>
                        <SelectItem value="pst">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4">
                  <Button>Save Changes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invite User Modal */}
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite New User">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={newUser.firstName}
                onChange={(e) => setNewUser((prev) => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={newUser.lastName}
                onChange={(e) => setNewUser((prev) => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={newUser.role} onValueChange={(value) => setNewUser((prev) => ({ ...prev, role: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleInviteUser} className="flex-1">
              Send Invitation
            </Button>
            <Button variant="outline" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Edit Role Modal */}
      <Modal isOpen={showEditRoleModal} onClose={() => setShowEditRoleModal(false)} title="Edit Role Permissions">
        <div className="space-y-4">
          {selectedRole && (
            <>
              <h3 className="font-semibold">{roles.find((r) => r.id === selectedRole)?.name} Permissions</h3>
              <div className="space-y-3">
                {allPermissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={permission.id}
                      defaultChecked={roles.find((r) => r.id === selectedRole)?.permissions.includes(permission.id)}
                    />
                    <Label htmlFor={permission.id}>{permission.label}</Label>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowEditRoleModal(false)} className="flex-1">
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setShowEditRoleModal(false)}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  )
}
