"use client";

import Lottie from "lottie-react";
import person from "~~/components/assets/person.json";
import PollComponent from "~~/components/poll/PollComponent";

const CreateVote = () => {
  const celebrateStyle = {
    height: 600,
    width: 600,
  };
  return (
    <div className="relative bg-gradient-to-r from-[#181436] to-[#19244F] h-screen p-7">
      {/* Content of the div that stacks on top */}
      <div className="absolute top-0 left-[20px] w-full h-full flex justify-end items-end">
        <Lottie animationData={person} style={celebrateStyle} />
      </div>

      {/* Content of the PollComponent */}
      <div className="relative z-10">
        <PollComponent />
      </div>
    </div>
  );
};

export default CreateVote;
