import EmailService from '../services/emailServices.js';

const contactController = {
  submitContact: async (req, res) => {
    const { firstName, lastName, email, message } = req.body;
    if (!email || !message) {
      return res.status(400).json({ message: 'Email and message are required' });
    }
    try {
      const emailData = {
        to: process.env.SENDING_EMAIL || 'hello@dancalabs.com',
        from: process.env.SENDING_EMAIL || 'onboarding@resend.dev',
        subject: `Contact Form: ${firstName || ''} ${lastName || ''}`.trim(),
        html: `<p><strong>From:</strong> ${firstName || ''} ${lastName || ''} (${email})</p><p>${message}</p>`,
      };
      await EmailService.sendEmail(emailData);
      return res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to send message. Please try again.' });
    }
  },
};

export default contactController;
