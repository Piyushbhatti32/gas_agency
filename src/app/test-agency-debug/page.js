'use client'

import { useState, useEffect } from 'react'

export default function TestAgencyDebug() {
  const [agency, setAgency] = useState(null)
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [logs, setLogs] = useState([])

  const addLog = (message) => {
    setLogs(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const fetchAgencyData = async (agencyId) => {
    addLog(`fetchAgencyData called with agencyId: ${agencyId}`);
    
    if (!agencyId) {
      addLog("No agencyId provided, returning early");
      return;
    }

    try {
      addLog("Fetching agency data...");
      
      // Fetch agency's users (customers who have this agency as default vendor)
      addLog(`Fetching users for agencyId: ${agencyId}`);
      const usersResponse = await fetch(`/api/agency/users?agencyId=${agencyId}`)
      addLog(`Users API response status: ${usersResponse.status}`);
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        addLog(`Users data received: ${JSON.stringify(usersData.users?.length || 0)} users`);
        setUsers(usersData.users || [])
      } else {
        const errorText = await usersResponse.text();
        addLog(`Failed to fetch users: ${usersResponse.status} - ${errorText}`);
      }

      // Fetch agency's bookings
      addLog(`Fetching bookings for agencyId: ${agencyId}`);
      const bookingsResponse = await fetch(`/api/agency/bookings?agencyId=${agencyId}`)
      addLog(`Bookings API response status: ${bookingsResponse.status}`);
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        addLog(`Bookings data received: ${JSON.stringify(bookingsData.bookings?.length || 0)} bookings`);
        setBookings(bookingsData.bookings || [])
      } else {
        const errorText = await bookingsResponse.text();
        addLog(`Failed to fetch bookings: ${bookingsResponse.status} - ${errorText}`);
      }
    } catch (error) {
      addLog(`Error fetching agency data: ${error.message}`);
    } finally {
      addLog("Finished fetching agency data");
      setLoading(false)
    }
  }

  useEffect(() => {
    addLog("useEffect triggered");
    
    // Simulate agency data
    const testAgency = {
      id: "cme4jdej00009w2ukgwyy2bd9",
      email: "agency@test.com",
      name: "Test Gas Agency",
      role: "AGENCY"
    };
    
    addLog(`Setting agency data: ${JSON.stringify(testAgency)}`);
    setAgency(testAgency);
    
    addLog("Calling fetchAgencyData with agency ID");
    fetchAgencyData(testAgency.id);
  }, [])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Agency Debug Test</h1>
      
      <div className="grid gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Agency Info</h2>
          {agency ? (
            <div className="border p-2">
              <p><strong>ID:</strong> {agency.id}</p>
              <p><strong>Name:</strong> {agency.name}</p>
              <p><strong>Email:</strong> {agency.email}</p>
            </div>
          ) : (
            <p>No agency data</p>
          )}
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

        <div>
          <h2 className="text-xl font-semibold mb-2">Logs</h2>
          <div className="border p-2 bg-gray-100 max-h-60 overflow-y-auto">
            {logs.map((log, index) => (
              <p key={index} className="text-sm font-mono">{log}</p>
            ))}
          </div>
        </div>

        <button 
          onClick={() => fetchAgencyData(agency?.id)} 
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  )
}