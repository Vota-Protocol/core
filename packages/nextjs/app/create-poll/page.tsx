"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PubKey } from "@se-2/hardhat/domainobjs";
import Lottie from "lottie-react";
import { useChainId } from "wagmi";
import person from "~~/components/assets/person.json";
import LoaderPage from "~~/components/loader/loader";
import PollComponent from "~~/components/poll/PollComponent";
import { PollData } from "~~/components/poll/PollDataModel";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { contracts } from "~~/utils/scaffold-eth/contract";

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

const coordinatorPubKey = PubKey.deserialize("31c3b9d36aed8ab9490d7468cb581669ff2774791c7fcefc4cdd07bd009a019d");

function keyToParam(key: PubKey): { x: bigint; y: bigint } {
  const p = key.asContractParam();
  return { x: BigInt(p.x), y: BigInt(p.y) };
}

const CreateVote = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const celebrateStyle = {
    height: 600,
    width: 600,
  };

  const chainId = useChainId();

  const { write, data } = useScaffoldContractWrite({
    contractName: "MACI",
    functionName: "deployPoll",
    args: [
      90000n,
      {
        intStateTreeDepth: 1,
        messageTreeSubDepth: 1,
        messageTreeDepth: 2,
        voteOptionTreeDepth: 2,
      },
      keyToParam(coordinatorPubKey),
      (contracts && contracts[chainId] && contracts[chainId]["Verifier"]?.address) || undefined,
      (contracts && contracts[chainId] && contracts[chainId]["VkRegistry"]?.address) || undefined,
      false,
    ],
  });

  console.log(chainId);
  console.log(data);

  function createPoll(data: PollData): void {
    setIsLoading(true);
    // crreating the poll
    try {
      write();
    } catch (e) {
      console.error(e);
    }
    setTimeout(() => {
      router.push(`/create-poll-success?pollName=${data.title}`);
    }, 2000);
  }

  return isLoading ? (
    <div className={`flex-col bg-gradient-to-r from-[#181436] to-[#19244F] h-screen p-7`}>
      <LoaderPage message="Creating Poll, Please Wait ....." />
    </div>
  ) : (
    <div className="relative bg-gradient-to-r from-[#181436] to-[#19244F] h-screen p-7">
      <div className="absolute top-0 left-[20px] w-full h-full flex justify-end items-end">
        <Lottie animationData={person} style={celebrateStyle} />
      </div>

      <div className="relative z-10">
        <PollComponent onPollDataChange={createPoll} />
      </div>
    </div>
  );
};

export default CreateVote;
