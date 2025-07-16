// import nodemailer from "nodemailer";
// import dotenv from "dotenv";
import nodemailer from "nodemailer";

// dotenv.config(); // Load environment variables

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Replace with your SMTP host (e.g., "smtp.gmail.com")
  port: 587, // Or 465 for secure SSL, 587 for STARTTLS
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional: Verify connection (recommended for debugging)
transporter.verify(function (error, success) {
  if (error) {
    console.error("Nodemailer connection error:", error);
  } else {
    console.log("Nodemailer server is ready to take our messages");
  }
});

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const info = await transporter.sendMail({
      from: `"Your App Name" <${process.env.EMAIL_USER}>`, // Sender address
      to: to, // Recipient's email
      subject: subject, // Subject line
      html: html, // HTML body
    });
    console.log("Message sent: %s", info.messageId);
    // You can also get a preview URL for ethereal.email test accounts
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email to %s:", to, error);
    throw error; // Re-throw to handle it further up the call stack if needed
  }
}
