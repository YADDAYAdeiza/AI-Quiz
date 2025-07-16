// "use client";

// import { useEffect, useState } from "react";

// interface SchoolProfile {
//   name: string;
//   logoUrl: string;
//   slideImage1Url: string;
//   slideImage2Url: string;
//   slideImage3Url: string;
// }

// export default function SchoolProfileDisplay() {
//   const [profile, setProfile] = useState<SchoolProfile | null>(null);
//   const [error, setError] = useState("");
//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       const res = await fetch("/api/school-profile");

//       if (res.ok) {
//         const data = await res.json();
//         setProfile(data);
//       } else {
//         const err = await res.text();
//         setError(err || "Failed to fetch school profile.");
//       }
//     };

//     fetchProfile();
//   }, []);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % 3);
//     }, 6000);
//     return () => clearInterval(interval);
//   }, []);

//   if (error) {
//     return <div className="text-red-500 text-center">{error}</div>;
//   }

//   if (!profile) {
//     return <div className="text-center text-gray-500">Loading profile...</div>;
//   }

//   const slides = [
//     profile.slideImage1Url,
//     profile.slideImage2Url,
//     profile.slideImage3Url,
//   ];

//   return (
//     <div className="max-w-4xl p-6 bg-white rounded-xl shadow text-center text-black">
//       <img
//         src={profile.logoUrl}
//         alt="School Logo"
//         className="h-24 mx-auto rounded-full border mb-4 object-contain"
//       />
//       <h2 className="text-3xl font-bold mb-4">{profile.name}</h2>

//       <div className="relative w-full h-64 rounded-lg overflow-hidden">
//         {slides.map((url, index) => (
//           <img
//             key={index}
//             src={url}
//             alt={`Advert ${index + 1}`}
//             className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
//               index === currentSlide ? "opacity-100" : "opacity-0"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }

// components/SchoolProfileDisplay.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image"; // Import Image component for optimized images

// Updated interface to match the data returned by the /api/schools/highest-score endpoint
interface SchoolProfile {
  id: string; // Assuming id is returned from the schools table
  userId: string; // Assuming userId is returned
  name: string;
  logoUrl: string;
  slideImage1Url: string;
  slideImage2Url: string;
  slideImage3Url: string;
  approved: boolean;
  score: number; // This is the individual school's 'score' column
  totalQuizScore: string; // The aggregated sum of quiz scores, returned as a string by Drizzle's sum()
}

export default function SchoolProfileDisplay() {
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [error, setError] = useState<string | null>(null); // Initialize error as null
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true); // Start loading
        setError(null); // Clear previous errors

        // Fetch from the API endpoint that returns the highest scoring school
        const res = await fetch("/api/schools/highest-score");

        if (res.ok) {
          const data: SchoolProfile = await res.json();
          setProfile(data);
        } else {
          const errText = await res.text();
          let errorMessage = "Failed to fetch school profile.";
          try {
            const errorJson = JSON.parse(errText);
            errorMessage = errorJson.message || errorMessage;
          } catch {
            // If it's not JSON, use the raw text
            errorMessage = errText || errorMessage;
          }
          setError(errorMessage);
        }
      } catch (err: any) {
        console.error("Network or parsing error:", err);
        setError(err.message || "An unexpected error occurred.");
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    // Only start the slideshow if a profile is loaded successfully
    if (
      profile &&
      profile.slideImage1Url &&
      profile.slideImage2Url &&
      profile.slideImage3Url
    ) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % 3);
      }, 6000); // Change slide every 6 seconds
      return () => clearInterval(interval); // Clear interval on component unmount
    }
  }, [profile]); // Re-run effect if profile changes (i.e., when it loads)

  if (loading) {
    return (
      <div className="text-center text-gray-500 p-6 bg-white rounded-xl shadow">
        Loading top school profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-6 bg-white rounded-xl shadow">
        Error: {error}
      </div>
    );
  }

  if (!profile) {
    // This case should ideally be covered by loading/error, but as a fallback
    return (
      <div className="text-center text-gray-500 p-6 bg-white rounded-xl shadow">
        No top school profile found.
      </div>
    );
  }

  // Ensure slides array is only created if profile and image URLs exist
  const slides = [
    profile.slideImage1Url,
    profile.slideImage2Url,
    profile.slideImage3Url,
  ].filter(Boolean); // Filter out any undefined/null URLs

  // Provide fallback images if URLs are missing
  const placeholderImage = (width: number, height: number, text: string) =>
    `https://placehold.co/${width}x${height}/e0e0e0/555555?text=${encodeURIComponent(
      text
    )}`;

  return (
    <div className="max-w-4xl p-6 bg-white rounded-xl shadow-lg text-center text-black font-inter">
      <Image
        src={profile.logoUrl || placeholderImage(96, 96, "Logo")} // Fallback for logo
        alt="School Logo"
        width={96} // Set explicit width for Image component
        height={96} // Set explicit height for Image component
        className="h-24 w-24 mx-auto rounded-full border border-gray-200 mb-4 object-contain"
        onError={(e) => {
          e.currentTarget.src = placeholderImage(96, 96, "Logo Error"); // Fallback on error
        }}
      />
      <h2 className="text-3xl font-bold mb-4">{profile.name}</h2>
      <p className="text-lg text-gray-700 mb-4">
        Total Quiz Score:{" "}
        <span className="font-semibold text-green-600">
          {profile.totalQuizScore || "N/A"}
        </span>
      </p>

      <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
        {slides.length > 0 ? (
          slides.map((url, index) => (
            <Image
              key={index}
              src={url}
              alt={`Advert ${index + 1}`}
              layout="fill" // Use layout="fill" for responsive images within a container
              objectFit="cover"
              className={`absolute top-0 left-0 transition-opacity duration-700 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
              onError={(e) => {
                e.currentTarget.src = placeholderImage(
                  600,
                  256,
                  `Slide ${index + 1} Error`
                ); // Fallback on error
              }}
            />
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
            No slide images available.
          </div>
        )}
      </div>
    </div>
  );
}
