"use client"

import { useAppStore } from "@/lib/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ModalProps {
  isOpen?: boolean
  onClose?: () => void
  title?: string
  children?: React.ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const { isModalOpen, modalContent, closeModal } = useAppStore()

  // Use props if provided, otherwise fall back to store
  const open = isOpen !== undefined ? isOpen : isModalOpen
  const handleClose = onClose || closeModal
  const modalTitle = title || modalContent.title
  const content = children || modalContent.body

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
        </DialogHeader>
        <div>{content}</div>
      </DialogContent>
    </Dialog>
  )
}