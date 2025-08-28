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

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null)
  const [users, setUsers] = useState([])
  const [agencies, setAgencies] = useState([])
  const [bookings, setBookings] = useState([])
  const [notifications, setNotifications] = useState([])
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
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      // Fetch users (excluding admins)
      const usersResponse = await fetch("/api/admin/users")
      const usersData = await usersResponse.json()
      console.log('All users data:', usersData.users)
      const regularUsers = (usersData.users || []).filter(user => user.role === "USER")
      const agencyUsers = (usersData.users || []).filter(user => user.role === "AGENCY")
      console.log('Regular users:', regularUsers)
      console.log('Agency users:', agencyUsers)
      setUsers(regularUsers)
      setAgencies(agencyUsers)

      // Fetch bookings
      const bookingsResponse = await fetch("/api/admin/bookings")
      const bookingsData = await bookingsResponse.json()
      setBookings(bookingsData.bookings || [])

      // Fetch notifications
      const notificationsResponse = await fetch("/api/notifications")
      const notificationsData = await notificationsResponse.json()
      setNotifications(notificationsData.notifications || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApproveBooking = async (bookingId) => {
    if (!admin) return

    try {
      const response = await fetch("/api/admin/booking/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          adminId: admin.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Booking approved successfully",
        })
        fetchAdminData()
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
    if (!admin) return

    try {
      const response = await fetch("/api/admin/booking/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          adminId: admin.id,
          reason
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Booking rejected successfully",
        })
        fetchAdminData()
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

  const handleCreateNotification = async (e) => {
    e.preventDefault()
    if (!admin || !notificationForm.title || !notificationForm.message) return

    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: notificationForm.title,
          message: notificationForm.message,
          adminId: admin.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Notification created successfully",
        })
        setNotificationForm({ title: "", message: "" })
        fetchAdminData()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to create notification",
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
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
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{users.length}</div>
              <p className="text-sm text-gray-600">registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Gas Agencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{agencies.length}</div>
              <p className="text-sm text-gray-600">registered agencies</p>
            </CardContent>
          </Card>

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
              <div className="text-3xl font-bold text-green-600">{bookings.length}</div>
              <p className="text-sm text-gray-600">total bookings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Active Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {notifications.filter(n => n.isActive).length}
              </div>
              <p className="text-sm text-gray-600">active notifications</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">Manage Bookings</TabsTrigger>
            <TabsTrigger value="users">Regular Users</TabsTrigger>
            <TabsTrigger value="agencies">Gas Agencies</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Manage Bookings</CardTitle>
                <CardDescription>
                  Approve or reject pending cylinder bookings
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
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
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

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
                <CardDescription>
                  View and manage regular users (excluding admins)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {users.map((user) => (
                    <div key={user.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                              {user.role}
                            </Badge>
                            <Badge variant="outline">
                              {user.barrelsRemaining} barrels left
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Joined {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{user._count.bookings} bookings</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agencies">
            <Card>
              <CardHeader>
                <CardTitle>Manage Gas Agencies</CardTitle>
                <CardDescription>
                  View and manage registered gas agencies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {agencies.map((agency) => (
                    <div key={agency.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{agency.name}</p>
                          <p className="text-sm text-gray-600">{agency.email}</p>
                          <div className="flex gap-2 mt-2">
                            <Badge variant="secondary">
                              {agency.role}
                            </Badge>
                            {agency.isVerified ? (
                              <Badge variant="default" className="bg-green-600">Verified</Badge>
                            ) : (
                              <Badge variant="outline" className="text-orange-600">Pending Verification</Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Registered {new Date(agency.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            {agency._count?.bookings || 0} deliveries
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Manage Notifications</CardTitle>
                <CardDescription>
                  Create and manage global notifications for all users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateNotification} className="space-y-4 mb-8">
                  <div className="space-y-2">
                    <Label htmlFor="notification-title">Notification Title</Label>
                    <Input
                      id="notification-title"
                      placeholder="Enter notification title"
                      value={notificationForm.title}
                      onChange={(e) => setNotificationForm(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notification-message">Notification Message</Label>
                    <Textarea
                      id="notification-message"
                      placeholder="Enter notification message"
                      value={notificationForm.message}
                      onChange={(e) => setNotificationForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={3}
                      required
                    />
                  </div>
                  <Button type="submit">Create Notification</Button>
                </form>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Current Notifications</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-gray-600">{notification.message}</p>
                          </div>
                          <Badge variant={notification.isActive ? "default" : "secondary"}>
                            {notification.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          Created {new Date(notification.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
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