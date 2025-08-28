'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"

export default function TestLoginAgency() {
  const [loggedIn, setLoggedIn] = useState(false)

  const loginAsAgency = () => {
    // Set the test agency data in localStorage
    const testAgency = {
      id: "cme4jvo83000fw2ukb7xm33xs",
      email: "agency@test.com",
      name: "Test Gas Agency",
      role: "AGENCY",
      cylinderPrice: 900.0,
      businessName: "Test Gas Agency"
    };

    localStorage.setItem("user", JSON.stringify(testAgency));
    setLoggedIn(true);
    
    // Redirect to agency dashboard after a short delay
    setTimeout(() => {
      window.location.href = "/agency-dashboard";
    }, 1000);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Test Agency Login</h1>
      {loggedIn ? (
        <p>Redirecting to agency dashboard...</p>
      ) : (
        <Button onClick={loginAsAgency}>
          Login as Test Agency and Go to Dashboard
        </Button>
      )}
    </div>
  );
}