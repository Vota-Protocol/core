"use client";

import { useSearchParams } from "next/navigation";
import Lottie from "lottie-react";
import pollCreatedSucessAnimation from "~~/components/assets/vote_poll_sucess.json";

const VoteCreatedSucess = () => {
  const searchParams = useSearchParams();
  const style = {
    height: 400,
    width: 600,
  };
  return (
    <div className="flex flex-col justify-center items-center relative bg-gradient-to-r from-[#181436] to-[#19244F] h-screen p-7">
      <div className="absolute top-0 left-0 w-full h-full z-10 flex flex-col justify-center items-center">
        <Lottie animationData={pollCreatedSucessAnimation} style={style} loop={false} />
        <div className="font-mono flex text-3xl font-bold text-center">
          Congratulations! The poll &quot;{searchParams.get("pollName") ?? "-1"}&quot; has been created successfully.
        </div>
      </div>
    </div>
  );
};

export default VoteCreatedSucess;
