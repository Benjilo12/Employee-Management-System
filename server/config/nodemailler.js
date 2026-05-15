import { createTransport } from "nodemailer";

// Configure the Nodemailer SMTP transporter for sending emails.
// The SMTP credentials are loaded from environment variables for security.
const transporter = createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// sendEmail sends an email using the configured transporter.
// `to` is the recipient address, `subject` is the message subject,
// and `body` is the HTML content of the email.
const sendEmail = async ({ to, subject, body }) => {
  const response = await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html: body,
  });

  // Return the response object from Nodemailer for any caller handling.
  return response;
};

export default sendEmail;
