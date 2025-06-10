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

  const { name, logoUrl, slideImage1Url, slideImage2Url, slideImage3Url } =
    data;

  // Simple validation
  if (
    !name ||
    !logoUrl ||
    !slideImage1Url ||
    !slideImage2Url ||
    !slideImage3Url
  ) {
    console.log(name, logoUrl, slideImage1Url, slideImage2Url, slideImage3Url);
    return Response.json({ error: "Missing required fields" }, { status: 400 });
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
        slideImage1Url,
        slideImage2Url,
        slideImage3Url,
        approved: false,
      })
      .where(eq(schools.userId, userId));
  } else {
    // Create new school
    await db.insert(schools).values({
      userId,
      name,
      logoUrl,
      slideImage1Url,
      slideImage2Url,
      slideImage3Url,
      approved: false,
    });
  }

  return Response.json({ message: "School profile saved" }, { status: 200 });
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session || !session.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const existing = await db.query.schools.findFirst({
    where: eq(schools.userId, session.user.id),
  });

  if (!existing) {
    return new Response("Not Found", { status: 404 });
  }

  return Response.json(existing);
}
