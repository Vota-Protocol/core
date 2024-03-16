"use client";

import { useState } from "react";
import Lottie from "lottie-react";
import person from "~~/components/assets/person.json";
import LoaderPage from "~~/components/loader/loader";
import PollComponent, { PollData } from "~~/components/poll/PollComponent";

const CreateVote = () => {
  const [isLoading, setIsLoading] = useState(false);
  const celebrateStyle = {
    height: 600,
    width: 600,
  };
  function createPoll(data: PollData): void {
    console.log(data);
    console.log(data.country?.title);
    console.log(data.country?.value);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 4000);
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
        <PollComponent onPollDataChange={createPoll} />
      </div>
    </div>
  );
};

export default CreateVote;
