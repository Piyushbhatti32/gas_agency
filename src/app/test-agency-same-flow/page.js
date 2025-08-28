'use client'

import { useState, useEffect } from 'react'

export default function TestAgencySameFlow() {
  const [agency, setAgency] = useState(null)
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchAgencyData = async (agencyId) => {
    try {
      console.log("Fetching agency data for agency ID:", agencyId);
      
      // Fetch agency's users (customers who have this agency as default vendor)
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

      // Fetch agency's bookings
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
      console.error("Error fetching agency data:", error)
    } finally {
      console.log("Finished fetching agency data");
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Simulate the exact same flow as agency dashboard
    const testAgency = {
      id: "cme4jdej00009w2ukgwyy2bd9",
      email: "agency@test.com",
      name: "Test Gas Agency",
      role: "AGENCY",
      cylinderPrice: 900.0
    };

    setAgency(testAgency)
    fetchAgencyData(testAgency.id)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading agency dashboard...</p>
        </div>
      </div>
    )
  }

  if (!agency) {
    return null
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Agency Same Flow</h1>
      
      <div className="grid gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Agency Info</h2>
          <div className="border p-2">
            <p><strong>ID:</strong> {agency.id}</p>
            <p><strong>Name:</strong> {agency.name}</p>
            <p><strong>Email:</strong> {agency.email}</p>
          </div>
        </div>

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
      </div>
    </div>
  )
}