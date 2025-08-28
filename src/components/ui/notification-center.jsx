"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "./scroll-area"

export function NotificationCenter() {
  const [notifications, setNotifications] = useState([])
  const [unread, setUnread] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const fetchNotifications = async () => {
    try {
      console.log("Fetching notifications...")
      // Get user from localStorage
      const userData = localStorage.getItem('user')
      if (!userData) {
        console.log("No user data found in localStorage")
        return
      }

      const user = JSON.parse(userData)
      console.log("User ID:", user.id)
      
      const response = await fetch(`/api/notifications/user?userId=${user.id}`)
      console.log("Response status:", response.status)
      
      const data = await response.json()
      console.log("Notifications response:", data)
      
      if (!response.ok) {
        console.error("Error fetching notifications:", data.error)
        return
      }
      
      setNotifications(data.notifications || [])
      const unreadCount = data.notifications?.filter(n => !n.isRead).length || 0
      console.log("Total notifications:", data.notifications?.length)
      console.log("Unread notifications:", unreadCount)
      setUnread(unreadCount)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const userData = localStorage.getItem('user')
      if (!userData) {
        console.log("No user data found in localStorage")
        return
      }

      const user = JSON.parse(userData)
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id })
      })
      if (response.ok) {
        await fetchNotifications() // Refresh notifications
      }
    } catch (error) {
      console.error("Failed to mark notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const userData = localStorage.getItem('user')
      if (!userData) {
        console.log("No user data found in localStorage")
        return
      }

      const user = JSON.parse(userData)
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id })
      })
      if (response.ok) {
        await fetchNotifications() // Refresh notifications
      }
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error)
    }
  }

  useEffect(() => {
    fetchNotifications()
    // Set up polling for new notifications every minute
    const interval = setInterval(fetchNotifications, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setIsOpen(true)}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unread}
          </Badge>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex justify-between items-center">
              <DialogTitle>Notifications</DialogTitle>
              {unread > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  Mark all as read
                </Button>
              )}
            </div>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <p className="text-center text-sm text-gray-500 py-4">
                  No notifications
                </p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                    onClick={() => !notification.isRead && markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="text-sm font-medium">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <Badge variant="default" className="flex-shrink-0">New</Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}
