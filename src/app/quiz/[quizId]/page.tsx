import { db } from "@/db";

import { quizes } from "@/db/schema";
import { eq } from "drizzle-orm";
import QuizQuestions from "../QuizQuestions";

const page = async ({
  params,
}: {
  params: {
    quizId: string;
  };
}) => {
  const quizId = params.quizId;
  const quiz = await db.query.quizes.findFirst({
    where: eq(quizes.id, parseInt(quizId)),
    with: {
      questions: {
        with: {
          answers: true,
        },
      },
    },
  });

  if (!quizId || !quiz || quiz.questions.length === 0) {
    return <div>Quiz not found</div>;
  }

  return <QuizQuestions quiz={quiz} />;
};

export default page;
