"use client"

import { useState } from "react"
import { useAppStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { CheckCircle, Clock, User, Loader2, CreditCard, PenTool } from "lucide-react"

export function StaffCheckIn() {
  const { appointments, currentPracticeId, updateAppointmentStatus } = useAppStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [isChecking, setIsChecking] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [paymentCollected, setPaymentCollected] = useState(false)
  const [signatureCaptured, setSignatureCaptured] = useState(false)

  const arrivingPatients = appointments.filter(
    (apt) =>
      apt.practiceId === currentPracticeId &&
      (apt.status === "Arriving" || apt.status === "Scheduled") &&
      new Date(apt.date).toDateString() === new Date().toDateString(),
  )

  const handleCheckIn = (patientName: string, appointmentId: string) => {
    setSelectedPatient(patientName)
    setIsModalOpen(true)
    setIsChecking(true)
    setIsVerified(false)
    setPaymentCollected(false)
    setSignatureCaptured(false)

    // Simulate eligibility check
    setTimeout(() => {
      setIsChecking(false)
      setIsVerified(true)
    }, 1500)
  }

  const handleCollectPayment = () => {
    setPaymentCollected(true)
  }

  const handleCaptureSignature = () => {
    setSignatureCaptured(true)
  }

  const handleCompleteCheckIn = () => {
    // Find the appointment and update its status
    const appointment = arrivingPatients.find((apt) => apt.patientName === selectedPatient)
    if (appointment) {
      updateAppointmentStatus(appointment.id, "In Progress")
    }
    closeModal()
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setIsChecking(false)
    setIsVerified(false)
    setPaymentCollected(false)
    setSignatureCaptured(false)
    setSelectedPatient("")
  }

  const canCompleteCheckIn = paymentCollected && signatureCaptured

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Patient Check-In</h1>
        <p className="text-muted-foreground">Process arriving patients and verify eligibility</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Patients Ready for Check-In ({arrivingPatients.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {arrivingPatients.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No patients waiting for check-in</p>
            ) : (
              arrivingPatients.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="text-sm font-medium text-foreground">{appointment.time}</div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{appointment.patientName}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{appointment.type}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        appointment.status === "Arriving"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {appointment.status}
                    </Badge>
                    <Button
                      onClick={() => handleCheckIn(appointment.patientName, appointment.id)}
                      className="bg-primary text-primary-foreground"
                    >
                      Check In
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title="Patient Check-In">
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Checking in {selectedPatient}</h3>

            {isChecking && (
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Checking eligibility...</span>
              </div>
            )}

            {isVerified && (
              <div className="flex items-center justify-center gap-2 text-green-600 mb-4">
                <CheckCircle className="h-5 w-5" />
                <span>✅ Eligibility Verified. Patient checked in successfully!</span>
              </div>
            )}
          </div>

          {isVerified && (
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Co-pay Collection</h4>
                  {paymentCollected && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Co-pay Due: $25.00</span>
                  <Button
                    onClick={handleCollectPayment}
                    disabled={paymentCollected}
                    variant={paymentCollected ? "outline" : "default"}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {paymentCollected ? "Payment Collected" : "Collect Payment"}
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Consent Forms</h4>
                  {signatureCaptured && <CheckCircle className="h-5 w-5 text-green-600" />}
                </div>
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    <PenTool className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {signatureCaptured ? "Signature captured successfully" : "E-signature pad placeholder"}
                    </p>
                  </div>
                  <Button
                    onClick={handleCaptureSignature}
                    disabled={signatureCaptured}
                    variant={signatureCaptured ? "outline" : "default"}
                    className="w-full"
                  >
                    {signatureCaptured ? "Signature Captured" : "Capture Signature"}
                  </Button>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleCompleteCheckIn}
                  disabled={!canCompleteCheckIn}
                  className={`px-8 ${canCompleteCheckIn ? "bg-green-600 hover:bg-green-700" : ""}`}
                >
                  Complete Check-in
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
