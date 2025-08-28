"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog"

export default function AgencyDashboard() {
  const [agency, setAgency] = useState(null)
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [notifications, setNotifications] = useState([])

  // Log agency state changes for debugging
  useEffect(() => {
    console.log("Agency state updated:", agency);
  }, [agency]);

  // Log users state changes for debugging
  useEffect(() => {
    console.log("Users state updated:", users);
  }, [users]);

  // Log bookings state changes for debugging
  useEffect(() => {
    console.log("Bookings state updated:", bookings);
  }, [bookings]);
  const [isLoading, setIsLoading] = useState(true)
  const [notificationForm, setNotificationForm] = useState({
    title: "",
    message: ""
  })
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectBookingId, setRejectBookingId] = useState(null)
  const [rejectReason, setRejectReason] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    console.log("Agency dashboard useEffect triggered");
    // Check if agency is logged in
    const userData = localStorage.getItem("user")
    console.log("User data from localStorage:", userData);
    if (!userData) {
      console.log("No user data found, redirecting to home");
      window.location.href = "/"
      return
    }

    const parsedUser = JSON.parse(userData)
    console.log("Parsed user data:", parsedUser);
    if (parsedUser.role !== "AGENCY") {
      console.log("User is not an agency, redirecting to dashboard");
      window.location.href = "/dashboard"
      return
    }

    console.log("Setting agency state with:", parsedUser);
    setAgency(parsedUser)
    console.log("Calling fetchAgencyData with agency ID:", parsedUser.id);
    fetchAgencyData(parsedUser.id)
  }, [])

  const fetchAgencyData = async (agencyId) => {
    try {
      console.log("Fetching agency data for agency ID:", agencyId);
      
      // Fetch agency's users (customers who have this agency as default vendor)
      const usersResponse = await fetch(`/api/agency/users?agencyId=${agencyId}`)
      console.log("Users API response status:", usersResponse.status);
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        console.log("Users data received:", usersData);
        console.log("Setting users state with:", usersData.users || []);
        setUsers(usersData.users || [])
      } else {
        const errorText = await usersResponse.text();
        console.error("Failed to fetch users:", usersResponse.status, errorText);
      }

      // Fetch agency's bookings
      const bookingsResponse = await fetch(`/api/agency/bookings?agencyId=${agencyId}`)
      console.log("Bookings API response status:", bookingsResponse.status);
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        console.log("Bookings data received:", bookingsData);
        console.log("Setting bookings state with:", bookingsData.bookings || []);
        setBookings(bookingsData.bookings || [])
      } else {
        const errorText = await bookingsResponse.text();
        console.error("Failed to fetch bookings:", bookingsResponse.status, errorText);
      }

      // Fetch notifications
      const notificationsResponse = await fetch("/api/notifications")
      console.log("Notifications API response status:", notificationsResponse.status);
      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json()
        console.log("Notifications data received:", notificationsData);
        setNotifications(notificationsData.notifications || [])
      } else {
        const errorText = await notificationsResponse.text();
        console.error("Failed to fetch notifications:", notificationsResponse.status, errorText);
      }
    } catch (error) {
      console.error("Error fetching agency data:", error)
      toast({
        title: "Error",
        description: "Failed to load agency data",
        variant: "destructive"
      })
    } finally {
      console.log("Finished fetching agency data");
      setIsLoading(false)
    }
  }

  const handleApproveBooking = async (bookingId) => {
    if (!agency) return

    try {
      const response = await fetch("/api/agency/booking/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          agencyId: agency.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Booking approved successfully",
        })
        fetchAgencyData(agency.id)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to approve booking",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleRejectBooking = async (bookingId, reason) => {
    if (!agency) return

    try {
      const response = await fetch("/api/agency/booking/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          agencyId: agency.id,
          reason
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Booking rejected successfully",
        })
        fetchAgencyData(agency.id)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to reject booking",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      })
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading agency dashboard...</p>
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
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Your Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{users.length}</div>
              <p className="text-sm text-gray-600">registered customers</p>
              {users.length === 0 && (
                <p className="text-xs text-gray-500 mt-2">No customers found</p>
              )}
            </CardContent>
          </Card>

          {/* <Card className="flex items-center justify-center">
            <CardContent>
              <Button onClick={() => fetchAgencyData(agency.id)} variant="outline">
                Refresh Data
              </Button>
            </CardContent>
          </Card> */}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {bookings.filter(b => b.status === "PENDING").length}
              </div>
              <p className="text-sm text-gray-600">awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{bookings.length}</div>
              <p className="text-sm text-gray-600">total bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Cylinder Price</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">₹{agency.cylinderPrice}</div>
              <p className="text-sm text-gray-600">per cylinder</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookings">Manage Bookings</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Manage Bookings</CardTitle>
                <CardDescription>
                  Approve or reject cylinder bookings from your customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.filter(b => b.status === "PENDING").length === 0 ? (
                    <Alert>
                      <AlertDescription>
                        No pending bookings at the moment.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    bookings
                      .filter(b => b.status === "PENDING")
                      .map((booking) => (
                        <div key={booking.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="flex gap-2 mb-2">
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
                              <p className="font-medium">{booking.user.name}</p>
                              <p className="text-sm text-gray-600">{booking.user.email}</p>
                              <p className="text-sm text-gray-500">
                                Booked on {new Date(booking.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-sm font-medium text-green-600">
                                Amount: ₹{agency.cylinderPrice}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleApproveBooking(booking.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => {
                                  setRejectBookingId(booking.id)
                                  setShowRejectDialog(true)
                                }}
                              >
                                Reject
                              </Button>
                            </div>
                          </div>
                          {booking.notes && (
                            <p className="text-sm text-gray-700 mt-2">
                              <strong>Notes:</strong> {booking.notes}
                            </p>
                          )}
                        </div>
                      ))
                  )}
                </div>

                {/* All Bookings */}
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">All Bookings</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border rounded p-3 text-sm">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{booking.user.name}</span>
                            <span className="text-gray-600 ml-2">- {booking.paymentMethod}</span>
                          </div>
                          <div className="flex gap-2 items-center">
                            <span className="text-sm font-medium">₹{agency.cylinderPrice}</span>
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Your Customers</CardTitle>
                <CardDescription>
                  Customers who have selected your agency as their default vendor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {users.length > 0 ? (
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
                  ) : (
                    <p>No customers found for this agency.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <ConfirmationDialog
        open={showRejectDialog}
        onOpenChange={setShowRejectDialog}
        title="Reject Booking"
        description="Please provide a reason for rejecting this booking:"
        confirmText="Reject Booking"
        cancelText="Cancel"
        confirmVariant="destructive"
        showInput={true}
        inputPlaceholder="Enter rejection reason"
        inputValue={rejectReason}
        onInputChange={setRejectReason}
        onConfirm={() => {
          if (rejectReason.trim()) {
            handleRejectBooking(rejectBookingId, rejectReason)
            setShowRejectDialog(false)
            setRejectReason("")
            setRejectBookingId(null)
          } else {
            toast({
              title: "Error",
              description: "Please provide a reason for rejection",
              variant: "destructive"
            })
          }
        }}
        onCancel={() => {
          setShowRejectDialog(false)
          setRejectReason("")
          setRejectBookingId(null)
        }}
      />
    </div>
  )
}
