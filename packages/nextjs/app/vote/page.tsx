"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import HoverBorderCard from "~~/components/card/HoverBorderCard";
import VoteCard from "~~/components/card/VoteCard";

const Vote = () => {
  const searchParams = useSearchParams();
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const handleCardClick = (index: number) => {
    setClickedIndex(index);
  };

  const candidates = ["Candidate 1", "Candidate 2", "Candidate 3"];

  return (
    <div className="flex-col bg-gradient-to-r from-[#2d275e] to-[#19244F] h-screen p-7">
      <div className="text-3xl font-bold mb-4">Vote for {searchParams.get("id") ?? "-1"}</div>
      {candidates.map((candidate, index) => (
        <div className="pb-3" key={index}>
          <VoteCard clicked={clickedIndex === index} onClick={() => handleCardClick(index)}>
            <div>{candidate}</div>
          </VoteCard>
        </div>
      ))}

      <HoverBorderCard>
        <div className="flex justify-center w-full text-xl ">Vote Now</div>
      </HoverBorderCard>
    </div>
  );
};

export default Vote;
