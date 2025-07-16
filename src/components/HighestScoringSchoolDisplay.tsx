// app/components/HighestScoringSchoolDisplay.tsx
// This component should be a client component as it uses hooks like useState and useEffect.
"use client";

import React, { useState, useEffect } from "react";

// Define the type for the school data you expect from the API
interface SchoolData {
  schoolId: string;
  schoolName: string;
  totalScore: string; // totalScore is returned as a string from sum() in Drizzle
}

/**
 * HighestScoringSchoolDisplay Component
 * This component fetches and displays the school with the highest total score
 * by calling the /api/schools/highest-score API route.
 */
export default function HighestScoringSchoolDisplay() {
  const [highestScoringSchool, setHighestScoringSchool] =
    useState<SchoolData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Fetches the highest scoring school data from the API.
     * This async function is called inside useEffect to handle data fetching.
     */
    const fetchHighestScoringSchool = async () => {
      try {
        setLoading(true); // Set loading to true before starting the fetch
        setError(null); // Clear any previous errors

        const response = await fetch("/api/schools/highest-score"); // Call your API route

        if (!response.ok) {
          // If the response is not OK (e.g., 404, 500), throw an error
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch data.");
        }

        const data: SchoolData = await response.json(); // Parse the JSON response
        setHighestScoringSchool(data); // Update state with the fetched data
      } catch (err: any) {
        // Catch any errors during the fetch process
        console.error("Error fetching highest scoring school:", err);
        setError(err.message || "An unexpected error occurred."); // Set the error message
      } finally {
        setLoading(false); // Set loading to false after fetch completes (whether success or error)
      }
    };

    fetchHighestScoringSchool(); // Execute the fetch function when the component mounts
  }, []); // Empty dependency array means this effect runs once after the initial render

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-700">
            Loading highest scoring school...
          </p>
          {/* Simple loading spinner */}
          <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100">
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <p className="text-lg text-red-700">Error: {error}</p>
          <p className="text-sm text-gray-500 mt-2">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!highestScoringSchool) {
    return (
      <div className="flex justify-center items-center h-screen bg-yellow-100">
        <div className="p-6 bg-white rounded-lg shadow-md text-center">
          <p className="text-lg text-yellow-700">
            No highest scoring school found.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            It might be that no quiz submissions exist yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-blue-100 font-inter">
      <div className="p-8 bg-white rounded-xl shadow-lg border border-blue-200 w-full max-w-md">
        <h1 className="text-3xl font-bold text-blue-800 mb-4 text-center">
          🏆 Top School Leaderboard 🏆
        </h1>
        <div className="text-center">
          <p className="text-xl text-gray-800 mb-2">
            The school with the highest total score is:
          </p>
          <p className="text-4xl font-extrabold text-blue-600 mb-2">
            {highestScoringSchool.schoolName}
          </p>
          <p className="text-2xl text-gray-700">
            with a total score of:{" "}
            <span className="font-bold text-green-600">
              {highestScoringSchool.totalScore}
            </span>
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-6 text-center">
          Data updated on: {new Date().toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
