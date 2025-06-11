import React from "react";
import UploadDoc from "../UploadDoc";
import { auth, signIn } from "@/auth";
import { getUserSubscription } from "@/actions/UserSubscriptions";
import { Flame, Lock } from "lucide-react";
import { getStripe } from "@/lib/stripe-client";
import { useRouter } from "next/navigation";
import { PRICE_ID } from "@/lib/utils";
import UpgradePlan from "../UpgradePlan";

type Props = {};

const page = async (props: Props) => {
  const session = await auth();
  // const router = useRouter();
  const userId = session?.user?.id;
  if (!userId) {
    signIn();
    return;
  }

  const subscribed: boolean | null | undefined = await getUserSubscription({
    userId,
  });

  return (
    <div className="flex flex-col flex-1">
      <main className="py-11 flex flex-col text-center gap-4 items-center flex-1 mt-24">
        {/* {!subscribed ? ( */}

        {subscribed ? (
          <>
            <h2 className="text-3xl font-bold mb-4">
              What do you want to be quizzed on Today?
            </h2>
            <UploadDoc />
          </>
        ) : (
          <UpgradePlan />
        )}

        {/* <>
          <h2 className="text-3xl font-bold mb-4">
            What do you want to be quizzed on Today?
          </h2>
          <UploadDoc />
        </> */}
      </main>
    </div>
  );
};

export default page;
