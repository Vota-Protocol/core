"use client";

import { useSearchParams } from "next/navigation";
import Lottie from "lottie-react";
import celebrate from "~~/components/assets/celebrate.json";
import voteSucessAnimation from "~~/components/assets/green_tick.json";

const VotedSucess = () => {
  const style = {
    height: 400,
    width: 400,
  };
  const celebrateStyle = {
    height: 800,
    width: 800,
  };
  const searchParams = useSearchParams();
  return (
    <div className="flex flex-col justify-center items-center h-screen relative">
      <div className="absolute top-0 left-0 w-full h-full z-10 flex flex-col justify-center items-center">
        <Lottie animationData={voteSucessAnimation} style={style} loop={false} />
        <div className="font-mono flex text-3xl font-bold text-center">
          You have successfully voted for candidate {searchParams.get("id") ?? "-1"}
        </div>
      </div>
      <div className="relative z-0">
        <Lottie animationData={celebrate} loop={false} style={celebrateStyle} />
      </div>
    </div>
  );
};

export default VotedSucess;
