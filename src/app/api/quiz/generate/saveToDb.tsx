import { db } from "@/db";
import { quizes, questions as dbQuestions, questionAnswers } from "@/db/schema";
import { auth } from "@/auth"; //my introduction
import { InferInsertModel } from "drizzle-orm";
import { NextResponse } from "next/server";

type Quiz = InferInsertModel<typeof quizes>;
type Question = InferInsertModel<typeof dbQuestions>;
type Answer = InferInsertModel<typeof questionAnswers>;

interface SaveQuizData extends Quiz {
  questions: Array<Question & { answers?: Answer[] }>;
}

// 👇 Add this return type annotation
export default async function saveQuiz(quizData: SaveQuizData): Promise<{ quizId: number }> {
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

  return { quizId }; // ✅ Now TypeScript knows this is { quizId: number }
}
