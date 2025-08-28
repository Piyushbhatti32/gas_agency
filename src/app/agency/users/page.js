"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function AgencyUsers() {
  const [agency, setAgency] = useState(null)
  const [users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check if agency is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      window.location.href = "/"
      return
    }

    const parsedUser = JSON.parse(userData)
    if (parsedUser.role !== "AGENCY") {
      window.location.href = "/dashboard"
      return
    }

    setAgency(parsedUser)
    fetchAgencyUsers(parsedUser.id)
  }, [])

  const fetchAgencyUsers = async (agencyId) => {
    try {
      const response = await fetch(`/api/agency/users?agencyId=${agencyId}`)
      const data = await response.json()
      setUsers(data.users || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load agency users",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading agency users...</p>
        </div>
      </div>
    )
  }

  if (!agency) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Customers</h1>
          <Button onClick={() => window.location.href = "/agency-dashboard"}>
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer List</CardTitle>
            <CardDescription>
              Customers who have selected your agency as their default vendor
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {users.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No customers found.</p>
                </div>
              ) : (
                users.map((user) => (
                  <div key={user.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="secondary">
                            {user.role}
                          </Badge>
                          <Badge variant="outline">
                            {user.barrelsRemaining} barrels left
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Customer since {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{user._count?.bookings || 0} bookings</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}