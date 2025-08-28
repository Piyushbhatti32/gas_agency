'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function TestAgencyLogin() {
  const [agencyInfo, setAgencyInfo] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const loginAsAgency = async () => {
    if (!email || !password) {
      alert('Please enter email and password')
      return
    }

    try {
      // In a real app, this would be an API call to authenticate
      // For testing, we'll simulate login with test data
      const testAgency = {
        id: "cme4j47a40003w2uk40mu7iul",
        email: "agency@test.com",
        name: "Agency Owner",
        businessName: "Test Gas Agency",
        role: "AGENCY",
        cylinderPrice: 900.0,
        isActive: true,
        isVerified: true
      }

      localStorage.setItem("user", JSON.stringify(testAgency))
      setAgencyInfo(testAgency)
      setIsLoggedIn(true)
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed')
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setIsLoggedIn(false)
    setAgencyInfo(null)
  }

  const goToDashboard = () => {
    window.open('/agency-dashboard', '_blank')
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Agency Login Test</h1>
      
      {!isLoggedIn ? (
        <Card>
          <CardHeader>
            <CardTitle>Login as Agency</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="agency@test.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="agency123"
                />
              </div>
              <Button onClick={loginAsAgency}>
                Login as Test Agency
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Agency Logged In</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p><strong>Agency ID:</strong> {agencyInfo.id}</p>
                <p><strong>Business Name:</strong> {agencyInfo.businessName}</p>
                <p><strong>Email:</strong> {agencyInfo.email}</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={goToDashboard}>
                  Open Agency Dashboard
                </Button>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}