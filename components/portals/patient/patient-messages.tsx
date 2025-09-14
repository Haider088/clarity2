"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Plus } from "lucide-react"
import { useState } from "react"

export function PatientMessages() {
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)
  const [newMessage, setNewMessage] = useState({ subject: "", message: "", recipient: "" })

  const handleNewMessage = () => {
    setShowNewMessageModal(true)
  }

  const handleSendMessage = () => {
    if (!newMessage.subject || !newMessage.message || !newMessage.recipient) {
      alert("Please fill in all fields")
      return
    }
    alert(`Message sent to ${newMessage.recipient}`)
    setNewMessage({ subject: "", message: "", recipient: "" })
    setShowNewMessageModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Secure Messages</h1>
          <p className="text-muted-foreground">Communicate securely with your healthcare team</p>
        </div>
        <Button onClick={handleNewMessage}>
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Message Inbox
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No new messages</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any messages at this time. Use the "New Message" button to start a conversation with your
              healthcare team.
            </p>
            <Button variant="outline" onClick={handleNewMessage}>
              <Plus className="h-4 w-4 mr-2" />
              Send a Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {showNewMessageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">New Message</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">To</label>
                <select
                  className="w-full p-2 border rounded"
                  value={newMessage.recipient}
                  onChange={(e) => setNewMessage((prev) => ({ ...prev, recipient: e.target.value }))}
                >
                  <option value="">Select recipient</option>
                  <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                  <option value="Nurse Mary">Nurse Mary</option>
                  <option value="Front Desk">Front Desk</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage((prev) => ({ ...prev, subject: e.target.value }))}
                  placeholder="Enter subject"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  className="w-full p-2 border rounded h-24"
                  value={newMessage.message}
                  onChange={(e) => setNewMessage((prev) => ({ ...prev, message: e.target.value }))}
                  placeholder="Type your message here..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowNewMessageModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendMessage}>Send Message</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
