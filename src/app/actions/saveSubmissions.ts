"use server";

import { db } from "@/db";
import { quizSubmissions } from "@/db/schema";
import { auth } from "@/auth";
import { InferInsertModel, eq } from "drizzle-orm";

type Submission = InferInsertModel<typeof quizSubmissions>;

export async function saveSubmission(sub: Submission, quizId: number) {
  const { score } = sub;

  const newSubmission = await db
    .insert(quizSubmissions)
    .values({
      score,
      quizId,
    })
    .returning({ insertId: quizSubmissions.id });

  const submissionId = newSubmission[0].insertId;
  return submissionId;
}
