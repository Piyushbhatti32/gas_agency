'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { User, LogOut, Home, History, Users, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { NotificationCenter } from './ui/notification-center';

export default function Navigation() {
  const pathname = usePathname();
  const { toast } = useToast();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  // Return null if we're on login/register pages
  if (pathname === '/' || pathname === '/user-register' || pathname === '/agency-register') {
    return null;
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex gap-4 md:gap-4 pl-10">
          {/* Logo/Home */}
          <Image src="/logo.png" alt="Logo" width={32} height={32} className="mr-2" />
          <Link href={user?.role === 'ADMIN' ? '/admin' : user?.role === 'AGENCY' ? '/agency-dashboard' : '/dashboard'}>
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
        </div>

        {/* Main navigation */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          {/* User info display */}
          {user && (
            <div className="flex items-center gap-2 mr-4">
              <div className="text-sm font-medium">
                {user.name}
              </div>
              <div className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                {user.role}
              </div>
            </div>
          )}
          
          {/* Notification Center */}
          {user?.role !== 'ADMIN' && (
            <NotificationCenter />
          )}

          {/* Links based on user role */}
          <div className="flex items-center gap-2">
            {user?.role === 'USER' && (
              <>
                <Link href="/history">
                  <Button variant="ghost" size="sm">
                    <History className="h-4 w-4 mr-2" />
                    History
                  </Button>
                </Link>
                <Link href="/user/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              </>
            )}

            {user?.role === 'AGENCY' && (
              <>
                <Link href="/agency/users">
                  <Button variant="ghost" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Users
                  </Button>
                </Link>
                <Link href="/agency/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              </>
            )}

            {user?.role === 'ADMIN' && (
              <>
                <Link href="/admin/settings">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </Link>
                <Link href="/admin/profile">
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
              </>
            )}

            {/* Logout button */}
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
