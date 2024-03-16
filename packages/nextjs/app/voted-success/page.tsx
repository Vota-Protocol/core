"use client";

import { useSearchParams } from "next/navigation";

const VotedSucess = () => {
  const searchParams = useSearchParams();
  return (
    <div className="flex bg-gradient-to-r from-[#2d275e] to-[#19244F] h-screen p-7 ">
      <div className="place-self-center flex text-3xl font-bold text-center">
        You have successfully voted for candidate {searchParams.get("id") ?? "-1"}
      </div>
    </div>
  );
};

export default VotedSucess;
