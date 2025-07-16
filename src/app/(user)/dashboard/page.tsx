// import React, { useState } from "react";
// import { db } from "@/db";
// import { eq } from "drizzle-orm";
// import { quizes } from "@/db/schema";
// import { auth } from "@/auth";
// import QuizesTable, { Quiz } from "./QuizesTable";
// import getUserMetrics from "@/actions/getUserMetrics";
// import getHeatMapData from "@/actions/getHeatMapData";
// import MetricCard from "./MetricCard";
// import dynamic from "next/dynamic";
// import SubscribeBtn from "../billing/SubscribeBtn";
// const SubmissionsHeatMap = dynamic(() => import("./HeatMap"), { ssr: false });
// import { PRICE_ID } from "@/lib/utils";
// import QuizesClient from "./QuizesClient"; // new client component

// type Props = {};

// const page = async (props: Props) => {
//   const session = await auth();
//   const userId = session?.user?.id;

//   if (!userId) {
//     return <p>User not found</p>;
//   }

//   const userQuizes: Quiz[] = await db.query.quizes.findMany({
//     where: eq(quizes.userId, userId),
//   });
//   const userData = await getUserMetrics();
//   const heatMapData = await getHeatMapData();
//   console.log(heatMapData);

//   // return (
//   //   <div className="mt-4">
//   //     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//   //       {userData && userData?.length > 0 ? (
//   //         <>
//   //           {userData?.map((metric) => (
//   //             <MetricCard
//   //               key={metric.label}
//   //               label={metric.label}
//   //               value={metric.value}
//   //             />
//   //           ))}
//   //         </>
//   //       ) : null}
//   //     </div>
//   //     <div>
//   //       {heatMapData ? <SubmissionsHeatMap data={heatMapData.data} /> : null}
//   //     </div>
//   //     <QuizesTable quizes={userQuizes} />;
//   //   </div>
//   // );
//   return <QuizesClient initialQuizes={userQuizes} />;
// };

// export default page;

// app/quizzes/page.tsx (or your relevant page.tsx file)

// This is a Server Component, so no "use client" directive here.
// It fetches data on the server before rendering.

import React from "react"; // React is needed for JSX
import { db } from "@/db"; // Adjust path to your Drizzle DB client
import { users, quizes } from "@/db/schema"; // Import your Drizzle schema tables, including 'users'
import { eq } from "drizzle-orm"; // Import 'eq' for equality checks

// Removed 'auth' import as we are no longer relying on the current session for filtering
// import { auth } from "@/auth";

import QuizesTable, { Quiz } from "./QuizesTable"; // Re-import QuizesTable and Quiz type
import getUserMetrics from "@/actions/getUserMetrics"; // Keep if these are still needed for other parts of the page
import getHeatMapData from "@/actions/getHeatMapData"; // Keep if these are still needed for other parts of the page
import MetricCard from "./MetricCard"; // Keep if these are still needed for other parts of the page
import dynamic from "next/dynamic"; // Keep if these are still needed for other parts of the page
import SubscribeBtn from "../billing/SubscribeBtn"; // Keep if these are still needed for other parts of the page
const SubmissionsHeatMap = dynamic(() => import("./HeatMap"), { ssr: false }); // Keep if these are still needed for other parts of the page
import { PRICE_ID } from "@/lib/utils"; // Keep if these are still needed for other parts of the page
import QuizesClient from "./QuizesClient"; // Your new client component

type Props = {};

/**
 * Page component that fetches quizzes for a specific user email
 * and passes them to the QuizesClient component.
 * It now filters quizzes based on a hardcoded email 'hiscript@gmail.com'.
 */
const page = async (props: Props) => {
  // Define the specific email to filter quizzes by
  const targetEmail = "hiscript@gmail.com";

  let initialQuizes: Quiz[] = [];
  let userFound = false;

  try {
    // 1. Find the user by their email
    // We use .limit(1) as email should be unique
    const [targetUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, targetEmail));

    if (targetUser) {
      userFound = true;
      // 2. If the user is found, fetch all quizzes associated with that user's ID
      // Using Drizzle's relation query for convenience
      const quizzesForTargetUser = await db.query.quizes.findMany({
        where: eq(quizes.userId, targetUser.id),
      });

      // Assign the fetched quizzes to initialQuizes
      initialQuizes = quizzesForTargetUser as Quiz[];
      console.log(`Found ${initialQuizes.length} quizzes for ${targetEmail}`);
    } else {
      console.log(
        `User with email ${targetEmail} not found. No quizzes will be displayed for this email.`
      );
      // If the user isn't found, initialQuizes remains an empty array.
    }
  } catch (error) {
    console.error("Error fetching quizzes for specific user:", error);
    // In a real application, you might want to display an error message on the page
    // or handle this gracefully. For now, initialQuizes will remain empty.
  }

  // The rest of your page's data fetching (if still needed)
  // Note: These will run even if targetEmail user is not found,
  // ensure they handle cases where userId might not be relevant if you remove session.
  const userData = await getUserMetrics();
  const heatMapData = await getHeatMapData();
  console.log(heatMapData);

  return (
    <div className="container mx-auto p-4 font-inter">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Quizzes by {targetEmail}
      </h1>

      {/* Display a message if the target user was not found */}
      {!userFound && (
        <p className="text-center text-red-500 mb-4">
          The user with email "{targetEmail}" was not found in the database.
          Please ensure the email is correct and the user exists.
        </p>
      )}

      {/* Render other metrics/components if they are still part of this page */}
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {userData && userData?.length > 0 ? (
            <>
              {userData?.map((metric) => (
                <MetricCard
                  key={metric.label}
                  label={metric.label}
                  value={metric.value}
                />
              ))}
            </>
          ) : null}
        </div>
        <div>
          {heatMapData ? <SubmissionsHeatMap data={heatMapData.data} /> : null}
        </div>
        {/* <QuizesTable quizes={userQuizes} />; // This line was commented out in your original snippet */}
      </div>

      {/* Pass the filtered quizzes to the client component */}
      <QuizesClient initialQuizes={initialQuizes} />
    </div>
  );
};

export default page;
