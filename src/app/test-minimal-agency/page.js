'use client'

import { useState, useEffect } from 'react'

export default function TestMinimalAgency() {
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAgencyData = async () => {
    const agencyId = "cme4jdej00009w2ukgwyy2bd9" // Test agency ID
    
    setLoading(true)
    
    try {
      // Fetch agency's users
      const usersResponse = await fetch(`/api/agency/users?agencyId=${agencyId}`)
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData.users || [])
      }

      // Fetch agency's bookings
      const bookingsResponse = await fetch(`/api/agency/bookings?agencyId=${agencyId}`)
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData.bookings || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgencyData()
  }, [])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Minimal Agency Test</h1>
      
      <div className="grid gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Users ({users.length})</h2>
          {users.length > 0 ? (
            <ul className="space-y-2">
              {users.map(user => (
                <li key={user.id} className="border p-2">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
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
                </li>
              ))}
            </ul>
          ) : (
            <p>No bookings found</p>
          )}
        </div>

        <button 
          onClick={fetchAgencyData} 
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  )
}