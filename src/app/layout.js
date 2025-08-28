import './globals.css'
import { Toaster } from '@/components/ui/toaster'
import { Sonner } from '@/components/ui/sonner'
import Navigation from '@/components/Navigation'

export const metadata = {
  title: 'Gas Agency System',
  description: 'Book your gas cylinders online with ease',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Navigation />
        {children}
        <Toaster />
        <Sonner />
      </body>
    </html>
  )
}