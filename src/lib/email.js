class EmailService {
  async sendBookingConfirmation(email, userName, bookingId, paymentMethod) {
    const subject = "Gas Cylinder Booking Confirmation"
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Gas Agency System</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Booking Confirmation</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Hello ${userName},</h2>
          <p style="color: #666; line-height: 1.6;">Thank you for booking with us! Your gas cylinder booking has been received and is being processed.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Booking ID:</td>
                <td style="padding: 8px 0; color: #333; font-family: monospace;">${bookingId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Payment Method:</td>
                <td style="padding: 8px 0; color: #333;">${paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paytm QR'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Status:</td>
                <td style="padding: 8px 0; color: #f39c12;">Pending Approval</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #27ae60;">
            <h4 style="color: #27ae60; margin-top: 0;">What's Next?</h4>
            <ul style="color: #666; margin: 10px 0; padding-left: 20px;">
              <li>Your booking will be reviewed by our admin team</li>
              <li>You'll receive another email once your booking is approved</li>
              <li>Delivery will be scheduled after approval</li>
              <li>For ${paymentMethod === 'COD' ? 'COD' : 'Paytm'} payments, verification will be done at delivery</li>
            </ul>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 20px;">
            If you have any questions or need to make changes to your booking, please contact our support team.
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              © 2024 Gas Agency System. All rights reserved.
            </p>
            <p style="color: #999; font-size: 14px; margin: 5px 0 0 0;">
              This is an automated email. Please do not reply.
            </p>
          </div>
        </div>
      </div>
    `

    return this.sendEmail({ to: email, subject, html })
  }

  async sendBookingApproval(email, userName, bookingId) {
    const subject = "Your Gas Cylinder Booking Has Been Approved!"
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🎉 Booking Approved!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your gas cylinder is on its way</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Great news, ${userName}!</h2>
          <p style="color: #666; line-height: 1.6;">Your gas cylinder booking has been approved and is now being prepared for delivery.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Booking ID:</td>
                <td style="padding: 8px 0; color: #333; font-family: monospace;">${bookingId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Status:</td>
                <td style="padding: 8px 0; color: #27ae60; font-weight: bold;">Approved</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Estimated Delivery:</td>
                <td style="padding: 8px 0; color: #333;">Within 24-48 hours</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <h4 style="color: #856404; margin-top: 0;">Delivery Information</h4>
            <ul style="color: #666; margin: 10px 0; padding-left: 20px;">
              <li>Our delivery team will contact you before arrival</li>
              <li>Please ensure someone is available to receive the cylinder</li>
              <li>Have your payment ready if you selected Cash on Delivery</li>
              <li>Keep your booking ID handy for reference</li>
            </ul>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 20px;">
            Thank you for choosing our Gas Agency System. We're committed to providing you with the best service!
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              © 2024 Gas Agency System. All rights reserved.
            </p>
            <p style="color: #999; font-size: 14px; margin: 5px 0 0 0;">
              This is an automated email. Please do not reply.
            </p>
          </div>
        </div>
      </div>
    `

    return this.sendEmail({ to: email, subject, html })
  }

  async sendBookingRejection(email, userName, bookingId, reason) {
    const subject = "Regarding Your Gas Cylinder Booking"
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Booking Update</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Information about your booking</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Hello ${userName},</h2>
          <p style="color: #666; line-height: 1.6;">We regret to inform you that your gas cylinder booking could not be processed at this time.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Booking ID:</td>
                <td style="padding: 8px 0; color: #333; font-family: monospace;">${bookingId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Status:</td>
                <td style="padding: 8px 0; color: #e74c3c; font-weight: bold;">Rejected</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #f8d7da; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545;">
            <h4 style="color: #721c24; margin-top: 0;">Reason for Rejection</h4>
            <p style="color: #666; margin: 10px 0; line-height: 1.6;">${reason}</p>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #27ae60; margin-top: 20px;">
            <h4 style="color: #27ae60; margin-top: 0;">What You Can Do</h4>
            <ul style="color: #666; margin: 10px 0; padding-left: 20px;">
              <li>Review the reason provided above</li>
              <li>Make a new booking if the issue is resolved</li>
              <li>Contact our support team if you need assistance</li>
              <li>Check your remaining barrel count in your dashboard</li>
            </ul>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 20px;">
            We apologize for any inconvenience and appreciate your understanding.
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              © 2024 Gas Agency System. All rights reserved.
            </p>
            <p style="color: #999; font-size: 14px; margin: 5px 0 0 0;">
              This is an automated email. Please do not reply.
            </p>
          </div>
        </div>
      </div>
    `

    return this.sendEmail({ to: email, subject, html })
  }

  async sendDeliveryConfirmation(email, userName, bookingId, deliveryNotes) {
    const subject = "Your Gas Cylinder Has Been Delivered!"
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">✅ Delivered Successfully!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your gas cylinder has been delivered</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Hello ${userName},</h2>
          <p style="color: #666; line-height: 1.6;">Great news! Your gas cylinder has been successfully delivered. We hope you're satisfied with our service.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">Delivery Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Booking ID:</td>
                <td style="padding: 8px 0; color: #333; font-family: monospace;">${bookingId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Status:</td>
                <td style="padding: 8px 0; color: #28a745; font-weight: bold;">Delivered</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Delivered On:</td>
                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</td>
              </tr>
            </table>
            ${deliveryNotes ? `
            <div style="margin-top: 15px; padding: 10px; background: #e3f2fd; border-radius: 4px;">
              <strong>Delivery Notes:</strong> ${deliveryNotes}
            </div>
            ` : ''}
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <h4 style="color: #856404; margin-top: 0;">Safety Instructions</h4>
            <ul style="color: #666; margin: 10px 0; padding-left: 20px;">
              <li>Store the cylinder in a well-ventilated area</li>
              <li>Keep away from heat sources and open flames</li>
              <li>Check for leaks before use</li>
              <li>Ensure proper connection to your appliance</li>
            </ul>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #27ae60; margin-top: 20px;">
            <h4 style="color: #27ae60; margin-top: 0;">Need Another Cylinder?</h4>
            <p style="color: #666; margin: 10px 0; line-height: 1.6;">
              You can book your next cylinder through your dashboard. Remember, you have ${this.getRemainingBarrelsMessage()} for this year.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 20px;">
            Thank you for choosing our Gas Agency System. We look forward to serving you again!
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              © 2024 Gas Agency System. All rights reserved.
            </p>
            <p style="color: #999; font-size: 14px; margin: 5px 0 0 0;">
              This is an automated email. Please do not reply.
            </p>
          </div>
        </div>
      </div>
    `

    return this.sendEmail({ to: email, subject, html })
  }

  async sendAccountBalanceNotification(email, userName, barrelsRemaining, action = 'used') {
    const subject = "Gas Agency - Account Balance Update"
    const isLowBalance = barrelsRemaining <= 3
    const actionText = action === 'used' ? 'used' : (action === 'reset' ? 'reset to' : 'updated to')
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${isLowBalance ? '#f39c12' : '#3498db'} 0%, ${isLowBalance ? '#e67e22' : '#2980b9'} 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">📊 Account Balance Update</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your cylinder allocation status</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Hello ${userName},</h2>
          <p style="color: #666; line-height: 1.6;">Your cylinder allocation has been ${actionText}. Here's your current balance:</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">Current Balance</h3>
            <div style="font-size: 48px; font-weight: bold; color: ${isLowBalance ? '#f39c12' : '#27ae60'}; margin: 10px 0;">
              ${barrelsRemaining}
            </div>
            <p style="color: #666; margin: 0; font-size: 16px;">cylinders remaining out of 12</p>
          </div>
          
          ${isLowBalance ? `
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
            <h4 style="color: #856404; margin-top: 0;">⚠️ Low Balance Alert</h4>
            <p style="color: #666; margin: 10px 0; line-height: 1.6;">
              You have only ${barrelsRemaining} cylinder${barrelsRemaining === 1 ? '' : 's'} remaining for this year. 
              Consider planning your usage carefully or request an extra cylinder with admin approval.
            </p>
          </div>
          ` : `
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #27ae60;">
            <h4 style="color: #27ae60; margin-top: 0;">✅ Good Balance</h4>
            <p style="color: #666; margin: 10px 0; line-height: 1.6;">
              You have ${barrelsRemaining} cylinder${barrelsRemaining === 1 ? '' : 's'} remaining for this year. 
              You can continue booking cylinders as needed.
            </p>
          </div>
          `}
          
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; border-left: 4px solid #2196f3; margin-top: 20px;">
            <h4 style="color: #1565c0; margin-top: 0;">💡 Helpful Information</h4>
            <ul style="color: #666; margin: 10px 0; padding-left: 20px;">
              <li>Your allocation resets to 12 cylinders every January 1st</li>
              <li>You can request extra cylinders with admin approval</li>
              <li>Check your dashboard for booking history and current orders</li>
              <li>Contact support if you have any questions about your allocation</li>
            </ul>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 20px;">
            Thank you for using our Gas Agency System. We're here to ensure you never run out of gas!
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              © 2024 Gas Agency System. All rights reserved.
            </p>
            <p style="color: #999; font-size: 14px; margin: 5px 0 0 0;">
              This is an automated email. Please do not reply.
            </p>
          </div>
        </div>
      </div>
    `

    return this.sendEmail({ to: email, subject, html })
  }

  async sendTransactionAcknowledgment(email, userName, transactionDetails) {
    const { bookingId, action, paymentAmount, paymentMethod, status } = transactionDetails
    const subject = "Gas Agency - Transaction Acknowledgment"
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🧾 Transaction Receipt</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Payment acknowledgment</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0;">Hello ${userName},</h2>
          <p style="color: #666; line-height: 1.6;">This is to acknowledge the transaction for your gas cylinder booking.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0; font-size: 18px;">Transaction Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Booking ID:</td>
                <td style="padding: 8px 0; color: #333; font-family: monospace;">${bookingId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Action:</td>
                <td style="padding: 8px 0; color: #333;">${action}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Payment Method:</td>
                <td style="padding: 8px 0; color: #333;">${paymentMethod === 'COD' ? 'Cash on Delivery' : 'Paytm QR'}</td>
              </tr>
              ${paymentAmount ? `
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Amount:</td>
                <td style="padding: 8px 0; color: #333; font-weight: bold;">₹${paymentAmount}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Status:</td>
                <td style="padding: 8px 0; color: ${status === 'DELIVERED' ? '#27ae60' : (status === 'APPROVED' ? '#f39c12' : '#e74c3c')}; font-weight: bold;">${status}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #666; font-weight: bold;">Date:</td>
                <td style="padding: 8px 0; color: #333;">${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; border-left: 4px solid #27ae60;">
            <h4 style="color: #27ae60; margin-top: 0;">📋 Keep This Record</h4>
            <p style="color: #666; margin: 10px 0; line-height: 1.6;">
              Please keep this email as a record of your transaction. You can reference the booking ID for any future inquiries.
            </p>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-top: 20px;">
            Thank you for your business. If you have any questions about this transaction, please contact our support team.
          </p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
            <p style="color: #999; font-size: 14px; margin: 0;">
              © 2024 Gas Agency System. All rights reserved.
            </p>
            <p style="color: #999; font-size: 14px; margin: 5px 0 0 0;">
              This is an automated email. Please do not reply.
            </p>
          </div>
        </div>
      </div>
    `

    return this.sendEmail({ to: email, subject, html })
  }

  getRemainingBarrelsMessage() {
    // This would normally fetch from the database, but for email template we'll use a placeholder
    return "your remaining barrel allocation"
  }

  async sendEmail(options) {
    try {
      // In a real implementation, you would use a service like:
      // - SendGrid
      // - AWS SES
      // - Mailgun
      // - Nodemailer with SMTP
      
      // For this demo, we'll simulate email sending
      console.log(`[EMAIL] Sending email to ${options.to}`)
      console.log(`[EMAIL] Subject: ${options.subject}`)
      console.log(`[EMAIL] Content: ${options.html.substring(0, 100)}...`)
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Log the email action
      console.log(`[EMAIL] Email sent successfully to ${options.to}`)
      
      return true
    } catch (error) {
      console.error('Email sending failed:', error)
      return false
    }
  }
}

export const emailService = new EmailService()