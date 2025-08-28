'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugAgencyDashboard() {
  const [agencyData, setAgencyData] = useState(null)
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [debugInfo, setDebugInfo] = useState([])

  const addDebugInfo = (message) => {
    setDebugInfo(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };

  const fetchAgencyData = async (agencyId) => {
    if (!agencyId) {
      addDebugInfo("No agency ID provided");
      return;
    }

    setLoading(true);
    addDebugInfo(`Fetching data for agency ID: ${agencyId}`);

    try {
      // Fetch agency's users
      addDebugInfo("Fetching users...");
      const usersResponse = await fetch(`/api/agency/users?agencyId=${agencyId}`);
      addDebugInfo(`Users API response status: ${usersResponse.status}`);
      
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        addDebugInfo(`Users data received: ${JSON.stringify(usersData)}`);
        setUsers(usersData.users || []);
      } else {
        const errorText = await usersResponse.text();
        addDebugInfo(`Failed to fetch users: ${usersResponse.status} - ${errorText}`);
      }

      // Fetch agency's bookings
      addDebugInfo("Fetching bookings...");
      const bookingsResponse = await fetch(`/api/agency/bookings?agencyId=${agencyId}`);
      addDebugInfo(`Bookings API response status: ${bookingsResponse.status}`);
      
      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json();
        addDebugInfo(`Bookings data received: ${JSON.stringify(bookingsData)}`);
        setBookings(bookingsData.bookings || []);
      } else {
        const errorText = await bookingsResponse.text();
        addDebugInfo(`Failed to fetch bookings: ${bookingsResponse.status} - ${errorText}`);
      }
    } catch (error) {
      addDebugInfo(`Error fetching agency data: ${error.message}`);
    } finally {
      setLoading(false);
      addDebugInfo("Finished fetching data");
    }
  };

  const loadAgencyFromLocalStorage = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setAgencyData(parsedUser);
        addDebugInfo(`Loaded agency from localStorage: ${JSON.stringify(parsedUser)}`);
        return parsedUser;
      } catch (error) {
        addDebugInfo(`Error parsing localStorage user data: ${error.message}`);
      }
    } else {
      addDebugInfo("No user data found in localStorage");
    }
    return null;
  };

  const testWithTestAgency = () => {
    // Use the test agency ID we know works
    const testAgency = {
      id: "cme4jdej00009w2ukgwyy2bd9",
      email: "agency@test.com",
      name: "Test Gas Agency",
      role: "AGENCY"
    };
    
    setAgencyData(testAgency);
    addDebugInfo(`Set test agency data: ${JSON.stringify(testAgency)}`);
    fetchAgencyData(testAgency.id);
  };

  useEffect(() => {
    addDebugInfo("Component mounted");
    loadAgencyFromLocalStorage();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Debug Agency Dashboard</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Debug Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={testWithTestAgency} disabled={loading}>
                Test with Known Agency ID
              </Button>
              <Button onClick={() => loadAgencyFromLocalStorage()} disabled={loading}>
                Load from localStorage
              </Button>
              <Button onClick={() => fetchAgencyData(agencyData?.id)} disabled={loading || !agencyData?.id}>
                Fetch Data for Current Agency
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agency Information</CardTitle>
          </CardHeader>
          <CardContent>
            {agencyData ? (
              <div className="space-y-2">
                <p><strong>ID:</strong> {agencyData.id}</p>
                <p><strong>Name:</strong> {agencyData.name || agencyData.businessName}</p>
                <p><strong>Email:</strong> {agencyData.email}</p>
                <p><strong>Role:</strong> {agencyData.role}</p>
              </div>
            ) : (
              <p>No agency data loaded</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users ({users.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {users.length > 0 ? (
              <ul className="space-y-2">
                {users.map(user => (
                  <li key={user.id} className="border-b pb-2">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Default Vendor ID:</strong> {user.defaultVendorId}</p>
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
            <CardTitle>Bookings ({bookings.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length > 0 ? (
              <ul className="space-y-2">
                {bookings.map(booking => (
                  <li key={booking.id} className="border-b pb-2">
                    <p><strong>User:</strong> {booking.user?.name || 'Unknown'}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                    <p><strong>Payment:</strong> {booking.paymentMethod}</p>
                    <p><strong>ID:</strong> {booking.id}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No bookings found</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded max-h-60 overflow-y-auto">
              {debugInfo.length > 0 ? (
                <ul className="space-y-1">
                  {debugInfo.map((info, index) => (
                    <li key={index} className="text-sm font-mono">{info}</li>
                  ))}
                </ul>
              ) : (
                <p>No debug information yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}