"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HoverBorderCard from "~~/components/card/HoverBorderCard";
import LoaderPage from "~~/components/loader/loader";

interface Voter {
  id: number;
  title: string;
  numberOfCandidates: number;
}

const VoterPage = () => {
  const router = useRouter();
  const [voters, setVoters] = useState<Voter[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const data = [
        {
          id: 1,
          title: "Election 1",
          numberOfCandidates: 3,
        },
        {
          id: 2,
          title: "Election 2",
          numberOfCandidates: 5,
        },
        {
          id: 3,
          title: "Election 3",
          numberOfCandidates: 2,
        },
      ];
      setVoters(data);
      setIsLoading(false);
    }, 4000);
  }, []);

  return (
    <div className={`flex-col bg-gradient-to-r from-[#181436] to-[#19244F] h-screen p-7`}>
      {voters && (
        <div className="flex flex-row">
          <div className="text-3xl font-bold mb-4">Poll Your Vote</div>
        </div>
      )}
      {isLoading ? (
        <LoaderPage />
      ) : (
        voters?.map(voter => (
          <div className="mb-4 mx-4" key={voter.id}>
            <HoverBorderCard
              showArrow={true}
              click={() => {
                // navigate to the vote page
                router.push(`/vote?id=${voter.id}`);
              }}
            >
              <div className="flex flex-row ">
                <img src="https://via.placeholder.com/150" alt="voter" className="w-14 h-14 mr-5 rounded-full" />

                <div className="flex flex-col">
                  <h1 className="text-lg font-bold">{voter.title}</h1>
                  <h1 className="text-md text-slate-500">{voter.numberOfCandidates} Candidates</h1>
                </div>
                <span className="relative h-3 w-3  ml-4 flex self-center ">
                  <div className=" badge badge-secondary badge-lg badge-outline px-6 ">Active</div>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                </span>
              </div>
            </HoverBorderCard>
          </div>
        ))
      )}
    </div>
  );
};

export default VoterPage;
