import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { IdleTimeoutModal } from "@/components/layouts/idle-timeout-modal"
import { HealthcareProvider } from "@/lib/healthcare-context"
import { Modal } from "@/components/ui/modal"
import { Toast } from "@/components/ui/toast"

export const metadata: Metadata = {
  title: "Clarity Health Demo",
  description: "Healthcare Management System Demo",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gray-50">
        <HealthcareProvider>
          {children}
          <IdleTimeoutModal />
          <Modal />
          <Toast />
        </HealthcareProvider>
      </body>
    </html>
  )
}
