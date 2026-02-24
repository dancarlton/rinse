import { getResend } from './config'
import { Booking, Service, Profile } from '@/types/database'

const FROM_EMAIL = 'Rinse <bookings@rinse-it.com>'

export async function sendBookingConfirmationToCustomer(
  booking: Booking,
  provider: Profile,
  service: Service,
  customerEmail: string
) {
  try {
    const resend = getResend()

    const formattedDate = new Date(booking.scheduled_at).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    const formattedTime = new Date(booking.scheduled_at).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { color: #6b7280; font-weight: 600; }
            .detail-value { color: #111827; font-weight: 500; }
            .total { font-size: 1.25rem; color: #f59e0b; font-weight: bold; padding-top: 15px; border-top: 2px solid #f59e0b; margin-top: 10px; }
            .footer { text-align: center; color: #6b7280; font-size: 0.875rem; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">✓ Booking Confirmed!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your Rinse appointment is all set</p>
            </div>
            <div class="content">
              <p>Hi there!</p>
              <p>Your booking has been confirmed. Here are the details:</p>

              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Service:</span>
                  <span class="detail-value">${service.title}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Provider:</span>
                  <span class="detail-value">${provider.full_name}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span class="detail-value">${formattedTime}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Location:</span>
                  <span class="detail-value">${booking.address}</span>
                </div>
                <div class="detail-row" style="border-bottom: none;">
                  <span class="detail-label">Booking ID:</span>
                  <span class="detail-value">#${booking.id.slice(0, 8)}</span>
                </div>
                <div class="total">
                  <div class="detail-row" style="border-bottom: none; padding-top: 0;">
                    <span>Total Paid:</span>
                    <span>$${booking.amount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <p>Your provider will contact you if there are any changes to your appointment.</p>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://rinse-it.vercel.app/dashboard"
                   style="background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                  View My Bookings
                </a>
              </div>

              <div class="footer">
                <p>Thank you for choosing Rinse!</p>
                <p style="margin-top: 5px;">Questions? Reply to this email or visit our help center.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: 'Your Rinse booking is confirmed',
      html,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send customer confirmation email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function sendNewBookingToProvider(
  booking: Booking,
  customer: Profile,
  service: Service,
  providerEmail: string
) {
  try {
    const resend = getResend()

    const formattedDate = new Date(booking.scheduled_at).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    const formattedTime = new Date(booking.scheduled_at).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })

    // Calculate provider earnings (after platform fee)
    const providerEarnings = booking.amount - booking.platform_fee

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .detail-label { color: #6b7280; font-weight: 600; }
            .detail-value { color: #111827; font-weight: 500; }
            .earnings { font-size: 1.25rem; color: #10b981; font-weight: bold; padding-top: 15px; border-top: 2px solid #10b981; margin-top: 10px; }
            .footer { text-align: center; color: #6b7280; font-size: 0.875rem; margin-top: 30px; }
            .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🔔 New Booking Received!</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">You have a new customer</p>
            </div>
            <div class="content">
              <p>Hi there!</p>
              <p>You've received a new booking from <strong>${customer.full_name}</strong>. Here are the details:</p>

              <div class="booking-details">
                <div class="detail-row">
                  <span class="detail-label">Service:</span>
                  <span class="detail-value">${service.title}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Customer:</span>
                  <span class="detail-value">${customer.full_name}</span>
                </div>
                ${customer.phone ? `
                <div class="detail-row">
                  <span class="detail-label">Customer Phone:</span>
                  <span class="detail-value">${customer.phone}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                  <span class="detail-label">Date:</span>
                  <span class="detail-value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time:</span>
                  <span class="detail-value">${formattedTime}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Location:</span>
                  <span class="detail-value">${booking.address}</span>
                </div>
                <div class="detail-row" style="border-bottom: none;">
                  <span class="detail-label">Booking ID:</span>
                  <span class="detail-value">#${booking.id.slice(0, 8)}</span>
                </div>
                <div class="earnings">
                  <div class="detail-row" style="border-bottom: none; padding-top: 0;">
                    <span>Your Earnings:</span>
                    <span>$${providerEarnings.toFixed(2)}</span>
                  </div>
                  <div style="font-size: 0.75rem; color: #6b7280; font-weight: normal; margin-top: 5px;">
                    (After 15% platform fee: $${booking.platform_fee.toFixed(2)})
                  </div>
                </div>
              </div>

              <div class="alert">
                <strong>⏰ Action Required:</strong> Please confirm your availability or contact the customer if you need to reschedule.
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="https://rinse-it.vercel.app/dashboard/provider"
                   style="background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600;">
                  View in Dashboard
                </a>
              </div>

              <div class="footer">
                <p>Payment will be transferred to your Stripe account after the service is completed.</p>
                <p style="margin-top: 5px;">Questions? Contact support@rinse-it.com</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: providerEmail,
      subject: `New booking from ${customer.full_name}`,
      html,
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Failed to send provider notification email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
