import { quizes, questions, quizSubmissions, users } from "@/db/schema";
import { auth } from "@/auth";
import { db } from "@/db";
import { count, eq, avg } from "drizzle-orm";

const getUserMetrics = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return;
  }

  //get total # of user quizes
  const numQuizes = await db
    .select({ value: count() })
    .from(quizes)
    .where(eq(quizes.userId, userId));

  // get total # of questions
  const numQuestions = await db
    .select({ value: count() })
    .from(questions)
    .innerJoin(quizes, eq(questions.quizId, quizes.id))
    .innerJoin(users, eq(quizes.userId, users.id));
  // .where(eq(users.id, userId));

  // get total # of submissions
  const numSubmissions = await db
    .select({ value: count() })
    .from(quizSubmissions)
    .innerJoin(quizes, eq(quizSubmissions.quizId, quizes.id))
    .innerJoin(users, eq(quizes.userId, users.id));
  // .where(eq(users.id, userId));

  // get the average score
  const avgScore = await db
    .select({ value: avg(quizSubmissions.score) })
    .from(quizSubmissions)
    .innerJoin(quizes, eq(quizSubmissions.quizId, quizes.id))
    .innerJoin(users, eq(quizes.userId, users.id))
    .where(eq(users.id, userId));

  // return {
  //   numQuizes: numQuizes[0],
  //   numQuestions: numQuestions[0],
  //   numSubmissions: numSubmissions[0],
  // };

  return [
    { label: "# of Quizes", value: numQuizes[0].value },
    { label: "# of Questions", value: numQuestions[0].value },
    { label: "# of Submissions", value: numSubmissions[0].value },
    { label: "Average Score", value: avgScore[0].value },
  ];
};

export default getUserMetrics;
