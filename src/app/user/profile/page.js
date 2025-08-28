'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [defaultAgency, setDefaultAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/user/profile');
        const data = await response.json();
        
        if (response.ok) {
          setProfile(data.user);
          setFormData(data.user);
          if (data.user.defaultVendor) {
            setDefaultAgency(data.user.defaultVendor);
          }
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: profile.id,
          ...formData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.user);
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update profile",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!profile) {
    return <div className="flex items-center justify-center min-h-screen">Not authorized</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Profile</h1>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Personal Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              {isEditing ? (
                <Input
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.name}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-lg">{profile.email}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
              {isEditing ? (
                <Input
                  name="phoneNumber"
                  value={formData.phoneNumber || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.phoneNumber || 'Not provided'}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Date of Birth</h3>
              {isEditing ? (
                <Input
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">
                  {profile.dateOfBirth 
                    ? new Date(profile.dateOfBirth).toLocaleDateString() 
                    : 'Not provided'}
                </p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Aadhar Number</h3>
              {isEditing ? (
                <Input
                  name="aadharNumber"
                  value={formData.aadharNumber || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.aadharNumber || 'Not provided'}</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Account Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Account Status</h3>
              <div className="mt-1">
                {profile.isActive ? (
                  <Badge variant="success">Active</Badge>
                ) : (
                  <Badge variant="destructive">Inactive</Badge>
                )}
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Barrels Remaining</h3>
              <p className="text-lg">{profile.barrelsRemaining}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Account Created</h3>
              <p className="text-lg">
                {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4 md:col-span-2">
          <h2 className="text-xl font-semibold">Address Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              {isEditing ? (
                <Textarea
                  name="address"
                  value={formData.address || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.address || 'Not provided'}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">City</h3>
              {isEditing ? (
                <Input
                  name="city"
                  value={formData.city || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.city || 'Not provided'}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">State</h3>
              {isEditing ? (
                <Input
                  name="state"
                  value={formData.state || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.state || 'Not provided'}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pincode</h3>
              {isEditing ? (
                <Input
                  name="pincode"
                  value={formData.pincode || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.pincode || 'Not provided'}</p>
              )}
            </div>
          </div>
        </Card>

        {defaultAgency && (
          <Card className="p-6 space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold">Default Gas Agency</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Agency Name</h3>
                <p className="text-lg">{defaultAgency.businessName}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
                <p className="text-lg">{defaultAgency.contactNumber}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                <p className="text-lg">{defaultAgency.businessAddress}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Working Hours</h3>
                <p className="text-lg">{defaultAgency.workingHours}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
