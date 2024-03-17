"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
// import { PubKey } from "@se-2/hardhat/domainobjs";
import { useContractRead } from "wagmi";
import PollAbi from "~~/abi/Poll.abi";
import HoverBorderCard from "~~/components/card/HoverBorderCard";
import VoteCard from "~~/components/card/VoteCard";
import LoaderPage from "~~/components/loader/loader";
import { PollData } from "~~/components/poll/PollDataModel";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { decodeOptions } from "~~/utils/crypto";

const Vote = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState("Casting the vote, please wait...");

  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [poll, setPoll] = useState<PollData>();

  const { data: pollRaw } = useScaffoldContractRead({
    contractName: "PollManager",
    functionName: "polls",
    args: [BigInt(id as string)],
  });

  useEffect(() => {
    if (!pollRaw) {
      setPoll(undefined);
      return;
    }

    setPoll({
      id: Number(id),
      title: pollRaw[0],
      options: decodeOptions(pollRaw[1] as `0x${string}`) as string[],
      country: { title: "India", value: "IN" },
    });
  }, [pollRaw]);

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

  // const candidates = ["Candidate 1", "Candidate 2", "Candidate 3"];

  return (
    <div className="flex-col  h-full p-5 justify-between flex-1">
      {isLoading ? (
        <LoaderPage message={loaderMessage} />
      ) : (
        <div className="flex h-full flex-col ">
          <div className="flex flex-row items-center mb-5">
            <div className="text-3xl font-bold ">Vote for {poll?.title}</div>
            <img
              src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${poll?.country?.value}.svg`}
              alt="voter"
              className="w-10 h-10 ml-5  shadow-xl "
            />
          </div>
          {poll?.options.map((candidate, index) => (
            <div className="pb-3" key={index}>
              <VoteCard clicked={clickedIndex === index} onClick={() => handleCardClick(index)}>
                <div>{candidate}</div>
              </VoteCard>
            </div>
          ))}
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
      )}
    </div>
  );
};

export default Vote;
