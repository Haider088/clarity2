"use client"

import { useAppStore } from "@/lib/store"
import { useEffect } from "react"
import { CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"

export function Toast() {
  const { toastMessage, clearToast } = useAppStore()

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        clearToast()
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage, clearToast])

  useEffect(() => {
    const handleToastEvent = (event: any) => {
      const { message, type } = event.detail
      // Handle custom toast events from components
      if (message) {
        const store = useAppStore.getState()
        store.showToast(message)
      }
    }

    window.addEventListener('showToast', handleToastEvent)
    return () => window.removeEventListener('showToast', handleToastEvent)
  }, [])

  if (!toastMessage) return null

  const getIcon = () => {
    if (toastMessage.includes('✅')) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (toastMessage.includes('❌')) return <AlertCircle className="h-4 w-4 text-red-600" />
    if (toastMessage.includes('⚠️')) return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    return <Info className="h-4 w-4 text-blue-600" />
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-background border border-border px-4 py-3 rounded-lg shadow-lg max-w-sm flex items-center gap-2">
        {getIcon()}
        <p className="text-sm text-foreground">{toastMessage}</p>
      </div>
    </div>
  )
}