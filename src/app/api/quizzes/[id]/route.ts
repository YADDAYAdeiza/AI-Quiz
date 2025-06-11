import { NextResponse } from "next/server";
import { db } from "@/db";
import { quizes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const quizId = Number(params.id);
  if (isNaN(quizId)) {
    return NextResponse.json({ error: "Invalid quiz ID" }, { status: 400 });
  }

  // Optional: Ensure the quiz belongs to the user
  const existing = await db.query.quizes.findFirst({
    where: (q) => eq(q.id, quizId),
  });

  if (!existing || existing.userId !== userId) {
    return NextResponse.json(
      { error: "Not found or access denied" },
      { status: 404 }
    );
  }

  await db.delete(quizes).where(eq(quizes.id, quizId));

  return NextResponse.json({ success: true });
}
