"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email")
    const password = formData.get("password")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })
        // Store user data in localStorage
        localStorage.setItem("user", JSON.stringify(data.user))
        // Redirect based on user role and profile completeness
        if (data.user.role === "ADMIN") {
          window.location.href = "/admin"
        } else if (data.user.role === "AGENCY") {
          window.location.href = "/agency-dashboard"
        } else if (data.user.role === "USER") {
          // Check if user profile is complete
          if (!data.user.phoneNumber || !data.user.address || !data.user.city || !data.user.state || !data.user.pincode) {
            // Redirect to complete registration if profile is incomplete
            window.location.href = "/complete-profile"
          } else {
            window.location.href = "/dashboard"
          }
        } else {
          window.location.href = "/dashboard"
        }
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name")
    const email = formData.get("email")
    const password = formData.get("password")
    const confirmPassword = formData.get("confirmPassword")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Registration successful",
          description: "Your account has been created. Please login.",
        })
        // Redirect to login after a short delay to allow toast to show
        setTimeout(() => {
          window.location.href = "/"
        }, 1500)
      } else {
        setError(data.error || "Registration failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="mb-6 animate-bounce-slow">
            <Image 
              src="/gas-logo.png" 
              alt="Gas Agency Logo" 
              width={120} 
              height={120} 
              className="mx-auto rounded-full shadow-lg"
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4 animate-slide-up">
            Gas Agency System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-slide-up-delay">
            Book your gas cylinders online with ease. Track your orders, manage your bookings, and enjoy seamless service.
          </p>
        </div>

        {/* Auth Card */}
        <div className="max-w-md mx-auto animate-scale-in">
          <Card className="shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
              <CardDescription>
                Login to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4" variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <Tabs defaultValue="userLogin" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="userLogin">User Login</TabsTrigger>
                  <TabsTrigger value="agencyLogin">Agency Login</TabsTrigger>
                  <TabsTrigger value="adminLogin">Admin Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>
                
                <TabsContent value="userLogin">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="user-login-email">User Email</Label>
                      <Input
                        id="user-login-email"
                        name="email"
                        type="email"
                        placeholder="Enter your user email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="user-login-password">Password</Label>
                      <Input
                        id="user-login-password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login as User"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="agencyLogin">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="agency-login-email">Agency Email</Label>
                      <Input
                        id="agency-login-email"
                        name="email"
                        type="email"
                        placeholder="Enter your agency email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="agency-login-password">Agency Password</Label>
                      <Input
                        id="agency-login-password"
                        name="password"
                        type="password"
                        placeholder="Enter your agency password"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login as Agency"}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="adminLogin">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="admin-login-email">Admin Email</Label>
                      <Input
                        id="admin-login-email"
                        name="email"
                        type="email"
                        placeholder="Enter your admin email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="admin-login-password">Admin Password</Label>
                      <Input
                        id="admin-login-password"
                        name="password"
                        type="password"
                        placeholder="Enter your admin password"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login as Admin"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <Input
                        id="register-password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirm Password</Label>
                      <Input
                        id="register-confirm-password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Creating account..." : "Register as User"}
                    </Button>
                  </form>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                      Want detailed registration?{" "}
                      <a href="/user-register" className="text-blue-600 hover:text-blue-700 font-medium">
                        Complete Registration
                      </a>
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      Want to register as an agency?{" "}
                      <a href="/agency-register" className="text-green-600 hover:text-green-700 font-medium">
                        Register Agency
                      </a>
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="hover:scale-105 transition-transform duration-300 animate-fade-in-up-1">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <CardTitle className="text-center">Easy Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Book your gas cylinders in just a few clicks. Track your orders in real-time.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:scale-105 transition-transform duration-300 animate-fade-in-up-2">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <CardTitle className="text-center">12 Cylinders/Year</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Get up to 12 cylinders per year. Request extra cylinders with admin approval.
              </p>
            </CardContent>
          </Card>
          
          <Card className="hover:scale-105 transition-transform duration-300 animate-fade-in-up-3">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <CardTitle className="text-center">Multiple Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600 dark:text-gray-300">
                Pay via Cash on Delivery or Paytm QR. Flexible payment options for your convenience.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}