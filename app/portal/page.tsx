"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PortalPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/portal-selection")
  }, [router])

  return null
}
