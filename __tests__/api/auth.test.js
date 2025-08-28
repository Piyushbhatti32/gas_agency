import { POST as loginHandler } from '@/app/api/auth/login/route'
import { POST as registerHandler } from '@/app/api/auth/register/route'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

// Mock the database
jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    log: {
      create: jest.fn(),
    },
  },
}))

// Mock bcrypt
jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}))

describe('/api/auth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /api/auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        password: 'hashedpassword',
        role: 'CLIENT',
        barrelsRemaining: 12,
      }

      db.user.findUnique.mockResolvedValue(mockUser)
      bcrypt.compare.mockResolvedValue(true)
      db.log.create.mockResolvedValue({})

      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.message).toBe('Login successful')
      expect(data.user).toBeDefined()
      expect(data.user.password).toBeUndefined() // Password should be excluded
      expect(db.log.create).toHaveBeenCalledWith({
        data: {
          userId: '1',
          action: 'LOGIN',
          details: 'User test@example.com logged in',
        },
      })
    })

    it('should reject invalid email', async () => {
      db.user.findUnique.mockResolvedValue(null)

      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'nonexistent@example.com',
          password: 'password123',
        }),
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid email or password')
    })

    it('should reject invalid password', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
      }

      db.user.findUnique.mockResolvedValue(mockUser)
      bcrypt.compare.mockResolvedValue(false)

      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Invalid email or password')
    })

    it('should return 400 for missing fields', async () => {
      const request = new Request('http://localhost/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          // password missing
        }),
      })

      const response = await loginHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email and password are required')
    })
  })

  describe('POST /api/auth/register', () => {
    it('should register successfully with valid data', async () => {
      const mockNewUser = {
        id: '2',
        email: 'newuser@example.com',
        name: 'New User',
        role: 'CLIENT',
        barrelsRemaining: 12,
      }

      db.user.findUnique.mockResolvedValue(null) // Email not taken
      bcrypt.hash.mockResolvedValue('hashedpassword')
      db.user.create.mockResolvedValue(mockNewUser)
      db.log.create.mockResolvedValue({})

      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'password123',
        }),
      })

      const response = await registerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.message).toBe('User registered successfully')
      expect(db.user.create).toHaveBeenCalledWith({
        data: {
          name: 'New User',
          email: 'newuser@example.com',
          password: 'hashedpassword',
        },
      })
    })

    it('should reject duplicate email', async () => {
      const existingUser = {
        id: '1',
        email: 'existing@example.com',
      }

      db.user.findUnique.mockResolvedValue(existingUser)

      const request = new Request('http://localhost/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'existing@example.com',
          password: 'password123',
        }),
      })

      const response = await registerHandler(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Email already registered')
    })
  })
})
