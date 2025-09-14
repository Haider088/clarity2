"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send, User } from "lucide-react"

export function ProviderMessages() {
  const { currentPracticeId } = useAppStore()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")

  const conversations = [
    {
      id: "conv-1",
      participant: "RCM Team - Sarah Johnson",
      lastMessage: "Claim #12345 has been processed successfully",
      timestamp: "2 hours ago",
      unread: 2,
      type: "billing",
    },
    {
      id: "conv-2",
      participant: "Prior Auth Team - Mike Chen",
      lastMessage: "Prior authorization approved for patient John Doe",
      timestamp: "1 day ago",
      unread: 0,
      type: "authorization",
    },
    {
      id: "conv-3",
      participant: "Denial Management - Lisa Wang",
      lastMessage: "Need additional documentation for claim appeal",
      timestamp: "2 days ago",
      unread: 1,
      type: "denial",
    },
  ]

  const messages = selectedConversation
    ? [
        {
          id: "msg-1",
          sender: "RCM Team - Sarah Johnson",
          content: "Hi Dr. Smith, I wanted to update you on the status of claim #12345.",
          timestamp: "3 hours ago",
          isFromProvider: false,
        },
        {
          id: "msg-2",
          sender: "You",
          content: "Thanks for the update. What's the current status?",
          timestamp: "2.5 hours ago",
          isFromProvider: true,
        },
        {
          id: "msg-3",
          sender: "RCM Team - Sarah Johnson",
          content: "The claim has been processed successfully and payment is expected within 5-7 business days.",
          timestamp: "2 hours ago",
          isFromProvider: false,
        },
      ]
    : []

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("")
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Biller Connect</h1>
        <p className="text-muted-foreground">Secure messaging with RCM team</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                    selectedConversation === conversation.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-medium truncate">{conversation.participant}</p>
                        {conversation.unread > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mt-1">{conversation.lastMessage}</p>
                      <p className="text-xs text-muted-foreground mt-1">{conversation.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedConversation
                ? conversations.find((c) => c.id === selectedConversation)?.participant
                : "Select a conversation"}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-[500px]">
            {selectedConversation ? (
              <>
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isFromProvider ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          message.isFromProvider ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Select a conversation to start messaging</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
