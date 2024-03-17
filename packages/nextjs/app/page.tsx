"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChainId, useContractReads } from "wagmi";
import HoverBorderCard from "~~/components/card/HoverBorderCard";
import LoaderPage from "~~/components/loader/loader";
import { PollData } from "~~/components/poll/PollDataModel";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { useAuthUserOnly } from "~~/hooks/useAuthUserOnly";
import { decodeOptions } from "~~/utils/crypto";
import { contracts } from "~~/utils/scaffold-eth/contract";

export default function VoterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  useAuthUserOnly({});

  const { data: totalPolls } = useScaffoldContractRead({
    contractName: "PollManager",
    functionName: "totalPolls",
  });

  const [pollsFormatted, setPollsFormatted] = useState<PollData[]>();

  console.log(totalPolls);

  const chainId = useChainId();

  const { data: pollsRaw } = useContractReads({
    contracts: Array.from(Array(Number(totalPolls || 0n)).keys()).map((_, i) => ({
      address: (contracts && contracts[chainId] && contracts[chainId]["PollManager"]?.address) || undefined,
      abi: (contracts && contracts[chainId] && contracts[chainId]["PollManager"]?.abi) || undefined,
      functionName: "polls",
      args: [BigInt(i + 1)],
      onSuccess() {
        setIsLoading(false);
      },
    })),
  });

  console.log("isLoading in mainpage", isLoading);

  useEffect(() => {
    if (!pollsRaw || pollsRaw.length == 0 || pollsRaw.filter(({ status }) => status !== "success").length !== 0) {
      setPollsFormatted([]);
      return;
    }

    const dataList: PollData[] = [];
    let i = -1;
    for (const poll of pollsRaw) {
      i++;
      if (!poll.result) continue;
      dataList.push({
        id: i + 1,
        title: (poll.result as any)[0] as string,
        options: decodeOptions((poll.result as any)[1] as `0x${string}`) as string[],
        country: { title: "India", value: "IN" },
        expiry: Number((poll.result as any)[5]),
      });
    }

    setPollsFormatted(dataList);
  }, [pollsRaw]);

  console.log("pollsFormatted", pollsFormatted);

  // useEffect(() => {
  //   console.log("isRegistered", isRegistered);
  //   if (!isRegistered) {
  //     router.push("/register");
  //   } else {
  //     //TODO make api call to get all the polls in the contract
  //     setTimeout(() => {
  //       setPollData(listOfMockPolls);
  //       setIsLoading(false);
  //     }, 4000);
  //   }
  // }, []);
  const activePolls = pollsFormatted?.filter(poll => (poll?.expiry ?? 0) * 1000 > Date.now());
  const inactivePolls = pollsFormatted?.filter(poll => (poll?.expiry ?? 0) * 1000 < Date.now());
  return (
    <div className={`flex-col h-full flex-1 p-5`}>
      {activePolls || inactivePolls ? (
        <div className="flex flex-col">
          <div className="flex flex-row items-center my-7 ">
            <div className="text-3xl font-bold ">Active Polls</div>
            <span className="h-3 w-3 animate-ping ml-3 inline-flex  rounded-full bg-green-400 opacity-75"></span>
          </div>

          <div className="grid lg:grid-cols-2">
            {activePolls?.length == 0 && <div className="text-2xl text-gray-600 text-center">No Active Polls</div>}
            {activePolls?.map(voter => (
              <div className="my-4 mx-2" key={voter.title}>
                <HoverBorderCard
                  showArrow={true}
                  click={() => {
                    // navigate to the vote page
                    router.push(`/vote/${voter.id}`);
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
            ))}
          </div>

          <div className="flex flex-row items-center my-7 ">
            <div className="text-3xl font-bold ">InActive Polls</div>
            <span className="h-3 w-3 animate-ping ml-3 inline-flex  rounded-full bg-red-400 opacity-75"></span>
          </div>

          <div className="grid lg:grid-cols-2">
            {inactivePolls?.length == 0 && <div className="ext-2xl text-gray-600 text-center">No In-Active Polls</div>}
            {inactivePolls?.map(voter => (
              <div className="mb-4 mx-2" key={voter.title}>
                <HoverBorderCard
                  showArrow={true}
                  click={() => {
                    // navigate to the vote page
                    router.push(`/vote/${voter.id}?active=false`);
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
            ))}
          </div>
        </div>
      ) : (
        <LoaderPage message="Fetching Current Poll's .... " />
      )}
    </div>
  );
}
