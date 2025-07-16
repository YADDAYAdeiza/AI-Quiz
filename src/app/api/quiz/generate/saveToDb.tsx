import { db } from "@/db";
import { quizes, questions as dbQuestions, questionAnswers } from "@/db/schema";
import { auth } from "@/auth"; //my introduction
import { InferInsertModel } from "drizzle-orm";
import { NextResponse } from "next/server";
import { sendBulkEmailToAllUsers } from "@/lib/email";

type Quiz = InferInsertModel<typeof quizes>;
type Question = InferInsertModel<typeof dbQuestions>;
type Answer = InferInsertModel<typeof questionAnswers>;

interface SaveQuizData extends Quiz {
  questions: Array<Question & { answers?: Answer[] }>;
}

// 👇 Add this return type annotation
export default async function saveQuiz(
  quizData: SaveQuizData
): Promise<{ quizId: number }> {
  const session = await auth();

  if (!session?.user?.id) {
    // ❌ This line causes type conflict
    // return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // ✅ FIX: Throw an error instead, so the caller handles it
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const { name, description, questions } = quizData;

  const newQuiz = await db
    .insert(quizes)
    .values({
      name,
      description,
      userId,
    })
    .returning({ insertedId: quizes.id });

  const quizId = newQuiz[0].insertedId;

  await db.transaction(async (tx) => {
    for (const question of questions) {
      const [{ questionId }] = await tx
        .insert(dbQuestions)
        .values({
          questionText: question.questionText,
          quizId,
        })
        .returning({ questionId: dbQuestions.id });

      if (question.answers && question.answers.length > 0) {
        await tx.insert(questionAnswers).values(
          question.answers.map((answer) => ({
            answerText: answer.answerText,
            isCorrect: answer.isCorrect,
            questionId,
          }))
        );
      }
    }
  });
  const subject = "Important Update: New Features Live Now!";

  // Hardcoded HTML content (very basic)
  const htmlContent = `
  <p>Hello {{userName}},</p>
  <p>We're thrilled to announce that exciting new features have just been launched on our platform!</p>
  <p>Here's what's new:</p>
  <ul>
    <li>Enhanced User Profiles</li>
    <li>Improved Search Functionality</li>
    <li>New Dashboard Widgets</li>
  </ul>
  <p>Log in now to check them out!</p>
  <p><a href="https://your-app.com/dashboard" style="background-color:#007bff;color:#ffffff;padding:10px 20px;text-decoration:none;border-radius:5px;">Go to Dashboard</a></p>
  <p>Best regards,<br>The [Your App Name] Team</p>
  <p style="font-size:0.8em;color:#888;">If you no longer wish to receive these emails, you can <a href="https://your-app.com/unsubscribe">unsubscribe here</a>.</p>
`;
  await sendBulkEmailToAllUsers({ subject, html: htmlContent });
  return { quizId }; // ✅ Now TypeScript knows this is { quizId: number }
}
