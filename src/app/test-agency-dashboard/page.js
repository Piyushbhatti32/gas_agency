'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAgencyDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/test-agency-users')
      const result = await response.json()
      setData(result)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agency Dashboard Test</h1>
        <Button onClick={fetchData} disabled={loading}>
          {loading ? 'Loading...' : 'Refresh Data'}
        </Button>
      </div>

      {data && (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Agency Information</CardTitle>
            </CardHeader>
            <CardContent>
              {data.agency ? (
                <div>
                  <p><strong>ID:</strong> {data.agency.id}</p>
                  <p><strong>Email:</strong> {data.agency.email}</p>
                  <p><strong>Business Name:</strong> {data.agency.businessName}</p>
                </div>
              ) : (
                <p>No agency found</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Users with this Agency as Default Vendor</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Total Users:</strong> {data.stats?.totalUsers || 0}</p>
              {data.users && data.users.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {data.users.map(user => (
                    <li key={user.id} className="border-b pb-2">
                      <p><strong>Name:</strong> {user.name}</p>
                      <p><strong>Email:</strong> {user.email}</p>
                      <p><strong>Bookings:</strong> {user.bookingsCount}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No users found with this agency as default vendor</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bookings for this Agency</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Total Bookings:</strong> {data.stats?.totalBookings || 0}</p>
              {data.bookings && data.bookings.length > 0 ? (
                <ul className="mt-4 space-y-2">
                  {data.bookings.map(booking => (
                    <li key={booking.id} className="border-b pb-2">
                      <p><strong>User:</strong> {booking.user}</p>
                      <p><strong>Status:</strong> {booking.status}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No bookings found for this agency</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}