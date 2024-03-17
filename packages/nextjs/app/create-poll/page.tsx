"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import person from "~~/components/assets/person.json";
import LoaderPage from "~~/components/loader/loader";
import PollComponent from "~~/components/poll/PollComponent";

const CreateVote = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const celebrateStyle = {
    height: 600,
    width: 600,
  };

  function next(title: string) {
    // setIsLoading(true);
    router.push(`/create-poll-success?pollName=${title}`);
    // setIsLoading(false);
  }

  return isLoading ? (
    <div className={`flex-col bg-gradient-to-r from-[#181436] to-[#19244F] h-screen p-7`}>
      <LoaderPage message="Creating Poll, Please Wait ....." />
    </div>
  ) : (
    <div className="relative bg-gradient-to-r from-[#181436] to-[#19244F] h-screen p-7">
      <div className="absolute top-0 left-[20px] w-full h-full flex justify-end items-end">
        <Lottie animationData={person} style={celebrateStyle} />
      </div>

      <div className="relative z-10">
        <PollComponent setIsLoading={setIsLoading} next={next} />
      </div>
    </div>
  );
};

export default CreateVote;
