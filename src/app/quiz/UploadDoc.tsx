"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Props = {};

const UploadDoc = (props: Props) => {
  const [document, setDocument] = useState<File | null | undefined>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!document) {
      setError("Please upload the document first");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("pdf", document as Blob);

    try {
      const res = await fetch("/api/quiz/generate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json(); // ✅ Parse response

      if (res.ok && data.success) {
        // ✅ SUCCESS PATH
        const quizId = data.quizId;
        router.push(`/quiz/${quizId}`);
      } else {
        // ✅ ERROR from server
        setError(data.error || "Failed to generate quiz");
      }
    } catch (e) {
      console.error("Error while generating quiz:", e);
      setError("Something went wrong while uploading.");
    } finally {
      // ✅ Always reset loading state
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form
          className="w-full"
          onSubmit={handleSubmit}
        >
          <label
            htmlFor="document"
            className="bg-secondary w-full flex h-20 rounded-md border-4 border-dashed border-blue-900 relative"
          >
            <div className="absolute inset-0 m-auto flex justify-center items-center">
              {document && document?.name ? document.name : "Drag a file"}
            </div>
            <input
              type="file"
              id="document"
              onChange={(e) => setDocument(e?.target?.files?.[0])}
              className="relative block w-full h-full z-50 opacity-0"
            />
          </label>

          {/* ✅ Error display */}
          {error ? <p className="text-red-600 mt-2">{error}</p> : null}

          <Button
            size="lg"
            className="mt-2"
            type="submit"
          >
            Generate Quiz
          </Button>
        </form>
      )}
    </div>
  );
};

export default UploadDoc;

// "use client";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";

// type Props = {};

// const UploadDoc = (props: Props) => {
//   const [document, setDocument] = useState<File | null | undefined>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!document) {
//       setError("Please upload the document first");
//       return;
//     }
//     setIsLoading(true);
//     const formData = new FormData();
//     formData.append("pdf", document as Blob);

//     try {
//       const res = await fetch("/api/quiz/generate", {
//         method: "POST",
//         body: formData,
//       });
//       if (res.status === 200) {
//         const data = await res.json();
//         const quizId = data.quizId;
//         router.push(`/quiz/${quizId}`);
//       }
//     } catch (e) {
//       console.log("error while generating", e);
//     }
//     setIsLoading(false);
//   };

//   return (
//     <div className="w-full">
//       {isLoading ? (
//         <p>Loading...</p>
//       ) : (
//         <form
//           className="w-full"
//           onSubmit={handleSubmit}
//         >
//           <label
//             htmlFor="document"
//             className="bg-secondary w-full flex h-20 rounded-md border-4 border-dashed border-blue-900 relative"
//           >
//             <div className="absolute inset-0 m-auto flex justify-center items-center">
//               {document && document?.name ? document.name : "Drag a file"}
//             </div>
//             <input
//               type="file"
//               id="document"
//               onChange={(e) => setDocument(e?.target?.files?.[0])}
//               className="relative block w-full h-full z-50 opacity-0"
//             />
//           </label>
//           {error ? <p className="text-red-600">{error}</p> : null}
//           <Button
//             size={"lg"}
//             className="mt-2"
//             type="submit"
//           >
//             Generate Quiz
//           </Button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default UploadDoc;
