"use client";

import { useSearchParams } from "next/navigation";
import Lottie from "lottie-react";
import celebrate from "~~/components/assets/celebrate.json";
import voteSucessAnimation from "~~/components/assets/green_tick.json";

const VotedSucess = () => {
  const style = {
    height: 150,
    width: 150,
  };
  const celebrateStyle = {
    height: 400,
    width: 400,
  };
  const searchParams = useSearchParams();
  return (
    <div className="flex flex-col justify-center items-center relative h-full p-7 ">
      <div className="absolute inset-0 flex justify-center items-center z-10 ">
        <div className="flex flex-col justify-center items-center mt-40">
          <Lottie animationData={voteSucessAnimation} style={style} loop={false} />
          <div className="font-mono text-3xl font-bold text-center mt-10">
            You have successfully voted for candidate {searchParams.get("id") ?? "-1"}
          </div>
        </div>
      </div>
      <div className="relative z-0">
        <Lottie animationData={celebrate} loop={false} style={celebrateStyle} />
      </div>
    </div>
  );
};

export default VotedSucess;
