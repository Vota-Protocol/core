"use client";

import { useSearchParams } from "next/navigation";
import VoteCard from "~~/components/card/VoteCard";

const Vote = () => {
  const searchParams = useSearchParams();

  const candidates = ["Candidate 1", "Candidate 2", "Candidate 3"];

  return (
    <div className="flex-col bg-gradient-to-r from-[#181436] to-[#19244F] h-screen p-7">
      <h1>Vote for {searchParams.get("id") ?? "-1"}</h1>
      {candidates.map((candidate, index) => (
        <div className="pb-3" key={index}>
          <VoteCard>
            <div>{candidate}</div>
          </VoteCard>
        </div>
      ))}
    </div>
  );
};

export default Vote;
