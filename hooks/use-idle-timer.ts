"use client"

import { useEffect, useRef, useCallback } from "react"

interface UseIdleTimerProps {
  timeout: number // in milliseconds
  onIdle: () => void
}

export function useIdleTimer({ timeout, onIdle }: UseIdleTimerProps) {
  const timeoutRef = useRef<NodeJS.Timeout>()
  const onIdleRef = useRef(onIdle)

  // Update the callback ref when onIdle changes
  useEffect(() => {
    onIdleRef.current = onIdle
  }, [onIdle])

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      onIdleRef.current()
    }, timeout)
  }, [timeout])

  useEffect(() => {
    const events = ["mousedown", "keypress", "scroll", "touchstart"]

    const resetTimerHandler = () => {
      resetTimer()
    }

    // Set initial timer
    resetTimer()

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, resetTimerHandler, true)
    })

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      events.forEach((event) => {
        document.removeEventListener(event, resetTimerHandler, true)
      })
    }
  }, [resetTimer])

  return { resetTimer }
}
