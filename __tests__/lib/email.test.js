import { emailService } from '@/lib/email'

// Mock console to avoid cluttering test output
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
}

describe('EmailService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('sendBookingConfirmation', () => {
    it('should send booking confirmation email', async () => {
      const result = await emailService.sendBookingConfirmation(
        'test@example.com',
        'Test User',
        'booking123',
        'COD'
      )

      expect(result).toBe(true)
      expect(console.log).toHaveBeenCalledWith('[EMAIL] Sending email to test@example.com')
      expect(console.log).toHaveBeenCalledWith('[EMAIL] Subject: Gas Cylinder Booking Confirmation')
    })

    it('should handle Paytm QR payment method', async () => {
      const result = await emailService.sendBookingConfirmation(
        'test@example.com',
        'Test User',
        'booking123',
        'PAYTM_QR'
      )

      expect(result).toBe(true)
      expect(console.log).toHaveBeenCalled()
    })
  })

  describe('sendAccountBalanceNotification', () => {
    it('should send low balance alert for ≤3 cylinders', async () => {
      const result = await emailService.sendAccountBalanceNotification(
        'test@example.com',
        'Test User',
        2,
        'used'
      )

      expect(result).toBe(true)
      expect(console.log).toHaveBeenCalledWith('[EMAIL] Subject: Gas Agency - Account Balance Update')
    })

    it('should send good balance notification for >3 cylinders', async () => {
      const result = await emailService.sendAccountBalanceNotification(
        'test@example.com',
        'Test User',
        8,
        'used'
      )

      expect(result).toBe(true)
      expect(console.log).toHaveBeenCalledWith('[EMAIL] Subject: Gas Agency - Account Balance Update')
    })

    it('should handle reset action', async () => {
      const result = await emailService.sendAccountBalanceNotification(
        'test@example.com',
        'Test User',
        12,
        'reset'
      )

      expect(result).toBe(true)
    })
  })

  describe('sendTransactionAcknowledgment', () => {
    it('should send transaction acknowledgment with payment amount', async () => {
      const transactionDetails = {
        bookingId: 'booking123',
        action: 'Booking Approved',
        paymentAmount: 850,
        paymentMethod: 'COD',
        status: 'APPROVED'
      }

      const result = await emailService.sendTransactionAcknowledgment(
        'test@example.com',
        'Test User',
        transactionDetails
      )

      expect(result).toBe(true)
      expect(console.log).toHaveBeenCalledWith('[EMAIL] Subject: Gas Agency - Transaction Acknowledgment')
    })

    it('should send transaction acknowledgment without payment amount', async () => {
      const transactionDetails = {
        bookingId: 'booking123',
        action: 'Booking Created',
        paymentMethod: 'PAYTM_QR',
        status: 'PENDING'
      }

      const result = await emailService.sendTransactionAcknowledgment(
        'test@example.com',
        'Test User',
        transactionDetails
      )

      expect(result).toBe(true)
    })
  })

  describe('sendBookingApproval', () => {
    it('should send booking approval email', async () => {
      const result = await emailService.sendBookingApproval(
        'test@example.com',
        'Test User',
        'booking123'
      )

      expect(result).toBe(true)
      expect(console.log).toHaveBeenCalledWith('[EMAIL] Subject: Your Gas Cylinder Booking Has Been Approved!')
    })
  })

  describe('sendBookingRejection', () => {
    it('should send booking rejection email with reason', async () => {
      const result = await emailService.sendBookingRejection(
        'test@example.com',
        'Test User',
        'booking123',
        'Insufficient stock'
      )

      expect(result).toBe(true)
      expect(console.log).toHaveBeenCalledWith('[EMAIL] Subject: Regarding Your Gas Cylinder Booking')
    })
  })

  describe('sendDeliveryConfirmation', () => {
    it('should send delivery confirmation with notes', async () => {
      const result = await emailService.sendDeliveryConfirmation(
        'test@example.com',
        'Test User',
        'booking123',
        'Left at front door'
      )

      expect(result).toBe(true)
      expect(console.log).toHaveBeenCalledWith('[EMAIL] Subject: Your Gas Cylinder Has Been Delivered!')
    })

    it('should send delivery confirmation without notes', async () => {
      const result = await emailService.sendDeliveryConfirmation(
        'test@example.com',
        'Test User',
        'booking123',
        null
      )

      expect(result).toBe(true)
    })
  })

  describe('sendEmail', () => {
    it('should handle email sending errors gracefully', async () => {
      // Mock setTimeout to throw an error
      const originalSetTimeout = global.setTimeout
      global.setTimeout = jest.fn(() => {
        throw new Error('Network timeout')
      })

      const result = await emailService.sendEmail({
        to: 'test@example.com',
        subject: 'Test',
        html: '<p>Test</p>'
      })

      expect(result).toBe(false)
      expect(console.error).toHaveBeenCalledWith('Email sending failed:', expect.any(Error))

      // Restore original setTimeout
      global.setTimeout = originalSetTimeout
    })
  })
})
