"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import HoverBorderCard from "~~/components/card/HoverBorderCard";
import VoteCard from "~~/components/card/VoteCard";
import LoaderPage from "~~/components/loader/loader";
import { usePollStore } from "~~/services/store/polldata_store";

const Vote = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("Casting the vote, please wait...");

  const router = useRouter();
  const searchParams = useSearchParams();
  const { pollData } = usePollStore();
  const poll = pollData?.find(poll => poll.title === searchParams.get("id"));

  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const handleCardClick = (index: number) => {
    setClickedIndex(clickedIndex === index ? null : index);
  };

  const castVote = () => {
    console.log("Voting for candidate", clickedIndex);
    // navigate to the home page
    setIsLoading(true);
    setLoaderMessage("Casting the vote, please wait...");
    setTimeout(() => {
      router.push(`/voted-success?id=${clickedIndex}`);
    }, 4000);
  };

  return (
    <div className="flex-col bg-gradient-to-r from-[#2d275e] to-[#19244F] h-screen p-7">
      {isLoading ? (
        <LoaderPage message={loaderMessage} />
      ) : (
        <>
          <div className="flex flex-row items-center mb-3">
            <div className="text-3xl font-bold ">Vote for {poll?.title}</div>
            <img
              src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${poll?.country?.value}.svg`}
              alt="voter"
              className="w-14 h-14 ml-5  shadow-xl "
            />
          </div>
          {poll?.options.map((candidate, index) => (
            <div className="pb-3" key={index}>
              <VoteCard clicked={clickedIndex === index} onClick={() => handleCardClick(index)}>
                <div>{candidate}</div>
              </VoteCard>
            </div>
          ))}
        </>
      )}

      <div className={`mt-14 ${clickedIndex !== null ? " shadow-2xl" : ""}`}>
        <HoverBorderCard
          click={() => {
            castVote();
          }}
        >
          <div className="flex justify-center w-full text-xl ">Vote Now</div>
        </HoverBorderCard>
      </div>
    </div>
  );
};

export default Vote;
