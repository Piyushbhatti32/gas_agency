import { POST as createBookingHandler } from '@/app/api/booking/create/route'
import { db } from '@/lib/db'
import { emailService } from '@/lib/email'

// Mock the database
jest.mock('@/lib/db', () => ({
  db: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    booking: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    log: {
      create: jest.fn(),
    },
  },
}))

// Mock the email service
jest.mock('@/lib/email', () => ({
  emailService: {
    sendBookingConfirmation: jest.fn(),
  },
}))

describe('/api/booking/create', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a regular booking successfully', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      barrelsRemaining: 12,
    }

    db.user.findUnique.mockResolvedValue(mockUser)
    db.booking.findFirst.mockResolvedValue(null) // No pending bookings
    db.booking.create.mockResolvedValue({
      id: 'booking1',
      userId: '1',
      paymentMethod: 'COD',
      isExtra: false,
    })
    db.log.create.mockResolvedValue({})
    emailService.sendBookingConfirmation.mockResolvedValue({})

    const request = new Request('http://localhost/api/booking/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: '1',
        paymentMethod: 'COD',
        isExtra: false,
        notes: 'Test booking',
      }),
    })

    const response = await createBookingHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Booking created successfully')
    expect(db.user.update).toHaveBeenCalledWith({
      where: { id: '1' },
      data: { barrelsRemaining: 11 },
    })
  })

  it('should create an extra booking successfully', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      barrelsRemaining: 0,
    }

    db.user.findUnique.mockResolvedValue(mockUser)
    db.booking.findFirst.mockResolvedValue(null)
    db.booking.create.mockResolvedValue({
      id: 'booking2',
      userId: '1',
      paymentMethod: 'PAYTM_QR',
      isExtra: true,
    })

    const request = new Request('http://localhost/api/booking/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: '1',
        paymentMethod: 'PAYTM_QR',
        isExtra: true,
        notes: 'Extra booking',
      }),
    })

    const response = await createBookingHandler(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Booking created successfully')
    // Barrels should not be decremented for extra booking
    expect(db.user.update).not.toHaveBeenCalled()
  })

  it('should reject booking if barrels exhausted for regular booking', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      barrelsRemaining: 0,
    }

    db.user.findUnique.mockResolvedValue(mockUser)

    const request = new Request('http://localhost/api/booking/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: '1',
        paymentMethod: 'COD',
        isExtra: false,
      }),
    })

    const response = await createBookingHandler(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('No barrels remaining. Please request an extra cylinder.')
  })

  it('should reject booking if another pending booking exists', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      barrelsRemaining: 12,
    }

    db.user.findUnique.mockResolvedValue(mockUser)
    db.booking.findFirst.mockResolvedValue({ id: 'pendingBooking' })

    const request = new Request('http://localhost/api/booking/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: '1',
        paymentMethod: 'COD',
        isExtra: false,
      }),
    })

    const response = await createBookingHandler(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('You already have a pending booking. Please wait for it to be processed.')
  })
})

