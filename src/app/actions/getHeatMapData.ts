import { quizes, questions, quizSubmissions, users } from "@/db/schema";
import { auth } from "@/auth";
import { db } from "@/db";
import { count, eq, avg, sql } from "drizzle-orm";

const getHeatMaPData = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return;
  }

  const data = await db
    .select({
      createdAt: quizSubmissions.createdAt,
      count: sql<number>`cast(count(${quizSubmissions.id}) as int)`,
    })
    .from(quizSubmissions)
    .innerJoin(quizes, eq(quizSubmissions.quizId, quizes.id))
    .innerJoin(users, eq(quizes.userId, users.id))
    .groupBy(quizSubmissions.createdAt);

  return { data };
};

export default getHeatMaPData;
