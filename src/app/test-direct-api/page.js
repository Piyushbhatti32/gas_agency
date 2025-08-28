'use client'

import { useState, useEffect } from 'react'

export default function TestDirectAPI() {
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  const testAPIs = async () => {
    const agencyId = "cme4jdej00009w2ukgwyy2bd9" // Test agency ID
    
    setLoading(true)
    
    try {
      // Test users API
      console.log("Testing users API with agencyId:", agencyId);
      const usersResponse = await fetch(`/api/agency/users?agencyId=${agencyId}`)
      console.log("Users API response status:", usersResponse.status);
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        console.log("Users data received:", usersData);
        setUsers(usersData.users || [])
      } else {
        const errorText = await usersResponse.text();
        console.error("Failed to fetch users:", usersResponse.status, errorText);
      }

      // Test bookings API
      console.log("Testing bookings API with agencyId:", agencyId);
      const bookingsResponse = await fetch(`/api/agency/bookings?agencyId=${agencyId}`)
      console.log("Bookings API response status:", bookingsResponse.status);
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        console.log("Bookings data received:", bookingsData);
        setBookings(bookingsData.bookings || [])
      } else {
        const errorText = await bookingsResponse.text();
        console.error("Failed to fetch bookings:", bookingsResponse.status, errorText);
      }
    } catch (error) {
      console.error("Error testing APIs:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    testAPIs()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Direct API Test</h1>
      
      <div className="grid gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Users ({users.length})</h2>
          {users.length > 0 ? (
            <ul className="space-y-2">
              {users.map(user => (
                <li key={user.id} className="border p-2">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Default Vendor ID:</strong> {user.defaultVendorId}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No users found</p>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Bookings ({bookings.length})</h2>
          {bookings.length > 0 ? (
            <ul className="space-y-2">
              {bookings.map(booking => (
                <li key={booking.id} className="border p-2">
                  <p><strong>User:</strong> {booking.user?.name || 'Unknown'}</p>
                  <p><strong>Status:</strong> {booking.status}</p>
                  <p><strong>ID:</strong> {booking.id}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No bookings found</p>
          )}
        </div>

        <button 
          onClick={testAPIs} 
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Loading...' : 'Test APIs'}
        </button>
      </div>
    </div>
  )
}