'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";

export default function AdminProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/admin/profile');
        const data = await response.json();
        
        if (response.ok) {
          setProfile(data.user);
        } else {
          // If not authorized, redirect to login
          router.push('/');
        }
      } catch (error) {
        console.error('Failed to load admin profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">Not authorized</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>
      
      <Card className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Name</h3>
            <p className="text-lg">{profile.name}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Email</h3>
            <p className="text-lg">{profile.email}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Role</h3>
            <p className="text-lg capitalize">{profile.role.toLowerCase()}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
            <p className="text-lg">{profile.phoneNumber || 'Not provided'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Address</h3>
            <p className="text-lg">{profile.address || 'Not provided'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">City</h3>
            <p className="text-lg">{profile.city || 'Not provided'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">State</h3>
            <p className="text-lg">{profile.state || 'Not provided'}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Pincode</h3>
            <p className="text-lg">{profile.pincode || 'Not provided'}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
