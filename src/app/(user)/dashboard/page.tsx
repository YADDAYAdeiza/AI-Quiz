import React from "react";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { quizes } from "@/db/schema";
import { auth } from "@/auth";
import QuizesTable, { Quiz } from "./QuizesTable";
import getUserMetrics from "@/actions/getUserMetrics";
import getHeatMapData from "@/actions/getHeatMapData";
import MetricCard from "./MetricCard";
import dynamic from "next/dynamic";
import SubscribeBtn from "../billing/SubscribeBtn";
const SubmissionsHeatMap = dynamic(() => import("./HeatMap"), { ssr: false });
import { PRICE_ID } from "@/lib/utils";

type Props = {};

const page = async (props: Props) => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return <p>User not found</p>;
  }

  const userQuizes: Quiz[] = await db.query.quizes.findMany({
    where: eq(quizes.userId, userId),
  });
  const userData = await getUserMetrics();
  const heatMapData = await getHeatMapData();
  console.log(heatMapData);

  return (
    <div className="mt-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {userData && userData?.length > 0 ? (
          <>
            {userData?.map((metric) => (
              <MetricCard
                key={metric.label}
                label={metric.label}
                value={metric.value}
              />
            ))}
          </>
        ) : null}
      </div>
      <div>
        {heatMapData ? <SubmissionsHeatMap data={heatMapData.data} /> : null}
      </div>
      <QuizesTable quizes={userQuizes} />;
    </div>
  );
};

export default page;
