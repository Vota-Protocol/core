"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HoverBorderCard from "~~/components/card/HoverBorderCard";
import LoaderPage from "~~/components/loader/loader";
import { listOfMockPolls } from "~~/components/poll/PollDataModel";
import { usePollStore } from "~~/services/store/polldata_store";

const VoterPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { pollData, setPollData } = usePollStore();

  useEffect(() => {
    setTimeout(() => {
      setPollData(listOfMockPolls);
      setIsLoading(false);
    }, 4000);
  }, []);

  return (
    <div className={`flex-col bg-gradient-to-r from-[#181436] to-[#19244F] h-screen p-7`}>
      {pollData && (
        <div className="flex flex-row items-center mb-4">
          <div className="text-3xl font-bold ">Active Polls</div>
          <span className="h-3 w-3 animate-ping ml-3 inline-flex  rounded-full bg-green-400 opacity-75"></span>
        </div>
      )}
      {isLoading ? (
        <LoaderPage />
      ) : (
        pollData?.map(voter => (
          <div className="mb-4 mx-4" key={voter.title}>
            <HoverBorderCard
              showArrow={true}
              click={() => {
                // navigate to the vote page
                router.push(`/vote?id=${voter.title}`);
              }}
            >
              <div className="flex flex-row ">
                <img
                  src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${voter.country.value}.svg`}
                  alt="voter"
                  className="w-14 h-14 mr-5 rounded-full border-2 shadow-xl "
                />

                <div className="flex flex-col">
                  <h1 className="text-lg font-bold">{voter.title}</h1>
                  <h1 className="text-md text-slate-500">{voter.options.length} Candidates</h1>
                </div>
              </div>
            </HoverBorderCard>
          </div>
        ))
      )}
    </div>
  );
};

export default VoterPage;
