"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

export default function BookingHistory() {
  const [user, setUser] = useState(null)
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      window.location.href = "/"
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)
    fetchBookingHistory(parsedUser.id)
  }, [])

  const fetchBookingHistory = async (userId) => {
    try {
      const response = await fetch(`/api/booking/history?userId=${userId}`)
      const data = await response.json()
      setBookings(data.bookings || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load booking history",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      case "APPROVED": return "bg-green-100 text-green-800"
      case "REJECTED": return "bg-red-100 text-red-800"
      case "DELIVERED": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPaymentMethodColor = (method) => {
    return method === "COD" ? "bg-purple-100 text-purple-800" : "bg-orange-100 text-orange-800"
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString() + " " + new Date(dateString).toLocaleTimeString()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading booking history...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Your Booking History</CardTitle>
            <CardDescription>
              Complete history of all your gas cylinder bookings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No booking history found.</p>
                <Button onClick={() => window.location.href = "/dashboard"}>
                  Book Your First Cylinder
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                        <Badge className={getPaymentMethodColor(booking.paymentMethod)}>
                          {booking.paymentMethod}
                        </Badge>
                        {booking.isExtra && (
                          <Badge variant="outline">Extra</Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-700">Booking ID:</p>
                        <p className="text-gray-600 font-mono text-xs">{booking.id}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Payment Method:</p>
                        <p className="text-gray-600">{booking.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Booked On:</p>
                        <p className="text-gray-600">{formatDate(booking.createdAt)}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">Type:</p>
                        <p className="text-gray-600">{booking.isExtra ? "Extra Cylinder" : "Regular Cylinder"}</p>
                      </div>
                      {booking.approvedAt && (
                        <div>
                          <p className="font-medium text-gray-700">Approved On:</p>
                          <p className="text-gray-600">{formatDate(booking.approvedAt)}</p>
                        </div>
                      )}
                      {booking.rejectedAt && (
                        <div>
                          <p className="font-medium text-gray-700">Rejected On:</p>
                          <p className="text-gray-600">{formatDate(booking.rejectedAt)}</p>
                        </div>
                      )}
                      {booking.deliveredAt && (
                        <div>
                          <p className="font-medium text-gray-700">Delivered On:</p>
                          <p className="text-gray-600">{formatDate(booking.deliveredAt)}</p>
                        </div>
                      )}
                    </div>

                    {booking.notes && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="font-medium text-gray-700 mb-1">Notes:</p>
                        <p className="text-gray-600">{booking.notes}</p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">
                          {booking.status === "DELIVERED" ? "✅ Delivered successfully" :
                           booking.status === "APPROVED" ? "🚚 Approved and in progress" :
                           booking.status === "REJECTED" ? "❌ Booking rejected" :
                           "⏳ Pending approval"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === "DELIVERED").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {bookings.filter(b => b.status === "PENDING").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Extra Cylinders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {bookings.filter(b => b.isExtra).length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}