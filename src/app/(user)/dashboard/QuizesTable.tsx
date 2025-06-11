import React from "react";
import { quizes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";
import { X } from "lucide-react"; // Lucide icon

export type Quiz = InferSelectModel<typeof quizes>;

type Props = {
  quizes: Quiz[];
  onRemove: (id: number) => void; // Callback to remove a quiz
};

const QuizesTable = ({ quizes, onRemove }: Props) => {
  return (
    <div className="rounded-md overflow-hidden p-5 border">
      <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="text-[#6c7381] text-left">Name</th>
              <th className="text-[#6c7381] text-left">Description</th>
              <th className="text-[#6c7381] text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {quizes.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-center text-gray-500 py-4"
                >
                  No quizzes found.
                </td>
              </tr>
            ) : (
              quizes.map((quiz: Quiz) => (
                <tr key={quiz.id}>
                  <td>
                    <Link href={`/quiz/${quiz.id}`}>
                      <p className="text-blue-600 underline hover:text-blue-800">
                        {quiz.name}
                      </p>
                    </Link>
                  </td>
                  <td>{quiz.description}</td>
                  <td>
                    <button
                      onClick={() => onRemove(quiz.id)}
                      className="text-red-500 hover:text-red-700"
                      title="Remove quiz"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizesTable;
