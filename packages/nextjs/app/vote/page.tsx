"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
// import { PubKey } from "@se-2/hardhat/domainobjs";
import { useContractRead } from "wagmi";
import PollAbi from "~~/abi/Poll.abi";
import HoverBorderCard from "~~/components/card/HoverBorderCard";
import VoteCard from "~~/components/card/VoteCard";
import LoaderPage from "~~/components/loader/loader";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";

/**
 *
 * KP 1
 * [✓] Public key: macipk.31c3b9d36aed8ab9490d7468cb581669ff2774791c7fcefc4cdd07bd009a019d
 * [✓] Private key: macisk.79a8acc8572683cd2f6a212b7ac096f66b39dbad6ceb11634a1b0d7584df4856
 *
 * KP 2
 * [✓] Public key: macipk.f48bc9877d99ba9482ababaa53f31d492d84bf105e0c8b3fc60edbf52ed7f0a3
 * [✓] Private key: macisk.578e007d0eb7625624c00e898379bc2b3e96af59dffa7212eb2a5ae100f24c73
 *
 */

// const coordinatorPubKey = PubKey.deserialize("31c3b9d36aed8ab9490d7468cb581669ff2774791c7fcefc4cdd07bd009a019d");

const Vote = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("Casting the vote, please wait...");

  const router = useRouter();
  const searchParams = useSearchParams();
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

  // const [pollContractAddress, setPollContractAddress] = useState<Address>();
  const pollId = 0n;

  const { data: pollContractAddress } = useScaffoldContractRead({
    contractName: "MACI",
    functionName: "getPoll",
    args: [pollId],
  });

  console.log(pollContractAddress);

  const { data: maxValues } = useContractRead({
    abi: PollAbi,
    address: pollContractAddress,
    functionName: "maxValues",
    args: [],
  });

  const { data: coordinatorPubKeyResult } = useContractRead({
    abi: PollAbi,
    address: pollContractAddress,
    functionName: "coordinatorPubKey",
    args: [],
  });

  // const {} = useContractWrite({
  //   abi: PollAbi,
  //   address: pollContractAddress,
  //   functionName: "publishMessage",
  //   args: [message.asContractParam(), encKeypair.pubKey.asContractParam()]
  // })

  // const castVoteImpl = () => {};

  console.log(maxValues);
  console.log(coordinatorPubKeyResult);

  const candidates = ["Candidate 1", "Candidate 2", "Candidate 3"];

  return (
    <div className="flex-col bg-gradient-to-r from-[#2d275e] to-[#19244F] h-screen p-7">
      {isLoading ? (
        <LoaderPage message={loaderMessage} />
      ) : (
        <>
          <div className="text-3xl font-bold mb-4">Vote for {searchParams.get("id") ?? "-1"}</div>
          {candidates.map((candidate, index) => (
            <div className="pb-3" key={index}>
              <VoteCard clicked={clickedIndex === index} onClick={() => handleCardClick(index)}>
                <div>{candidate}</div>
              </VoteCard>
            </div>
          ))}
        </>
      )}

      <div className={`mt-14 ${clickedIndex !== null ? " shadow animate-pulse" : ""}`}>
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
