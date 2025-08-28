'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestAgencyAPI() {
  const [agencyData, setAgencyData] = useState(null)
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [agencyId, setAgencyId] = useState('')

  const testAgencyAPIs = async () => {
    if (!agencyId) {
      alert('Please enter an agency ID')
      return
    }

    setLoading(true)
    try {
      // Test agency users API
      const usersResponse = await fetch(`/api/agency/users?agencyId=${agencyId}`)
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users || [])
      }

      // Test agency bookings API
      const bookingsResponse = await fetch(`/api/agency/bookings?agencyId=${agencyId}`)
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData.bookings || [])
      }
    } catch (error) {
      console.error('Error testing APIs:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Agency API Test</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Agency ID</label>
                <input
                  type="text"
                  value={agencyId}
                  onChange={(e) => setAgencyId(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter agency ID"
                />
              </div>
              <Button onClick={testAgencyAPIs} disabled={loading}>
                {loading ? 'Testing...' : 'Test Agency APIs'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agency Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length > 0 ? (
              <ul className="space-y-2">
                {users.map(user => (
                  <li key={user.id} className="border-b pb-2">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Bookings:</strong> {user._count?.bookings || 0}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agency Bookings ({bookings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length > 0 ? (
              <ul className="space-y-2">
                {bookings.map(booking => (
                  <li key={booking.id} className="border-b pb-2">
                    <p><strong>User:</strong> {booking.user?.name || 'Unknown'}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                    <p><strong>Payment:</strong> {booking.paymentMethod}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No bookings found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}