"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, FileText, Clock, User, Phone, MessageSquare, Download, Eye } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useState } from "react"

export function PatientDashboard() {
  const { openModal, closeModal } = useAppStore()
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null)

  const patientInfo = {
    name: "John Doe",
    mrn: "MRN001",
    insurance: "Cigna PPO",
    primaryProvider: "Dr. Sarah Johnson",
  }

  const upcomingAppointments = [
    {
      date: "January 30, 2024",
      time: "10:00 AM",
      provider: "Dr. Sarah Johnson",
      type: "Follow-up Visit",
      location: "Main Office",
    },
    {
      date: "February 15, 2024",
      time: "2:30 PM",
      provider: "Dr. Mike Chen",
      type: "Consultation",
      location: "Cardiology Clinic",
    },
  ]

  const recentVisits = [
    {
      date: "January 25, 2024",
      provider: "Dr. Sarah Johnson",
      type: "Office Visit",
      diagnosis: "Chest pain evaluation",
      status: "Completed",
    },
    {
      date: "December 15, 2023",
      provider: "Dr. Sarah Johnson",
      type: "Annual Physical",
      diagnosis: "Routine examination",
      status: "Completed",
    },
  ]

  const testResults = [
    {
      date: "January 26, 2024",
      test: "Complete Blood Count",
      status: "Normal",
      provider: "Dr. Sarah Johnson",
    },
    {
      date: "January 26, 2024",
      test: "Basic Metabolic Panel",
      status: "Normal",
      provider: "Dr. Sarah Johnson",
    },
  ]

  const messages = [
    {
      date: "January 27, 2024",
      from: "Dr. Sarah Johnson",
      subject: "Test Results Available",
      preview: "Your recent lab results are now available...",
      unread: true,
    },
    {
      date: "January 20, 2024",
      from: "Billing Department",
      subject: "Payment Reminder",
      preview: "Your account has a balance of $25.00...",
      unread: false,
    },
  ]

  const handleScheduleAppointment = () => {
    const modalContent = (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Schedule New Appointment</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Appointment Type</label>
            <select className="mt-1 w-full rounded border p-2">
              <option>Annual Physical</option>
              <option>Follow-up Visit</option>
              <option>Consultation</option>
              <option>Urgent Care</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Preferred Provider</label>
            <select className="mt-1 w-full rounded border p-2">
              <option>Dr. Sarah Johnson</option>
              <option>Dr. Mike Chen</option>
              <option>Dr. Lisa Wang</option>
              <option>Any Available</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Preferred Date</label>
              <input type="date" className="mt-1 w-full rounded border p-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Preferred Time</label>
              <select className="mt-1 w-full rounded border p-2">
                <option>Morning (8AM-12PM)</option>
                <option>Afternoon (12PM-5PM)</option>
                <option>Evening (5PM-8PM)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Reason for Visit</label>
            <textarea
              className="mt-1 w-full rounded border p-2"
              rows={3}
              placeholder="Brief description of your concern..."
            ></textarea>
          </div>
          <div className="flex gap-2">
            <Button onClick={closeModal} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={() => {
                closeModal()
                setTimeout(() => {
                  openModal(
                    "Appointment Requested",
                    <div className="text-center p-4">
                      ✅ Your appointment request has been submitted! We'll contact you within 24 hours to confirm your
                      preferred time slot.
                    </div>,
                  )
                }, 500)
              }}
            >
              Request Appointment
            </Button>
          </div>
        </div>
      </div>
    )
    openModal("Schedule Appointment", modalContent)
  }

  const handlePaymentModal = () => {
    const modalContent = (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Make a Payment</h3>
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm text-blue-800">Current Balance: $125.00</div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Payment Amount</label>
            <input type="number" className="mt-1 w-full rounded border p-2" placeholder="125.00" />
          </div>
          <div>
            <label className="text-sm font-medium">Payment Method</label>
            <select className="mt-1 w-full rounded border p-2">
              <option>Credit Card ending in 1234</option>
              <option>Bank Account ending in 5678</option>
              <option>Add New Payment Method</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button onClick={closeModal} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={() => {
                closeModal()
                setTimeout(() => {
                  openModal(
                    "Payment Successful",
                    <div className="text-center p-4">✅ Payment of $125.00 processed successfully!</div>,
                  )
                }, 500)
              }}
            >
              Process Payment
            </Button>
          </div>
        </div>
      </div>
    )
    openModal("Make Payment", modalContent)
  }

  const handleMessageProvider = () => {
    const modalContent = (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Message Your Provider</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">To</label>
            <select className="mt-1 w-full rounded border p-2">
              <option>Dr. Sarah Johnson</option>
              <option>Dr. Mike Chen</option>
              <option>Nursing Staff</option>
              <option>Billing Department</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Subject</label>
            <input type="text" className="mt-1 w-full rounded border p-2" placeholder="Message subject..." />
          </div>
          <div>
            <label className="text-sm font-medium">Message</label>
            <textarea
              className="mt-1 w-full rounded border p-2"
              rows={4}
              placeholder="Type your message here..."
            ></textarea>
          </div>
          <div className="flex gap-2">
            <Button onClick={closeModal} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={() => {
                closeModal()
                setTimeout(() => {
                  openModal(
                    "Message Sent",
                    <div className="text-center p-4">✅ Your message has been sent successfully!</div>,
                  )
                }, 500)
              }}
            >
              Send Message
            </Button>
          </div>
        </div>
      </div>
    )
    openModal("Message Provider", modalContent)
  }

  const handleViewTestResult = (testName: string) => {
    const modalContent = (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Test Result: {testName}</h3>
        <div className="space-y-3">
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-800 font-medium">Result: Normal</div>
            <div className="text-xs text-green-600 mt-1">All values within normal range</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Test Details:</div>
            <div className="text-sm text-muted-foreground">
              • Date: January 26, 2024
              <br />• Provider: Dr. Sarah Johnson
              <br />• Lab: Quest Diagnostics
              <br />• Reference ID: LAB-2024-001
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={closeModal} variant="outline">
              Close
            </Button>
            <Button
              onClick={() => {
                closeModal()
                // Simulate download
                setTimeout(() => {
                  openModal(
                    "Download Started",
                    <div className="text-center p-4">📄 Test result PDF download started!</div>,
                  )
                }, 500)
              }}
            >
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    )
    openModal("Test Result", modalContent)
  }

  const handleViewVisitSummary = (visitDate: string, visitType: string) => {
    const modalContent = (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Visit Summary - {visitType}</h3>
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-800 font-medium">Visit Date: {visitDate}</div>
            <div className="text-xs text-blue-600 mt-1">Provider: Dr. Sarah Johnson</div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Visit Summary:</div>
            <div className="text-sm text-muted-foreground">
              • Chief Complaint: Routine examination
              <br />• Assessment: Patient in good health
              <br />• Plan: Continue current medications
              <br />• Follow-up: Annual physical in 12 months
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={closeModal} variant="outline">
              Close
            </Button>
            <Button
              onClick={() => {
                closeModal()
                setTimeout(() => {
                  openModal(
                    "Download Started",
                    <div className="text-center p-4">📄 Visit summary PDF download started!</div>,
                  )
                }, 500)
              }}
            >
              Download Summary
            </Button>
          </div>
        </div>
      </div>
    )
    openModal("Visit Summary", modalContent)
  }

  const handleRequestRecords = () => {
    const modalContent = (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Request Medical Records</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Record Type</label>
            <select className="mt-1 w-full rounded border p-2">
              <option>Complete Medical Record</option>
              <option>Lab Results Only</option>
              <option>Imaging Reports</option>
              <option>Prescription History</option>
              <option>Visit Notes</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Date Range From</label>
              <input type="date" className="mt-1 w-full rounded border p-2" />
            </div>
            <div>
              <label className="text-sm font-medium">Date Range To</label>
              <input type="date" className="mt-1 w-full rounded border p-2" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Delivery Method</label>
            <select className="mt-1 w-full rounded border p-2">
              <option>Secure Patient Portal</option>
              <option>Email (Encrypted)</option>
              <option>Mail to Address on File</option>
              <option>Pick up at Office</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Purpose of Request</label>
            <textarea
              className="mt-1 w-full rounded border p-2"
              rows={2}
              placeholder="e.g., New provider, insurance, personal records..."
            ></textarea>
          </div>
          <div className="flex gap-2">
            <Button onClick={closeModal} variant="outline">
              Cancel
            </Button>
            <Button
              onClick={() => {
                closeModal()
                setTimeout(() => {
                  openModal(
                    "Request Submitted",
                    <div className="text-center p-4">
                      ✅ Medical records request submitted! We'll process your request within 5-7 business days.
                    </div>,
                  )
                }, 500)
              }}
            >
              Submit Request
            </Button>
          </div>
        </div>
      </div>
    )
    openModal("Request Medical Records", modalContent)
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <User className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-2xl">Welcome back, {patientInfo.name.split(" ")[0]}!</CardTitle>
              <CardDescription className="text-lg">
                Your health information and appointments at a glance
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Primary Provider:</span>
              <div className="font-medium">{patientInfo.primaryProvider}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Insurance:</span>
              <div className="font-medium">{patientInfo.insurance}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
            <p className="text-xs text-muted-foreground">appointments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messages.filter((m) => m.unread).length}</div>
            <p className="text-xs text-muted-foreground">unread messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Results</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testResults.length}</div>
            <p className="text-xs text-muted-foreground">recent results</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Visit</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Jan 25</div>
            <p className="text-xs text-muted-foreground">2024</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>Your scheduled visits</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{appointment.type}</div>
                    <Badge variant="outline">{appointment.date}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>📅 {appointment.time}</div>
                    <div>👨‍⚕️ {appointment.provider}</div>
                    <div>📍 {appointment.location}</div>
                  </div>
                  <div className="flex space-x-2 mt-3">
                    <Button size="sm" variant="outline" onClick={handleScheduleAppointment}>
                      Reschedule
                    </Button>
                    <Button size="sm" variant="outline" onClick={handlePaymentModal}>
                      Pay Copay
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Messages */}
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Communications from your care team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${message.unread ? "bg-blue-50 border-blue-200" : ""}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{message.subject}</div>
                    {message.unread && <Badge variant="secondary">New</Badge>}
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    From: {message.from} • {message.date}
                  </div>
                  <div className="text-sm">{message.preview}</div>
                  <Button size="sm" variant="outline" className="mt-2 bg-transparent" onClick={handleMessageProvider}>
                    Read Message
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Test Results</CardTitle>
            <CardDescription>Your latest lab and diagnostic results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">{result.test}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.date} • {result.provider}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className="bg-green-100 text-green-800">{result.status}</Badge>
                    <Button size="sm" variant="outline" onClick={() => handleViewTestResult(result.test)}>
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Visits */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Visits</CardTitle>
            <CardDescription>Your visit history and summaries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentVisits.map((visit, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium">{visit.type}</div>
                    <Badge variant="secondary">{visit.status}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>📅 {visit.date}</div>
                    <div>👨‍⚕️ {visit.provider}</div>
                    <div>🏥 {visit.diagnosis}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 bg-transparent"
                    onClick={() => handleViewVisitSummary(visit.date, visit.type)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Visit Summary
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center space-y-2 bg-transparent"
              onClick={handleScheduleAppointment}
            >
              <Calendar className="w-6 h-6" />
              <span className="text-sm">Schedule Appointment</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center space-y-2 bg-transparent"
              onClick={handleMessageProvider}
            >
              <MessageSquare className="w-6 h-6" />
              <span className="text-sm">Message Provider</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center space-y-2 bg-transparent"
              onClick={handleRequestRecords}
            >
              <FileText className="w-6 h-6" />
              <span className="text-sm">Request Records</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center space-y-2 bg-transparent"
              onClick={handlePaymentModal}
            >
              <Phone className="w-6 h-6" />
              <span className="text-sm">Make Payment</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
