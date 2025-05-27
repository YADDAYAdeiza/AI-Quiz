import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

type Props = {};

const page = (props: Props) => {
  return (
    <Alert>
      <AlertTitle className="mb-3 text-xl text-green-400">Success</AlertTitle>
      <AlertDescription>
        Your account has been updated.
        <br />
        <Link
          href="/dashboard"
          className="underline"
        >
          {" "}
          Go to the dashboard
        </Link>{" "}
        to generate more quizes
      </AlertDescription>
    </Alert>
  );
};

export default page;
