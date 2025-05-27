import { Button } from "@/components/ui/button";
import Image from "next/image";
export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <main className="flex justify-center flex-1">
        <div className="items-center flex flex-col sm:flex-row gap-20 justify-end mx-auto p-10 w-full sm:py-10 sm:w-[1000px]">
          <div className="items-center flex flex-row ">
            <Image
              src={"/images/amr-mascot.png"}
              width="400"
              height="400"
              alt="AMR Mascot"
            />
          </div>
          <div className="text-center flex gap-4 flex-col">
            <h1 className="text-3xl font-bold">Get quized about anything!</h1>
            <h3 className="text-sm">
              Upload documents, and easily generate your quizes with AI
            </h3>
            <Button
              variant={"neo"}
              className="mt-4 h-14 text-white"
            >
              Get Started
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
