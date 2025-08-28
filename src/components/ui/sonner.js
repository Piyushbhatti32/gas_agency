import * as React from "react"
import { toast as sonnerToast } from "sonner"

import { cn } from "@/lib/utils"

export function Sonner() {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {/* Sonner toasts will be rendered here */}
    </div>
  )
}