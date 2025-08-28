"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

export default function AdminSettings() {
  const [admin, setAdmin] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showResetDialog, setShowResetDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if admin is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      window.location.href = "/"
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "ADMIN") {
      window.location.href = "/dashboard"
      return
    }

    setAdmin(parsedUser)
    setIsLoading(false)
  }, [])

  const handleResetSystem = async () => {
    setShowResetDialog(true)
  }

  const handleConfirmReset = async () => {
    try {
      const response = await fetch("/api/admin/reset-system", {
        method: "POST",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "System reset successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to reset system",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    } finally {
      setShowResetDialog(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading admin settings...</p>
        </div>
      </div>
    )
  }

  if (!admin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Settings</h1>
          <Button onClick={() => window.location.href = "/admin"}>
            Back to Dashboard
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>System Management</CardTitle>
              <CardDescription>
                Manage system-wide settings and configurations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="destructive" onClick={handleResetSystem}>
                Reset Entire System
              </Button>
              <p className="text-sm text-gray-600">
                This will delete all users, agencies, bookings, and reset the system to its initial state.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your admin account preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => window.location.href = "/admin/profile"}>
                Manage Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <ConfirmationDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        title="Reset Entire System"
        description="Are you sure you want to reset the entire system? This will delete all data."
        confirmText="Reset System"
        cancelText="Cancel"
        confirmVariant="destructive"
        onConfirm={handleConfirmReset}
        onCancel={() => setShowResetDialog(false)}
      />
    </div>
  )
}