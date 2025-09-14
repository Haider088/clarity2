"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useAppStore } from "@/lib/store"
import { Clock } from "lucide-react"

export function IdleTimeoutModal() {
  const { isIdleModalOpen, closeIdleModal, resetIdleTimer } = useAppStore()

  const handleStayLoggedIn = () => {
    closeIdleModal()
    resetIdleTimer()
  }

  return (
    <Dialog open={isIdleModalOpen} onOpenChange={closeIdleModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-amber-500" />
            Session Timeout Warning
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-muted-foreground">You will be logged out due to inactivity in 1 minute.</p>
          <div className="flex justify-end">
            <Button onClick={handleStayLoggedIn}>Stay Logged In</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}