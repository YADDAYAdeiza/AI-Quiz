import { db } from "@/db"; // Your Drizzle ORM database instance
import { users } from "@/db/schema"; // Your users schema definition
import { sendEmail } from "./mailer"; // Path to your mailer utility
import { sql } from "drizzle-orm";

interface EmailContent {
  subject: string;
  html: string;
}

export async function sendBulkEmailToAllUsers(
  emailContent: EmailContent
): Promise<void> {
  try {
    // 1. Fetch all user emails from the database
    const allUsers = await db
      .select({
        email: users.email,
        name: users.name, // Optional: if you want to personalize emails
      })
      .from(users);

    if (allUsers.length === 0) {
      console.log("No users found to send emails to.");
      return;
    }

    console.log(`Sending emails to ${allUsers.length} users...`);

    // 2. Iterate and send emails
    for (const user of allUsers) {
      if (user.email) {
        // Ensure the email exists
        try {
          // You can personalize the email content here if 'user.name' is available
          const personalizedHtml = emailContent.html.replace(
            "{{userName}}",
            user.name || "there"
          );
          await sendEmail(user.email, emailContent.subject, personalizedHtml);
          console.log(`Email sent successfully to ${user.email}`);
        } catch (emailError) {
          console.error(`Failed to send email to ${user.email}:`, emailError);
          // Decide whether to continue or stop on individual email failures
        }
      }
    }
    console.log("Bulk email sending process completed.");
  } catch (dbError) {
    console.error("Error fetching users from database:", dbError);
    throw new Error("Failed to fetch users for bulk email.");
  }
}

// Example usage:
// (async () => {
//   try {
//     await sendBulkEmailToAllUsers({
//       subject: "Exciting News from Our App!",
//       html: "<p>Hello {{userName}},</p><p>We have some exciting updates for you!</p><p>Best regards,<br>The App Team</p>"
//     });
//   } catch (error) {
//     console.error("An error occurred during bulk email operation:", error);
//   }
// })();
