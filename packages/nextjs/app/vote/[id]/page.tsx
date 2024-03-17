"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { genRandomSalt } from "@se-2/hardhat/crypto";
import { Keypair, Message, PCommand, PubKey } from "@se-2/hardhat/domainobjs";
import toast from "react-hot-toast";
import { useContractRead, useContractWrite } from "wagmi";
import PollAbi from "~~/abi/Poll.abi";
import { Timer } from "~~/components/Timer";
import HoverBorderCard from "~~/components/card/HoverBorderCard";
import VoteCard from "~~/components/card/VoteCard";
import LoaderPage from "~~/components/loader/loader";
import { PollData } from "~~/components/poll/PollDataModel";
import { useAuthContext } from "~~/contexts/AuthContext";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { decodeOptions } from "~~/utils/crypto";

const Vote = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loaderMessage, setLoaderMessage] = useState("Fetching the poll details, please wait...");

  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const isActive = (searchParams.get("active") ?? "true") == "true";

  const [poll, setPoll] = useState<PollData>();
  const [randomVotes, setRandomVotes] = useState<number[]>([]);
  const { keypair } = useAuthContext();

  const { data: pollRaw } = useScaffoldContractRead({
    contractName: "PollManager",
    functionName: "polls",
    args: [BigInt(id)],
    onSuccess() {
      setIsLoading(false);
    },
  });

  useEffect(() => {
    if (!pollRaw) {
      setPoll(undefined);
      return;
    }

    const data: PollData = {
      id: Number(id),
      title: pollRaw[0],
      options: decodeOptions(pollRaw[1] as `0x${string}`) as string[],
      country: { title: "India", value: "IN" },
      expiry: Number(pollRaw[5]),
    };
    setPoll(data);
    console.log("randomVotes pollraw", pollRaw);
    setRandomVotes(generateRandomVotes(data.options.length));
    console.log("randomVotes", randomVotes);
  }, [pollRaw]);

  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const handleCardClick = (index: number) => {
    setClickedIndex(clickedIndex === index ? null : index);
  };

  const castVote = async () => {
    setIsLoading(true);
    console.log("Voting for candidate", clickedIndex);
    // navigate to the home page
    try {
      await writeAsync();
      setLoaderMessage("Casting the vote, please wait...");
      setTimeout(() => {
        router.push(`/voted-success?id=${clickedIndex}`);
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.log("err", err);
      setIsLoading(false);
      toast.error("Casting vote failed, please try again ");
    }
  };

  const { data: maxValues } = useContractRead({
    abi: PollAbi,
    address: pollRaw?.[4]?.poll,
    functionName: "maxValues",
    args: [],
  });

  const { data: coordinatorPubKeyResult } = useContractRead({
    abi: PollAbi,
    address: pollRaw?.[4]?.poll,
    functionName: "coordinatorPubKey",
    args: [],
  });

  const [message, setMessage] = useState<{ message: Message; encKeyPair: Keypair }>();

  console.log("message", message);

  const { writeAsync } = useContractWrite({
    abi: PollAbi,
    address: pollRaw?.[4]?.poll,
    functionName: "publishMessage",
    args: [message?.message.asContractParam(), message?.encKeyPair.pubKey.asContractParam()],
  });

  const [coordinatorPubKey, setCoordinatorPubKey] = useState<PubKey>();

  useEffect(() => {
    if (!coordinatorPubKeyResult) {
      return;
    }

    const coordinatorPubKey_ = new PubKey([
      BigInt((coordinatorPubKeyResult as any)[0].toString()),
      BigInt((coordinatorPubKeyResult as any)[1].toString()),
    ]);

    setCoordinatorPubKey(coordinatorPubKey_);

    console.log("p", coordinatorPubKey);
  }, [coordinatorPubKeyResult]);

  const generateRandomVotes = (length: number) => {
    const randomVotes = [];
    for (let i = 0; i < length; i++) {
      // Generate a random number between 0 and 100 representing the votes
      const votes = Math.floor(Math.random() * 101); // Generates a random number between 0 and 100
      randomVotes.push(votes);
    }
    return randomVotes;
  };

  useEffect(() => {
    if (!clickedIndex || !coordinatorPubKey || !keypair) {
      return;
    }
    const command: PCommand = new PCommand(
      1n, // stateindex
      keypair.pubKey, // userMaciPubKey
      BigInt(clickedIndex),
      1n,
      1n,
      BigInt(id),
      genRandomSalt(),
    );

    const signature = command.sign(keypair.privKey);

    const encKeyPair = new Keypair();

    const message = command.encrypt(signature, Keypair.genEcdhSharedKey(encKeyPair.privKey, coordinatorPubKey));

    setMessage({ message, encKeyPair });
  }, [clickedIndex, coordinatorPubKey, keypair]);

  console.log(maxValues && (maxValues as any)[1]);
  console.log(coordinatorPubKeyResult);

  // const candidates = ["Candidate 1", "Candidate 2", "Candidate 3"];

  return (
    <div className="flex-col  h-full p-5 justify-between flex-1">
      {isLoading ? (
        <LoaderPage message={loaderMessage} />
      ) : (
        <div className="flex h-full flex-col ">
          <div className="flex flex-row items-center my-5">
            <div className="text-3xl font-bold ">Vote for {poll?.title}</div>
            <img
              src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${poll?.country?.value}.svg`}
              alt="voter"
              className="w-10 h-10 ml-5  shadow-xl "
            />
          </div>
          {poll?.options.map((candidate, index) => (
            <div className="pb-5" key={index}>
              <VoteCard clicked={clickedIndex === index} onClick={() => handleCardClick(index)}>
                <div>{candidate}</div>
              </VoteCard>
            </div>
          ))}
          <div className={`mt-5 ${clickedIndex !== null ? " shadow-2xl" : ""}`}>
            <HoverBorderCard
              click={() => {
                castVote();
              }}
              disabled={!isActive}
            >
              <div className="flex justify-center w-full text-xl ">{isActive ? "Vote Now" : "Voting Closed"}</div>
            </HoverBorderCard>
          </div>

          <div className="flex flex-col mt-10">
            <div className="text-3xl font-bold my-5">Results</div>

            {!isActive ? (
              poll?.options.map((option, index) => (
                <div className="flex flex-row my-5 items-center" key={index}>
                  <div className="text-xl">
                    {option} total vote {randomVotes[index]}
                  </div>
                  <div className="w-full ml-2 bg-gray-200 h-6 rounded shadow-2xl border-2">
                    <div
                      className="h-full bg-[#0C1B36] rounded shadow-2xl"
                      style={{ width: `${randomVotes[index]}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col text-gray-500 ">
                <div className="text-xl"> Results will be displayed after the voting ends, and voting ends in </div>
                <Timer expiryDate={(poll?.expiry ?? 0) * 1000} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Vote;
