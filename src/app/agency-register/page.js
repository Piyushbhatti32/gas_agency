"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"

export default function AgencyRegister() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const handleAgencyRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name")
    const email = formData.get("email")
    const password = formData.get("password")
    const confirmPassword = formData.get("confirmPassword")
    const businessName = formData.get("businessName")
    const businessAddress = formData.get("businessAddress")
    const city = formData.get("city")
    const state = formData.get("state")
    const pincode = formData.get("pincode")
    const contactNumber = formData.get("contactNumber")
    const alternateNumber = formData.get("alternateNumber")
    const gstNumber = formData.get("gstNumber")
    const licenseNumber = formData.get("licenseNumber")
    const panNumber = formData.get("panNumber")
    const cylinderPrice = parseFloat(formData.get("cylinderPrice"))
    const deliveryRadius = parseInt(formData.get("deliveryRadius"))
    const deliveryCharges = parseFloat(formData.get("deliveryCharges"))
    const workingHours = formData.get("workingHours")
    const establishedYear = parseInt(formData.get("establishedYear"))
    const description = formData.get("description")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (cylinderPrice < 100 || cylinderPrice > 2000) {
      setError("Cylinder price must be between ₹100 and ₹2000")
      setIsLoading(false)
      return
    }

    if (!/^[0-9]{10}$/.test(contactNumber)) {
      setError("Contact number must be 10 digits")
      setIsLoading(false)
      return
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
      setError("Pincode must be 6 digits")
      setIsLoading(false)
      return
    }

    if (licenseNumber.length < 10) {
      setError("License number must be at least 10 characters")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/agency-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          businessName, 
          businessAddress,
          city,
          state,
          pincode,
          contactNumber,
          alternateNumber,
          gstNumber,
          licenseNumber,
          panNumber,
          cylinderPrice,
          deliveryRadius,
          deliveryCharges,
          workingHours,
          establishedYear,
          description
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Agency Registration Successful!",
          description: "Your agency has been registered. You can now login.",
        })
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = "/"
        }, 2000)
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Image 
              src="/gas-logo.png" 
              alt="Gas Agency Logo" 
              width={80} 
              height={80} 
              className="mx-auto rounded-full shadow-lg"
            />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Register Your Agency
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Join our platform and start serving customers with gas cylinder deliveries
          </p>
        </div>

        {/* Registration Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Agency Registration</CardTitle>
              <CardDescription className="text-center">
                Fill in your agency details to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-4" variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleAgencyRegister} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Contact Person Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter contact person name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter agency email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    type="text"
                    placeholder="Enter your business name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessAddress">Business Address *</Label>
                  <Textarea
                    id="businessAddress"
                    name="businessAddress"
                    placeholder="Enter complete business address"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      type="text"
                      placeholder="Enter state"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="text"
                      placeholder="Enter 6-digit pincode"
                      maxLength="6"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactNumber">Contact Number *</Label>
                    <Input
                      id="contactNumber"
                      name="contactNumber"
                      type="tel"
                      placeholder="Enter 10-digit contact number"
                      maxLength="10"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alternateNumber">Alternate Number</Label>
                    <Input
                      id="alternateNumber"
                      name="alternateNumber"
                      type="tel"
                      placeholder="Enter alternate number"
                      maxLength="10"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">Gas License Number *</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      placeholder="Enter gas license number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input
                      id="gstNumber"
                      name="gstNumber"
                      type="text"
                      placeholder="Enter GST number (optional)"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="panNumber">PAN Number</Label>
                    <Input
                      id="panNumber"
                      name="panNumber"
                      type="text"
                      placeholder="Enter PAN number (optional)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="establishedYear">Established Year</Label>
                    <Input
                      id="establishedYear"
                      name="establishedYear"
                      type="number"
                      placeholder="e.g., 2020"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cylinderPrice">Cylinder Price (₹) *</Label>
                    <Input
                      id="cylinderPrice"
                      name="cylinderPrice"
                      type="number"
                      placeholder="800"
                      min="100"
                      max="2000"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryRadius">Delivery Radius (KM)</Label>
                    <Input
                      id="deliveryRadius"
                      name="deliveryRadius"
                      type="number"
                      placeholder="10"
                      min="1"
                      max="50"
                      defaultValue="10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryCharges">Delivery Charges (₹)</Label>
                    <Input
                      id="deliveryCharges"
                      name="deliveryCharges"
                      type="number"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      defaultValue="0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workingHours">Working Hours</Label>
                  <Input
                    id="workingHours"
                    name="workingHours"
                    type="text"
                    placeholder="e.g., 9:00 AM - 6:00 PM"
                    defaultValue="9:00 AM - 6:00 PM"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Business Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Brief description of your gas agency"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  disabled={isLoading}
                >
                  {isLoading ? "Registering Agency..." : "Register Agency"}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link href="/" className="text-green-600 hover:text-green-700 font-medium">
                    Login here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
