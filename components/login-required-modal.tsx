"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Lock } from "lucide-react"
import LoginModal from "./login-modal"

interface LoginRequiredModalProps {
  isOpen: boolean
  onClose: () => void
  message?: string
}

export default function LoginRequiredModal({ isOpen, onClose, message }: LoginRequiredModalProps) {
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleLoginClick = () => {
    onClose()
    setShowLoginModal(true)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto bg-amber-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
            <DialogTitle className="text-center text-xl font-bold">Login Required</DialogTitle>
            <DialogDescription className="text-center">
              {message || "You need to be logged in to access this feature."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Button onClick={handleLoginClick} className="bg-[#2c5d34] hover:bg-[#1e3f24]">
              Login Now
            </Button>
            <Button variant="outline" onClick={onClose} className="border-[#d8e6c0]">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </>
  )
}
