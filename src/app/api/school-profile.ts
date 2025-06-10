// app/api/school-profile/route.ts (POST)
// import { auth } from "@/lib/auth";
import { auth } from "@/auth";
import { db } from "@/db";
import { schools } from "@/db/schema"; // Adjust path to match your schema file
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const userId = session.user.id;
  const data = await req.json();

  const { name, logoUrl, advertImageUrl } = data;

  // Simple validation
  if (!name || !logoUrl || !advertImageUrl) {
    return new Response("Missing required fields", { status: 400 });
  }

  // Check if the user already has a school profile
  const existing = await db.query.schools.findFirst({
    where: eq(schools.userId, userId),
  });

  if (existing) {
    // Update existing school
    await db
      .update(schools)
      .set({
        name,
        logoUrl,
        advertImageUrl,
        approved: false, // Re-approval required on update
      })
      .where(eq(schools.userId, userId));
  } else {
    // Create new school
    await db.insert(schools).values({
      userId,
      name,
      logoUrl,
      advertImageUrl,
      approved: false,
    });
  }

  return new Response("School profile saved", { status: 200 });
}
