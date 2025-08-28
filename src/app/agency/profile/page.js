'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export default function AgencyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch('/api/agency/profile');
        const data = await response.json();
        
        if (response.ok) {
          setProfile(data.agency);
          setFormData(data.agency);
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Failed to load agency profile:', error);
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
      const response = await fetch('/api/agency/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agencyId: profile.id,
          ...formData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setProfile(data.agency);
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
        <h1 className="text-2xl font-bold">Agency Profile</h1>
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
          <div className="space-x-2 ml-2">
            {profile.isVerified && (
              <Badge variant="success">Verified</Badge>
            )}
            {profile.isActive ? (
              <Badge variant="success">Active</Badge>
            ) : (
              <Badge variant="destructive">Inactive</Badge>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Business Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Business Name</h3>
              {isEditing ? (
                <Input
                  name="businessName"
                  value={formData.businessName || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.businessName}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">License Number</h3>
              {isEditing ? (
                <Input
                  name="licenseNumber"
                  value={formData.licenseNumber || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.licenseNumber}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">GST Number</h3>
              {isEditing ? (
                <Input
                  name="gstNumber"
                  value={formData.gstNumber || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.gstNumber || 'Not provided'}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">PAN Number</h3>
              {isEditing ? (
                <Input
                  name="panNumber"
                  value={formData.panNumber || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.panNumber || 'Not provided'}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Established Year</h3>
              {isEditing ? (
                <Input
                  name="establishedYear"
                  type="number"
                  value={formData.establishedYear || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.establishedYear || 'Not provided'}</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Owner Name</h3>
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
              <h3 className="text-sm font-medium text-gray-500">Contact Number</h3>
              {isEditing ? (
                <Input
                  name="contactNumber"
                  value={formData.contactNumber || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.contactNumber}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Alternate Number</h3>
              {isEditing ? (
                <Input
                  name="alternateNumber"
                  value={formData.alternateNumber || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.alternateNumber || 'Not provided'}</p>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4 md:col-span-2">
          <h2 className="text-xl font-semibold">Business Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Business Address</h3>
              {isEditing ? (
                <Textarea
                  name="businessAddress"
                  value={formData.businessAddress || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.businessAddress}</p>
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
                <p className="text-lg">{profile.city}</p>
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
                <p className="text-lg">{profile.state}</p>
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
                <p className="text-lg">{profile.pincode}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Working Hours</h3>
              {isEditing ? (
                <Input
                  name="workingHours"
                  value={formData.workingHours || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.workingHours}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Delivery Radius</h3>
              {isEditing ? (
                <Input
                  name="deliveryRadius"
                  type="number"
                  value={formData.deliveryRadius || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.deliveryRadius} KM</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Cylinder Price</h3>
              {isEditing ? (
                <Input
                  name="cylinderPrice"
                  type="number"
                  step="0.01"
                  value={formData.cylinderPrice || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">₹{profile.cylinderPrice}</p>
              )}
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Delivery Charges</h3>
              {isEditing ? (
                <Input
                  name="deliveryCharges"
                  type="number"
                  step="0.01"
                  value={formData.deliveryCharges || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">₹{profile.deliveryCharges}</p>
              )}
            </div>
            
            <div className="md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              {isEditing ? (
                <Textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                />
              ) : (
                <p className="text-lg">{profile.description || 'No description provided'}</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
