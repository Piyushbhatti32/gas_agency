"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { PaymentButton } from "@/components/PaymentButton"
import { calculateGasPrice } from "@/lib/razorpay"
import Image from "next/image"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [agencies, setAgencies] = useState([])
  const [currentBookings, setCurrentBookings] = useState([])
  const [notifications, setNotifications] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)
  const [bookingForm, setBookingForm] = useState({
    agencyId: "",
    paymentMethod: "COD",
    isExtra: false,
    notes: ""
  })
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (!userData) {
      console.log("No user data found, redirecting to home")
      window.location.href = "/"
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      console.log("Parsed user data:", parsedUser)
      if (!parsedUser || !parsedUser.id) {
        console.error("Invalid user data format")
        localStorage.removeItem("user")
        window.location.href = "/"
        return
      }
      setUser(parsedUser)
      // Set default agency if user has one
      if (parsedUser.defaultVendorId) {
        setBookingForm(prev => ({ ...prev, agencyId: parsedUser.defaultVendorId }))
      }
      fetchData(parsedUser.id)
    } catch (error) {
      console.error("Error parsing user data:", error)
      localStorage.removeItem("user")
      window.location.href = "/"
    }
  }, [])

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.log("Loading timeout reached, setting isLoading to false")
        setIsLoading(false)
      }
    }, 10000) // 10 second timeout

    return () => clearTimeout(timeout)
  }, [isLoading])

  const fetchData = async (userId) => {
    try {
      console.log("Fetching data for user:", userId)
      
      // Fetch agencies
      const agenciesResponse = await fetch("/api/agencies");
      if (agenciesResponse.ok) {
        const agenciesData = await agenciesResponse.json();
        setAgencies(agenciesData.agencies || []);
      }
      
      // Fetch current bookings
      const bookingsResponse = await fetch(`/api/booking/user?userId=${userId}`)
      console.log("Bookings response status:", bookingsResponse.status)
      
      if (!bookingsResponse.ok) {
        const errorData = await bookingsResponse.json()
        console.error("Bookings API error:", errorData)
        throw new Error(errorData.error || "Failed to fetch bookings")
      }
      
      const bookingsData = await bookingsResponse.json()
      console.log("Bookings data:", bookingsData)
      setCurrentBookings(bookingsData.currentBookings || [])

      // Fetch notifications
      const notificationsResponse = await fetch("/api/notifications")
      console.log("Notifications response status:", notificationsResponse.status)
      
      if (!notificationsResponse.ok) {
        const errorData = await notificationsResponse.json()
        console.error("Notifications API error:", errorData)
        throw new Error(errorData.error || "Failed to fetch notifications")
      }
      
      const notificationsData = await notificationsResponse.json()
      console.log("Notifications data:", notificationsData)
      setNotifications(notificationsData.notifications || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try refreshing the page.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBooking = async (e) => {
    e.preventDefault()
    if (!user) return

    // Validate that an agency is selected
    if (!bookingForm.agencyId) {
      toast({
        title: "Error",
        description: "Please select an agency before booking.",
        variant: "destructive"
      })
      return
    }

    setIsBooking(true)
    try {
      const response = await fetch("/api/booking/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          agencyId: bookingForm.agencyId,
          paymentMethod: bookingForm.paymentMethod,
          isExtra: bookingForm.isExtra,
          notes: bookingForm.notes
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Booking successful",
          description: "Your gas cylinder has been booked successfully!",
        })
        setBookingForm({ agencyId: "", paymentMethod: "COD", isExtra: false, notes: "" })
        fetchData(user.id)
      } else {
        toast({
          title: "Booking failed",
          description: data.error || "Failed to create booking",
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
      setIsBooking(false)
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
          <p>Loading dashboard...</p>
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
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-6 animate-fade-in-up-1">
            <h2 className="text-lg font-semibold mb-3">Notifications</h2>
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Alert key={notification.id} className="hover:shadow-md transition-shadow">
                  <AlertDescription>
                    <strong>{notification.title}:</strong> {notification.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* User Info */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:scale-105 transition-transform duration-300 animate-fade-in-up-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Barrels Remaining</CardTitle>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{user.barrelsRemaining}</div>
              <p className="text-sm text-gray-600">out of 12 this year</p>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300 animate-fade-in-up-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Bookings</CardTitle>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{currentBookings.length}</div>
              <p className="text-sm text-gray-600">active bookings</p>
            </CardContent>
          </Card>

          <Card className="hover:scale-105 transition-transform duration-300 animate-fade-in-up-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </CardHeader>
            <CardContent>
              <Badge className="bg-green-100 text-green-800">Active</Badge>
              <p className="text-sm text-gray-600 mt-1">Since {new Date().toLocaleDateString()}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="book" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="book">Book Cylinder</TabsTrigger>
            <TabsTrigger value="current">Current Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="book">
            <Card>
              <CardHeader>
                <CardTitle>Book New Cylinder</CardTitle>
                <CardDescription>
                  Fill in the details to book a new gas cylinder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBooking} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="agency">Select Agency *</Label>
                      <Select
                        value={bookingForm.agencyId}
                        onValueChange={(value) => setBookingForm(prev => ({ ...prev, agencyId: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an agency" />
                        </SelectTrigger>
                        <SelectContent>
                          {agencies.map((agency) => (
                            <SelectItem key={agency.id} value={agency.id}>
                              {agency.businessName} ({agency.city})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method</Label>
                      <Select
                        value={bookingForm.paymentMethod}
                        onValueChange={(value) => setBookingForm(prev => ({ ...prev, paymentMethod: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="COD">Cash on Delivery</SelectItem>
                          <SelectItem value="ONLINE">Pay Online (Razorpay)</SelectItem>
                          <SelectItem value="PAYTM_QR">Paytm QR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bookingType">Booking Type</Label>
                    <Select
                      value={bookingForm.isExtra ? "extra" : "regular"}
                      onValueChange={(value) => setBookingForm(prev => ({ ...prev, isExtra: value === "extra" }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select booking type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="regular">Regular (uses barrel)</SelectItem>
                        <SelectItem value="extra">Extra (requires approval)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special instructions or notes..."
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, notes: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  {bookingForm.isExtra && (
                    <Alert>
                      <AlertDescription>
                        Extra cylinder requests require admin approval and will be processed within 24-48 hours.
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isBooking}>
                    {isBooking ? "Creating Booking..." : "Book Cylinder"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="current">
            <Card>
              <CardHeader>
                <CardTitle>Current Bookings</CardTitle>
                <CardDescription>
                  Track your active and recent bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentBookings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No current bookings found.</p>
                    <Button className="mt-4" onClick={() => document.querySelector('[value="book"]')?.click()}>
                      Book Your First Cylinder
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentBookings.map((booking) => (
                      <div key={booking.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex gap-2 mb-2 flex-wrap">
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                              <Badge className={getPaymentMethodColor(booking.paymentMethod)}>
                                {booking.paymentMethod}
                              </Badge>
                              {booking.paymentStatus && (
                                <Badge variant={booking.paymentStatus === 'COMPLETED' ? 'default' : 'secondary'}>
                                  Payment: {booking.paymentStatus}
                                </Badge>
                              )}
                              {booking.isExtra && (
                                <Badge variant="outline">Extra</Badge>
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm text-gray-600">
                                Booked on {new Date(booking.createdAt).toLocaleDateString()}
                              </p>
                              {booking.amount && (
                                <p className="text-sm font-semibold text-gray-800">
                                  Amount: ₹{booking.amount}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          {/* Payment Button for Online bookings with pending payment */}
                          {booking.paymentMethod === 'ONLINE' && booking.paymentStatus === 'PENDING' && (
                            <div className="ml-4">
                              <PaymentButton
                                bookingId={booking.id}
                                amount={booking.amount || calculateGasPrice(booking.isExtra)}
                                userDetails={{
                                  name: user?.name,
                                  email: user?.email,
                                  phone: user?.phone
                                }}
                                className="text-sm py-2 px-3"
                                onPaymentStart={() => toast({
                                  title: "Payment Started",
                                  description: "Redirecting to payment gateway..."
                                })}
                                onPaymentSuccess={() => {
                                  toast({
                                    title: "Payment Successful",
                                    description: "Payment completed successfully!"
                                  })
                                  fetchData(user.id)
                                }}
                                onPaymentFailure={(error) => {
                                  toast({
                                    title: "Payment Failed",
                                    description: error.message || "Payment failed. Please try again.",
                                    variant: "destructive"
                                  })
                                }}
                              />
                            </div>
                          )}
                        </div>
                        
                        {booking.notes && (
                          <p className="text-sm text-gray-700 mt-2">
                            <strong>Notes:</strong> {booking.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}