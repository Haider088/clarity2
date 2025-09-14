"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Search, Send, CheckSquare } from "lucide-react"
import { useAppStore } from "@/lib/store"

const mockThreads = [
  {
    id: "1",
    type: "patient",
    title: "Patient: John Doe - Question about bill",
    lastMessage: "I have a question about my recent statement...",
    time: "2 hours ago",
    unread: true,
  },
  {
    id: "2",
    type: "provider",
    title: "Dr. Smith - Reschedule request",
    lastMessage: "Can we move my 3 PM appointment to 4 PM?",
    time: "4 hours ago",
    unread: true,
  },
  {
    id: "3",
    type: "billing",
    title: "Billing Dept - Insurance verification",
    lastMessage: "Please verify insurance for Maria Garcia",
    time: "1 day ago",
    unread: false,
  },
]

const mockMessages = [
  {
    id: "1",
    sender: "John Doe",
    content: "Hi, I received my statement and I'm confused about the charges. Can someone help explain?",
    time: "2:30 PM",
    isStaff: false,
  },
  {
    id: "2",
    sender: "You",
    content: "Hi John, I'd be happy to help explain your statement. Let me pull up your account.",
    time: "2:45 PM",
    isStaff: true,
  },
  {
    id: "3",
    sender: "John Doe",
    content: "Thank you! I'm specifically confused about the $75 charge for lab work.",
    time: "3:00 PM",
    isStaff: false,
  },
]

export function StaffMessages() {
  const { addTask, currentPracticeId } = useAppStore()
  const [selectedThread, setSelectedThread] = useState(mockThreads[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [replyText, setReplyText] = useState("")
  const [messages, setMessages] = useState(mockMessages)

  const filteredThreads = mockThreads.filter(
    (thread) =>
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSendReply = () => {
    if (replyText.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        sender: "You",
        content: replyText,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isStaff: true,
      }
      setMessages([...messages, newMessage])
      setReplyText("")
    }
  }

  const handleCreateTask = () => {
    const newTask = {
      id: `TASK-${Date.now()}`,
      title: `Follow up: ${selectedThread.title}`,
      description: `Created from message thread: ${selectedThread.lastMessage}`,
      status: "pending" as const,
      priority: "medium" as const,
      assignedTo: "Current User",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0], // Tomorrow
      practiceId: currentPracticeId,
      createdAt: new Date().toISOString(),
    }

    addTask(newTask)

    // Show success feedback
    const button = document.querySelector("[data-task-button]") as HTMLButtonElement
    if (button) {
      const originalText = button.textContent
      button.textContent = "Task Created!"
      button.disabled = true
      setTimeout(() => {
        button.textContent = originalText
        button.disabled = false
      }, 2000)
    }
  }

  const getThreadIcon = (type: string) => {
    switch (type) {
      case "patient":
        return "👤"
      case "provider":
        return "👨‍⚕️"
      case "billing":
        return "💰"
      default:
        return "📧"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Internal communication and notifications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Threads List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Message Threads
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search threads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {filteredThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThread(thread)}
                  className={`p-4 cursor-pointer border-b hover:bg-muted/50 transition-colors ${
                    selectedThread.id === thread.id ? "bg-muted" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{getThreadIcon(thread.type)}</span>
                      <span className="font-medium text-sm truncate">{thread.title}</span>
                    </div>
                    {thread.unread && (
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1 truncate">{thread.lastMessage}</div>
                  <div className="text-xs text-muted-foreground">{thread.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Message Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-lg">{getThreadIcon(selectedThread.type)}</span>
                  {selectedThread.title}
                </CardTitle>
                <div className="text-sm text-muted-foreground mt-1">{selectedThread.time}</div>
              </div>
              <Button variant="outline" size="sm" onClick={handleCreateTask} data-task-button>
                <CheckSquare className="h-4 w-4 mr-2" />
                Create Task from Message
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Message History */}
            <div className="space-y-3 max-h-64 overflow-y-auto border rounded-lg p-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.isStaff ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                      message.isStaff ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">{message.sender}</div>
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">{message.time}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Section */}
            <div className="space-y-2">
              <Textarea
                placeholder="Type your reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-20"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendReply()
                  }
                }}
              />
              <div className="flex justify-end">
                <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                  <Send className="h-4 w-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
