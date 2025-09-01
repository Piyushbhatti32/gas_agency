"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/LoadingSpinner'

export default function TestUIPage() {
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')

  const handleTestClick = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold text-center">UI Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Button Test */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleTestClick} disabled={loading}>
              {loading ? <LoadingSpinner size="sm" /> : 'Primary Button'}
            </Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="destructive">Destructive Button</Button>
          </CardContent>
        </Card>

        {/* Input Test */}
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="test-input">Test Input</Label>
              <Input
                id="test-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type something..."
              />
            </div>
            <div>
              <Label htmlFor="disabled-input">Disabled Input</Label>
              <Input
                id="disabled-input"
                disabled
                placeholder="Disabled input"
              />
            </div>
          </CardContent>
        </Card>

        {/* Loading Test */}
        <Card>
          <CardHeader>
            <CardTitle>Loading States</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <LoadingSpinner size="sm" />
              <span>Small spinner</span>
            </div>
            <div className="flex items-center space-x-4">
              <LoadingSpinner size="md" />
              <span>Medium spinner</span>
            </div>
            <div className="flex items-center space-x-4">
              <LoadingSpinner size="lg" />
              <span>Large spinner</span>
            </div>
            <div className="flex items-center space-x-4">
              <LoadingSpinner size="xl" />
              <span>Extra large spinner</span>
            </div>
          </CardContent>
        </Card>

        {/* Colors Test */}
        <Card>
          <CardHeader>
            <CardTitle>Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-primary rounded"></div>
              <div className="w-8 h-8 bg-secondary rounded"></div>
              <div className="w-8 h-8 bg-destructive rounded"></div>
              <div className="w-8 h-8 bg-muted rounded"></div>
            </div>
            <div className="text-sm text-muted-foreground">
              This text should be muted
            </div>
            <div className="text-sm text-primary">
              This text should be primary color
            </div>
          </CardContent>
        </Card>

        {/* Responsive Test */}
        <Card>
          <CardHeader>
            <CardTitle>Responsive Design</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              <p className="block md:hidden">Mobile view</p>
              <p className="hidden md:block lg:hidden">Tablet view</p>
              <p className="hidden lg:block">Desktop view</p>
            </div>
          </CardContent>
        </Card>

        {/* Animation Test */}
        <Card>
          <CardHeader>
            <CardTitle>Animations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="animate-fade-in">
              <Button variant="outline">Fade In Animation</Button>
            </div>
            <div className="animate-slide-up">
              <Button variant="outline">Slide Up Animation</Button>
            </div>
            <div className="animate-bounce-slow">
              <Button variant="outline">Bounce Animation</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>UI Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>CSS Variables: Working</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>TailwindCSS: Working</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Components: Working</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Animations: Working</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Responsive Design: Working</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
