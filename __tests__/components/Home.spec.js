import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '@/app/page'
import { useToast } from '@/hooks/use-toast'

// Mock the useToast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({ toast: jest.fn() })),
}))

global.fetch = jest.fn()

describe('Home Page', () => {
  let toast

  beforeEach(() => {
    toast = jest.fn()
    useToast.mockImplementation(() => ({ toast }))
    fetch.mockClear()
  })

  it('renders the login and register tabs', () => {
    render(<Home />)
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByText('Register')).toBeInTheDocument()
  })

  describe('Login Form', () => {
    it('handles successful login for ADMIN', async () => {
      render(<Home />)

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'admin@test.com' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })

      const mockResponse = {
        ok: true,
        json: async () => ({ user: { role: 'ADMIN', name: 'Admin User' } }),
      }
      fetch.mockResolvedValueOnce(mockResponse)

      fireEvent.click(screen.getByRole('button', { name: 'Login' }))

      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith({
          title: 'Login successful',
          description: 'Welcome back!',
        })
        expect(window.location.href).toBe('/admin')
      })
    })

    it('handles successful login for CLIENT', async () => {
      render(<Home />)

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'client@test.com' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } })

      const mockResponse = {
        ok: true,
        json: async () => ({ user: { role: 'CLIENT', name: 'Client User' } }),
      }
      fetch.mockResolvedValueOnce(mockResponse)

      fireEvent.click(screen.getByRole('button', { name: 'Login' }))

      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith({
          title: 'Login successful',
          description: 'Welcome back!',
        })
        expect(window.location.href).toBe('/dashboard')
      })
    })

    it('handles login failure', async () => {
      render(<Home />)

      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'wrong@test.com' } })
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } })

      const mockResponse = {
        ok: false,
        json: async () => ({ error: 'Invalid credentials' }),
      }
      fetch.mockResolvedValueOnce(mockResponse)

      fireEvent.click(screen.getByRole('button', { name: 'Login' }))

      await waitFor(() => {
        expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
      })
    })
  })

  describe('Register Form', () => {
    it('handles successful registration', async () => {
      render(<Home />)

      fireEvent.click(screen.getByText('Register')) // Switch to Register tab

      fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'New User' } })
      fireEvent.change(screen.getAllByLabelText('Email')[1], { target: { value: 'new@test.com' } })
      fireEvent.change(screen.getAllByLabelText('Password')[1], { target: { value: 'password123' } })
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } })

      const mockResponse = {
        ok: true,
        json: async () => ({ message: 'Registration successful' }),
      }
      fetch.mockResolvedValueOnce(mockResponse)

      fireEvent.click(screen.getByRole('button', { name: 'Register' }))

      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith({
          title: 'Registration successful',
          description: 'Your account has been created. Please login.',
        })
      })
    })

    it('handles registration with mismatching passwords', async () => {
      render(<Home />)

      fireEvent.click(screen.getByText('Register')) // Switch to Register tab

      fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'New User' } })
      fireEvent.change(screen.getAllByLabelText('Email')[1], { target: { value: 'new@test.com' } })
      fireEvent.change(screen.getAllByLabelText('Password')[1], { target: { value: 'password123' } })
      fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password456' } })

      fireEvent.click(screen.getByRole('button', { name: 'Register' }))

      await waitFor(() => {
        expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
      })
    })
  })
})
