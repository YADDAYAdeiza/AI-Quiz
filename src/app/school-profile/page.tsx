"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function SchoolProfileForm() {
  const [name, setName] = useState("");

  const [logoUrl, setLogoUrl] = useState("");
  const [slideImage1Url, setSlideImage1Url] = useState("");
  const [slideImage2Url, setSlideImage2Url] = useState("");
  const [slideImage3Url, setSlideImage3Url] = useState("");

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [slideFile1, setSlideFile1] = useState<File | null>(null);
  const [slideFile2, setSlideFile2] = useState<File | null>(null);
  const [slideFile3, setSlideFile3] = useState<File | null>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [preview1, setPreview1] = useState<string | null>(null);
  const [preview2, setPreview2] = useState<string | null>(null);
  const [preview3, setPreview3] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const supabase = createClientComponentClient();

  const handleUpload = async (file: File, type: "logo" | "slide") => {
    const path = `${type}s/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("school-assets")
      .upload(path, file);

    if (error) {
      console.error("Upload error:", error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from("school-assets")
      .getPublicUrl(path);

    // Return the public URL of the uploaded file
    return publicUrlData?.publicUrl ?? null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Saving...");

    let logo = logoUrl;
    let slide1 = slideImage1Url;
    let slide2 = slideImage2Url;
    let slide3 = slideImage3Url;

    // Handle file uploads and update the URLs accordingly
    if (logoFile) {
      const uploaded = await handleUpload(logoFile, "logo");
      if (uploaded) {
        logo = uploaded;
        setLogoUrl(uploaded); // Update the logo URL state
      } else {
        // Stop the function and show an error if upload fails
        setMessage(
          "Error: Failed to upload the logo. Please check the file or try again."
        );
        return; // Stop the submission
      }
    }

    if (slideFile1) {
      const uploaded = await handleUpload(slideFile1, "slide");
      if (uploaded) {
        slide1 = uploaded;
        setSlideImage1Url(uploaded); // Update slide 1 URL state
      } else {
        setMessage("Error: Failed to upload Advert Image 1. Please try again.");
        return; // Stop the submission
      }
    }

    if (slideFile2) {
      const uploaded = await handleUpload(slideFile2, "slide");
      if (uploaded) {
        slide2 = uploaded;
        setSlideImage2Url(uploaded); // Update slide 2 URL state
      } else {
        setMessage("Error: Failed to upload Advert Image 2. Please try again.");
        return; // Stop the submission
      }
    }

    if (slideFile3) {
      const uploaded = await handleUpload(slideFile3, "slide");
      if (uploaded) {
        slide3 = uploaded;
        setSlideImage3Url(uploaded); // Update slide 3 URL state
      } else {
        setMessage("Error: Failed to upload Advert Image 3. Please try again.");
        return; // Stop the submission
      }
    }

    const res = await fetch("/api/school-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        logoUrl: logo,
        slideImage1Url: slide1,
        slideImage2Url: slide2,
        slideImage3Url: slide3,
      }),
    });

    if (res.ok) {
      setMessage("School profile saved successfully!");
    } else {
      const errorText = await res.text();
      setMessage(`Failed to save profile: ${errorText}`);
    }
  };

  // Preview handling for logo and slide images
  useEffect(() => {
    if (logoFile) setLogoPreview(URL.createObjectURL(logoFile));
    else if (logoUrl) setLogoPreview(logoUrl);
    else setLogoPreview(null);
  }, [logoFile, logoUrl]);

  useEffect(() => {
    if (slideFile1) setPreview1(URL.createObjectURL(slideFile1));
    else if (slideImage1Url) setPreview1(slideImage1Url);
    else setPreview1(null);
  }, [slideFile1, slideImage1Url]);

  useEffect(() => {
    if (slideFile2) setPreview2(URL.createObjectURL(slideFile2));
    else if (slideImage2Url) setPreview2(slideImage2Url);
    else setPreview2(null);
  }, [slideFile2, slideImage2Url]);

  useEffect(() => {
    if (slideFile3) setPreview3(URL.createObjectURL(slideFile3));
    else if (slideImage3Url) setPreview3(slideImage3Url);
    else setPreview3(null);
  }, [slideFile3, slideImage3Url]);

  const renderImageField = (
    label: string,
    fileState: [File | null, React.Dispatch<React.SetStateAction<File | null>>],
    urlState: [string, React.Dispatch<React.SetStateAction<string>>],
    previewUrl: string | null,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const [file, setFile] = fileState;
    const [url, setUrl] = urlState;

    return (
      <div className="mb-4">
        <label className="block font-medium mb-1">{label}</label>
        <input
          type="url"
          className="w-full p-2 border rounded mb-2"
          placeholder="Or paste image URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {previewUrl && (
          <div className="relative mt-2">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-24 rounded border"
            />
            <button
              type="button"
              onClick={() => {
                setFile(null);
                setUrl("");
                setPreview(null);
              }}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow text-black">
      <h2 className="text-2xl font-bold mb-4">Create School Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block font-medium mb-1">School Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {renderImageField(
          "Logo Image",
          [logoFile, setLogoFile],
          [logoUrl, setLogoUrl],
          logoPreview,
          setLogoPreview
        )}

        {renderImageField(
          "Advert Image 1",
          [slideFile1, setSlideFile1],
          [slideImage1Url, setSlideImage1Url],
          preview1,
          setPreview1
        )}

        {renderImageField(
          "Advert Image 2",
          [slideFile2, setSlideFile2],
          [slideImage2Url, setSlideImage2Url],
          preview2,
          setPreview2
        )}

        {renderImageField(
          "Advert Image 3",
          [slideFile3, setSlideFile3],
          [slideImage3Url, setSlideImage3Url],
          preview3,
          setPreview3
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Profile
        </button>

        {message && <p className="mt-4 text-sm">{message}</p>}
      </form>
    </div>
  );
}
