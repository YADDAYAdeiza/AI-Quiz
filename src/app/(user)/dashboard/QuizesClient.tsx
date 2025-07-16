// "use client";

// import React, { useState } from "react";
// import { Quiz } from "./QuizesTable";
// import QuizesTable from "./QuizesTable";

// type Props = {
//   initialQuizes: Quiz[];
// };

// const QuizesClient = ({ initialQuizes }: Props) => {
//   const [quizes, setQuizes] = useState<Quiz[]>(initialQuizes);

//   const handleRemove = async (id: number) => {
//     if (!confirm("Are you sure you want to remove this quiz?")) return;

//     setQuizes((prev) => prev.filter((quiz) => quiz.id !== id));
//     await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
//   };

//   return (
//     <QuizesTable
//       quizes={quizes}
//       onRemove={handleRemove}
//     />
//   );
// };

// export default QuizesClient;

// app/components/QuizesClient.tsx
"use client";

import React, { useState } from "react";
import { Quiz } from "./QuizesTable"; // Assuming Quiz type and QuizesTable component are in the same directory
import QuizesTable from "./QuizesTable";
import ConfirmationModal from "./ConfirmationModal"; // Import the new modal component

type Props = {
  initialQuizes: Quiz[];
};

/**
 * QuizesClient Component
 * Manages the state and actions for a list of quizzes,
 * including displaying a table and handling quiz removal with a confirmation modal.
 */
const QuizesClient = ({ initialQuizes }: Props) => {
  const [quizes, setQuizes] = useState<Quiz[]>(initialQuizes);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [quizIdToDelete, setQuizIdToDelete] = useState<number | null>(null);

  /**
   * Initiates the quiz removal process by showing the confirmation modal.
   * This is called when the user clicks the "remove" button for a quiz.
   * @param {number} id - The ID of the quiz to be removed.
   */
  const handleRemove = (id: number) => {
    setQuizIdToDelete(id); // Store the ID of the quiz to be deleted
    setShowModal(true); // Show the confirmation modal
  };

  /**
   * Confirms the removal of a quiz after the user clicks "Confirm" in the modal.
   * This function performs the actual API call and state update.
   */
  const confirmRemove = async () => {
    if (quizIdToDelete === null) return; // Should not happen if modal is shown correctly

    // Optimistically update the UI: remove the quiz from the local state
    setQuizes((prev) => prev.filter((quiz) => quiz.id !== quizIdToDelete));

    // Hide the modal immediately
    setShowModal(false);
    setQuizIdToDelete(null); // Clear the stored ID

    try {
      // Send the DELETE request to the API
      const response = await fetch(`/api/quizzes/${quizIdToDelete}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        // If the API call fails, you might want to revert the UI change
        // or show an Ferror message. For simplicity, we'll just log an error here.
        // In a real app, you'd likely fetch the quizzes again or add more sophisticated error handling.
        console.error(
          `Failed to delete quiz with ID ${quizIdToDelete}. Status: ${response.status}`
        );
        // Optionally, re-fetch quizzes to synchronize state with backend
        // const updatedQuizesResponse = await fetch('/api/quizzes');
        // const updatedQuizesData = await updatedQuizesResponse.json();
        // setQuizes(updatedQuizesData);
      }
    } catch (error) {
      console.error("Error during quiz deletion:", error);
      // Handle network errors or other unexpected issues
      // Optionally, revert the UI change if the optimistic update failed due to network issues
    }
  };

  /**
   * Cancels the quiz removal process by hiding the confirmation modal.
   */
  const cancelRemove = () => {
    setShowModal(false); // Hide the modal
    setQuizIdToDelete(null); // Clear the stored ID
  };

  return (
    <>
      <QuizesTable
        quizes={quizes}
        onRemove={handleRemove} // handleRemove now opens the modal
      />

      <ConfirmationModal
        show={showModal}
        message="Are you sure you want to remove this quiz? This action cannot be undone."
        onConfirm={confirmRemove} // Call confirmRemove when user confirms
        onCancel={cancelRemove} // Call cancelRemove when user cancels
      />
    </>
  );
};

export default QuizesClient;
