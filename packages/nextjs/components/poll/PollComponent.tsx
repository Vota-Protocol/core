import React, { useState } from "react";
import HoverBorderCard from "../card/HoverBorderCard";
import { PubKey } from "@se-2/hardhat/domainobjs";
import { LuCross } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useChainId } from "wagmi";
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

interface PollData {
  title: string;
  options: string[];
}

const PollComponent: React.FC = () => {
  const [pollData, setPollData] = useState<PollData>({ title: "DummyTitle", options: [""] });
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const chainId = useChainId();

  const handleAddOption = () => {
    setPollData({ ...pollData, options: [...pollData.options, ""] });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...pollData.options];
    newOptions[index] = value;
    setPollData({ ...pollData, options: newOptions });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPollData({ ...pollData, title: e.target.value });
  };

  const handleEditTitleClick = () => {
    setIsEditingTitle(true);
  };

  const handleSaveTitleClick = () => {
    setIsEditingTitle(false);
  };

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

  const createPoll = () => {
    console.log(pollData);

    write();
  };

  return (
    <div className="max-w-2xl mx-auto p-6 shadow-xl rounded-md">
      <div className="flex justify-between items-center mb-4">
        {isEditingTitle ? (
          <input
            type="text"
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none"
            placeholder="Enter Poll Title"
            value={pollData.title}
            onChange={handleTitleChange}
          />
        ) : (
          <h2 className="text-xl font-semibold">{pollData.title}</h2>
        )}

        <label className="btn btn-circle swap swap-rotate ml-3">
          {/* this hidden checkbox controls the state */}
          <input
            type="checkbox"
            onChange={() => {
              if (isEditingTitle) {
                handleSaveTitleClick();
              } else {
                handleEditTitleClick();
              }
            }}
          />

          {/* hamburger icon */}
          <div className="swap-off fill-current">
            <MdEdit size={25} />
          </div>

          <div className="swap-on fill-current">
            <RxCross2 size={25} />
          </div>
        </label>
      </div>
      {pollData.options.map((option, index) => (
        <div key={index} className="mb-2 flex flex-row">
          <input
            type="text"
            className="border border-[#3647A4] bg-[#3647A4] rounded-md px-4 py-2 w-full focus:outline-none"
            placeholder={`Candidate ${index + 1}`}
            value={option}
            onChange={e => handleOptionChange(index, e.target.value)}
          />
          {index === pollData.options.length - 1 && (
            <button className="btn btn-outline ml-4" onClick={handleAddOption}>
              <LuCross size={20} />
            </button>
          )}
        </div>
      ))}

      <div className="mt-5">
        <HoverBorderCard>
          <div onClick={createPoll} className="flex justify-center w-full text-xl ">
            {" "}
            Create a Poll{" "}
          </div>
        </HoverBorderCard>
      </div>
    </div>
  );
};

export default PollComponent;
