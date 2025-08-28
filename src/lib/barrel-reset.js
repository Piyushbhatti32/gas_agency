import { db } from '@/lib/db'
import { emailService } from '@/lib/email'

export class BarrelResetService {
  /**
   * Reset barrels for all users to 12
   * This should be run annually, typically on January 1st
   */
  async resetAllUserBarrels() {
    try {
      console.log('[BARREL_RESET] Starting annual barrel reset...')
      
      // Get all users
      const users = await db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          barrelsRemaining: true
        }
      })

      console.log(`[BARREL_RESET] Found ${users.length} users to reset`)

      // Reset barrels for all users
      const resetPromises = users.map(async (user) => {
        await db.user.update({
          where: { id: user.id },
          data: { barrelsRemaining: 12 }
        })

        // Log the reset action
        await db.log.create({
          data: {
            userId: user.id,
            action: 'BARREL_RESET',
            details: `Annual barrel reset: ${user.barrelsRemaining} → 12`
          }
        })

        // Send email notification for barrel reset
        try {
          await emailService.sendAccountBalanceNotification(
            user.email,
            user.name,
            12, // New balance is 12
            'reset'
          )
          console.log(`[EMAIL] Barrel reset notification sent to ${user.email}`)
        } catch (emailError) {
          console.error(`Failed to send barrel reset notification to ${user.email}:`, emailError)
        }

        console.log(`[BARREL_RESET] Reset barrels for ${user.email} (${user.name})`)
      })

      await Promise.all(resetPromises)

      console.log('[BARREL_RESET] Annual barrel reset completed successfully')
    } catch (error) {
      console.error('[BARREL_RESET] Error during barrel reset:', error)
      throw error
    }
  }

  /**
   * Check if barrel reset is needed
   * Returns true if it's January 1st and reset hasn't been done this year
   */
  async isBarrelResetNeeded() {
    try {
      const now = new Date()
      const currentYear = now.getFullYear()
      
      // Check if it's January 1st
      if (now.getMonth() !== 0 || now.getDate() !== 1) {
        return false
      }

      // Check if reset has already been done this year
      const resetLog = await db.log.findFirst({
        where: {
          action: 'BARREL_RESET',
          createdAt: {
            gte: new Date(currentYear, 0, 1), // January 1st of current year
            lt: new Date(currentYear + 1, 0, 1) // January 1st of next year
          }
        }
      })

      return !resetLog
    } catch (error) {
      console.error('[BARREL_RESET] Error checking if reset is needed:', error)
      return false
    }
  }

  /**
   * Get barrel reset statistics
   */
  async getBarrelResetStats() {
    try {
      const users = await db.user.findMany({
        select: {
          barrelsRemaining: true
        }
      })

      const totalUsers = users.length
      const usersWithBarrels = users.filter(u => u.barrelsRemaining > 0).length
      const averageBarrelsRemaining = totalUsers > 0 
        ? users.reduce((sum, u) => sum + u.barrelsRemaining, 0) / totalUsers 
        : 0

      // Get last reset date
      const lastResetLog = await db.log.findFirst({
        where: {
          action: 'BARREL_RESET'
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      return {
        totalUsers,
        usersWithBarrels,
        averageBarrelsRemaining,
        lastResetDate: lastResetLog?.createdAt
      }
    } catch (error) {
      console.error('[BARREL_RESET] Error getting barrel reset stats:', error)
      return {
        totalUsers: 0,
        usersWithBarrels: 0,
        averageBarrelsRemaining: 0
      }
    }
  }

  /**
   * Manual trigger for barrel reset (admin only)
   */
  async manualBarrelReset(adminId) {
    try {
      console.log(`[BARREL_RESET] Manual barrel reset triggered by admin ${adminId}`)
      
      // Log the manual reset initiation
      await db.log.create({
        data: {
          userId: adminId,
          action: 'MANUAL_BARREL_RESET',
          details: 'Admin triggered manual barrel reset'
        }
      })

      await this.resetAllUserBarrels()

      // Log the manual reset completion
      await db.log.create({
        data: {
          userId: adminId,
          action: 'MANUAL_BARREL_RESET_COMPLETE',
          details: 'Manual barrel reset completed successfully'
        }
      })
    } catch (error) {
      console.error('[BARREL_RESET] Error during manual barrel reset:', error)
      throw error
    }
  }
}

export const barrelResetService = new BarrelResetService()