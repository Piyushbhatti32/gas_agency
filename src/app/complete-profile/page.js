"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft } from "lucide-react"

export default function CompleteProfile() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      // Redirect to login if no user data
      window.location.href = "/"
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    
    const formData = new FormData(e.currentTarget)
    const profileData = {
      phoneNumber: formData.get("phoneNumber"),
      alternateNumber: formData.get("alternateNumber"),
      dateOfBirth: formData.get("dateOfBirth"),
      aadharNumber: formData.get("aadharNumber"),
      address: formData.get("address"),
      city: formData.get("city"),
      state: formData.get("state"),
      pincode: formData.get("pincode"),
      landmark: formData.get("landmark")
    }

    // Validate required fields
    if (!profileData.phoneNumber || !profileData.address || !profileData.city || !profileData.state || !profileData.pincode) {
      setError("Please fill in all required fields")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/user/complete-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, ...profileData })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Profile completed successfully!",
          description: "Your profile has been updated.",
        })
        
        // Update localStorage with new user data
        const updatedUser = { ...user, ...profileData }
        localStorage.setItem("user", JSON.stringify(updatedUser))
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = "/dashboard"
        }, 1500)
      } else {
        setError(data.error || "Failed to update profile")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto mb-8">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome {user.name}! Please complete your profile to access all features.
            </p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Fill in the missing details to complete your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert className="mb-6" variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                    Contact Information
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        name="phoneNumber"
                        type="tel"
                        placeholder="Enter your phone number"
                        defaultValue={user.phoneNumber || ""}
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
                        defaultValue={user.alternateNumber || ""}
                      />
                    </div>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                    Personal Details
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        name="dateOfBirth"
                        type="date"
                        defaultValue={user.dateOfBirth || ""}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aadharNumber">Aadhar Number</Label>
                      <Input
                        id="aadharNumber"
                        name="aadharNumber"
                        type="text"
                        placeholder="Enter Aadhar number"
                        defaultValue={user.aadharNumber || ""}
                        maxLength="12"
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b pb-2">
                    Address Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="Enter your full address"
                      defaultValue={user.address || ""}
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
                        defaultValue={user.city || ""}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select name="state" defaultValue={user.state || ""} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                          <SelectItem value="Arunachal Pradesh">Arunachal Pradesh</SelectItem>
                          <SelectItem value="Assam">Assam</SelectItem>
                          <SelectItem value="Bihar">Bihar</SelectItem>
                          <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                          <SelectItem value="Goa">Goa</SelectItem>
                          <SelectItem value="Gujarat">Gujarat</SelectItem>
                          <SelectItem value="Haryana">Haryana</SelectItem>
                          <SelectItem value="Himachal Pradesh">Himachal Pradesh</SelectItem>
                          <SelectItem value="Jharkhand">Jharkhand</SelectItem>
                          <SelectItem value="Karnataka">Karnataka</SelectItem>
                          <SelectItem value="Kerala">Kerala</SelectItem>
                          <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                          <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                          <SelectItem value="Manipur">Manipur</SelectItem>
                          <SelectItem value="Meghalaya">Meghalaya</SelectItem>
                          <SelectItem value="Mizoram">Mizoram</SelectItem>
                          <SelectItem value="Nagaland">Nagaland</SelectItem>
                          <SelectItem value="Odisha">Odisha</SelectItem>
                          <SelectItem value="Punjab">Punjab</SelectItem>
                          <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                          <SelectItem value="Sikkim">Sikkim</SelectItem>
                          <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                          <SelectItem value="Telangana">Telangana</SelectItem>
                          <SelectItem value="Tripura">Tripura</SelectItem>
                          <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
                          <SelectItem value="Uttarakhand">Uttarakhand</SelectItem>
                          <SelectItem value="West Bengal">West Bengal</SelectItem>
                          <SelectItem value="Delhi">Delhi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pincode">Pincode *</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        type="text"
                        placeholder="Enter pincode"
                        defaultValue={user.pincode || ""}
                        pattern="[0-9]{6}"
                        maxLength="6"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="landmark">Landmark</Label>
                    <Input
                      id="landmark"
                      name="landmark"
                      type="text"
                      placeholder="Enter nearby landmark (optional)"
                      defaultValue={user.landmark || ""}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700" 
                  disabled={isLoading}
                >
                  {isLoading ? "Updating Profile..." : "Complete Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
