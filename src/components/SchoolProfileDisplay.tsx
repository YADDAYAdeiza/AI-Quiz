"use client";

import { useEffect, useState } from "react";

interface SchoolProfile {
  name: string;
  logoUrl: string;
  slideImage1Url: string;
  slideImage2Url: string;
  slideImage3Url: string;
}

export default function SchoolProfileDisplay() {
  const [profile, setProfile] = useState<SchoolProfile | null>(null);
  const [error, setError] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/school-profile");

      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      } else {
        const err = await res.text();
        setError(err || "Failed to fetch school profile.");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!profile) {
    return <div className="text-center text-gray-500">Loading profile...</div>;
  }

  const slides = [
    profile.slideImage1Url,
    profile.slideImage2Url,
    profile.slideImage3Url,
  ];

  return (
    <div className="max-w-4xl p-6 bg-white rounded-xl shadow text-center text-black">
      <img
        src={profile.logoUrl}
        alt="School Logo"
        className="h-24 mx-auto rounded-full border mb-4 object-contain"
      />
      <h2 className="text-3xl font-bold mb-4">{profile.name}</h2>

      <div className="relative w-full h-64 rounded-lg overflow-hidden">
        {slides.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Advert ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
