import { Resend } from 'resend';

let resend;
const getResend = () => {
  if (!resend) resend = new Resend(process.env.RESEND_API_KEY);
  return resend;
};
const host = process.env.HOST;
const sendingEmail = process.env.SENDING_EMAIL || 'onboarding@resend.dev';

export const createResetPasswordEmail = (receiverEmail, resetTokenValue) => ({
  to: receiverEmail,
  from: sendingEmail,
  subject: 'Reset password link',
  html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n Please click on the following link, or paste this into your browser to complete the process:\n\n
  <a href="http://${host}/login/reset/${resetTokenValue}">http://${host}/login/reset/${resetTokenValue}</a> \n\n If you did not request this, please ignore this email and your password will remain unchanged.\n </p>`,
});

export const createResetConfirmationEmail = (receiverEmail) => ({
  to: receiverEmail,
  from: sendingEmail,
  subject: 'Your password has been changed',
  html: `<p>This is a confirmation that the password for your account ${receiverEmail} has just been changed. </p>`,
});

export const createVerificationEmail = (receiverEmail, verificationTokenValue) => ({
  to: receiverEmail,
  from: sendingEmail,
  subject: 'Email Verification',
  html: `<p>Please verify your account by clicking the link:
  <a href="http://${host}/account/confirm/${verificationTokenValue}">http://${host}/account/confirm/${verificationTokenValue}</a> </p>`,
});

export const sendEmail = async (email) => getResend().emails.send(email);

export default {
  createResetPasswordEmail,
  createResetConfirmationEmail,
  createVerificationEmail,
  sendEmail,
};
