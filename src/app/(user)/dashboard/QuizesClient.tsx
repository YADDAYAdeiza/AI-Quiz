"use client";

import React, { useState } from "react";
import { Quiz } from "./QuizesTable";
import QuizesTable from "./QuizesTable";

type Props = {
  initialQuizes: Quiz[];
};

const QuizesClient = ({ initialQuizes }: Props) => {
  const [quizes, setQuizes] = useState<Quiz[]>(initialQuizes);

  const handleRemove = async (id: number) => {
    if (!confirm("Are you sure you want to remove this quiz?")) return;

    setQuizes((prev) => prev.filter((quiz) => quiz.id !== id));
    await fetch(`/api/quizzes/${id}`, { method: "DELETE" });
  };

  return (
    <QuizesTable
      quizes={quizes}
      onRemove={handleRemove}
    />
  );
};

export default QuizesClient;
