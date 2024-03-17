"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { genRandomSalt } from "@se-2/hardhat/crypto";
import { Keypair, Message, PCommand, PubKey } from "@se-2/hardhat/domainobjs";
import toast from "react-hot-toast";
import { useContractRead, useContractWrite } from "wagmi";
import PollAbi from "~~/abi/Poll.abi";
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

  const [poll, setPoll] = useState<PollData>();
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
