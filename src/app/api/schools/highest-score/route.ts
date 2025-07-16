// // app/api/schools/highest-score/route.ts (or app/api/highest-scoring-school/route.ts)

// import { NextResponse } from "next/server";
// import { eq, sum, desc } from "drizzle-orm"; // Added 'desc' here
// import { db } from "../../../../db"; // Adjust path to your db client based on your project structure
// // import { schools } from "@/db/schema";
// import { schools, quizes, quizSubmissions } from "@/db/schema"; // Adjust path to your schema

// /**
//  * GET handler for retrieving the school with the highest total score across all quizzes.
//  * This function queries the database to calculate the sum of scores for each school
//  * and returns the school with the maximum total score.
//  *
//  * @param {Request} request - The incoming Next.js Request object (not directly used for this simple GET, but part of the signature).
//  * @returns {NextResponse} A JSON response containing the highest scoring school's details
//  * or an error message.
//  */
// export async function GET(request: Request) {
//   try {
//     // Perform the database query using Drizzle ORM
//     const schoolScores = await db
//       .select({
//         schoolId: schools.id,
//         schoolName: schools.name,
//         totalScore: sum(quizSubmissions.score), // Summing up all quiz submission scores for each school
//       })
//       .from(schools)
//       // Joining schools with quizzes based on userId.
//       // This assumes a quiz is associated with a school via the user who created it.
//       // If your association logic is different (e.g., schoolId directly on quizes), adjust this join.
//       .leftJoin(quizes, eq(schools.userId, quizes.userId))
//       // Joining quizzes with quizSubmissions to get the scores
//       .leftJoin(quizSubmissions, eq(quizes.id, quizSubmissions.quizId))
//       // Grouping by school ID and name to aggregate scores per school
//       .groupBy(schools.id, schools.name)
//       // Ordering by total score in descending order to get the highest score first
//       .orderBy(desc(sum(quizSubmissions.score))) // Used 'desc' function here
//       .limit(1); // Limiting to 1 to get only the top school

//     // Check if any school data was found
//     if (schoolScores.length > 0) {
//       const highestScoringSchool = schoolScores[0];
//       console.log(
//         `School with the highest total score: ${highestScoringSchool.schoolName} (Score: ${highestScoringSchool.totalScore})`
//       );
//       // Return the highest scoring school as a JSON response
//       return NextResponse.json(highestScoringSchool, { status: 200 });
//     } else {
//       // If no quiz submissions are found, return a 404 Not Found response
//       console.log("No quiz submissions found.");
//       return NextResponse.json(
//         { message: "No quiz submissions found." },
//         { status: 404 }
//       );
//     }
//   } catch (error: unknown) {
//     // Explicitly type error as unknown
//     // Log the error for debugging purposes
//     console.error("Error calculating school with highest score:", error);

//     let errorMessage = "An unknown error occurred.";
//     if (error instanceof Error) {
//       errorMessage = error.message; // Safely access error.message if it's an Error instance
//     } else if (typeof error === "string") {
//       errorMessage = error; // Handle cases where error might be a string
//     }

//     // Return a 500 Internal Server Error response
//     return NextResponse.json(
//       { message: "Internal server error", error: errorMessage },
//       { status: 500 }
//     );
//   }
// }

// app/api/schools/highest-score/route.ts

import { NextResponse } from "next/server";
import { eq, sum, desc } from "drizzle-orm";
import { db } from "../../../../db"; // Adjust path to your db client based on your project structure
import { schools, quizes, quizSubmissions } from "@/db/schema";
// import { schools, quizes, quizSubmissions } from "../../../db/schema"; // Adjust path to your schema

/**
 * GET handler for retrieving the school with the highest total score across all quizzes,
 * along with its full profile details.
 * This function queries the database to calculate the sum of scores for each school,
 * finds the school with the maximum total score, and returns its complete profile data.
 *
 * @param {Request} request - The incoming Next.js Request object.
 * @returns {NextResponse} A JSON response containing the highest scoring school's full profile details
 * or an error message.
 */
export async function GET(request: Request) {
  try {
    // Perform the database query to find the highest scoring school
    // We select all fields from the 'schools' table (schools.*)
    // and also calculate the total score from quiz submissions.
    const schoolScoresWithProfile = await db
      .select({
        // Select all columns from the schools table
        id: schools.id,
        userId: schools.userId,
        name: schools.name,
        logoUrl: schools.logoUrl,
        slideImage1Url: schools.slideImage1Url,
        slideImage2Url: schools.slideImage2Url,
        slideImage3Url: schools.slideImage3Url,
        approved: schools.approved,
        score: schools.score, // This is the individual school's score, not the aggregated total quiz score
        totalQuizScore: sum(quizSubmissions.score), // The aggregated total score from quizzes
      })
      .from(schools)
      // Left join with 'quizes' table: assuming quizzes are linked to schools via userId
      .leftJoin(quizes, eq(schools.userId, quizes.userId))
      // Left join with 'quizSubmissions' table to get the scores
      .leftJoin(quizSubmissions, eq(quizes.id, quizSubmissions.quizId))
      // Group by all school fields to ensure correct aggregation for each unique school
      .groupBy(
        schools.id,
        schools.userId,
        schools.name,
        schools.logoUrl,
        schools.slideImage1Url,
        schools.slideImage2Url,
        schools.slideImage3Url,
        schools.approved,
        schools.score
      )
      // Order by the aggregated total quiz score in descending order
      .orderBy(desc(sum(quizSubmissions.score)))
      .limit(1); // Limit to 1 to get only the top school

    // Check if any school data was found
    if (schoolScoresWithProfile.length > 0) {
      const highestScoringSchool = schoolScoresWithProfile[0];
      console.log(
        `School with the highest total score: ${highestScoringSchool.name} (Total Quiz Score: ${highestScoringSchool.totalQuizScore})`
      );
      // Return the highest scoring school's full profile and its total quiz score
      return NextResponse.json(highestScoringSchool, { status: 200 });
    } else {
      // If no quiz submissions or schools are found, return a 404 Not Found response
      console.log("No highest scoring school found.");
      return NextResponse.json(
        {
          message:
            "No highest scoring school found. It might be that no quiz submissions exist yet.",
        },
        { status: 404 }
      );
    }
  } catch (error: unknown) {
    console.error("Error calculating school with highest score:", error);

    let errorMessage = "An unknown error occurred.";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return NextResponse.json(
      { message: "Internal server error", error: errorMessage },
      { status: 500 }
    );
  }
}
