import React from "react";
import { quizes } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import Link from "next/link";

export type Quiz = InferSelectModel<typeof quizes>;
type Props = {
  quizes: Quiz[];
};

const QuizesTable = (props: Props) => {
  return (
    <div className="rounded-md overflow-hidden p-5 border">
      <table className="table-auto">
        <thead>
          <tr>
            <th className="text-[#6c7381] text-left">Name</th>
            <th className="text-[#6c7381] text-left">Description</th>
          </tr>
        </thead>

        <tbody>
          {props.quizes.map((quiz: Quiz) => (
            <tr key={quiz.id}>
              <td>
                <Link href={`/quiz/${quiz.id}`}>
                  <p className="text-blue-600 underline">{quiz.name}</p>
                </Link>
              </td>
              <td>{quiz.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuizesTable;
