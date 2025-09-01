"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAPI() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testGetAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/test")
      const data = await response.json()
      setResult({ type: "GET", status: response.status, data })
    } catch (error) {
      setResult({ type: "GET", error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testPostAPI = async () => {
    setLoading(true)
    try {
      const testData = { test: "data", userId: "test123" }
      const response = await fetch("/api/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData)
      })
      const data = await response.json()
      setResult({ type: "POST", status: response.status, data })
    } catch (error) {
      setResult({ type: "POST", error: error.message })
    } finally {
      setLoading(false)
    }
  }

  const testProfileAPI = async () => {
    setLoading(true)
    try {
      const testData = {
        userId: "test123",
        phoneNumber: "1234567890",
        address: "Test Address",
        city: "Test City",
        state: "Test State",
        pincode: "123456"
      }
      const response = await fetch("/api/user/complete-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData)
      })
      const data = await response.json()
      setResult({ type: "PROFILE", status: response.status, data })
    } catch (error) {
      setResult({ type: "PROFILE", error: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      <div className="space-y-4">
        <Button onClick={testGetAPI} disabled={loading}>
          Test GET /api/test
        </Button>
        
        <Button onClick={testPostAPI} disabled={loading}>
          Test POST /api/test
        </Button>
        
        <Button onClick={testProfileAPI} disabled={loading}>
          Test PUT /api/user/complete-profile
        </Button>
      </div>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Result: {result.type}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
