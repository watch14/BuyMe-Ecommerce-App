import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create a transporter object
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for port 465, false for other ports
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_PASS, // Your app-specific password
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Export a function to send emails
export const sendEmail = (to, subject, text, html) => {
  const mailOptions = {
    from: process.env.GMAIL_USER, // Your Gmail address
    to, // Recipient's email address
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
};

// Clear the cart after creating the receipt
// cart.products = [];
// await cart.save();   maamounchebbi@gmail.com
