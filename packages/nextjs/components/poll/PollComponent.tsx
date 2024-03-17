"use client";

import React, { useEffect, useState } from "react";
import HoverBorderCard from "../card/HoverBorderCard";
import CountrySelector from "../country_picker/CountryPicker";
import { COUNTRIES } from "../country_picker/countries";
import { SelectMenuOption } from "../country_picker/types";
import { PollData } from "./PollDataModel";
import { LuCross } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { encodeAbiParameters } from "viem";
import { useScaffoldContractRead, useScaffoldContractWrite } from "~~/hooks/scaffold-eth";

function encodeOptions(options: string[]) {
  return encodeAbiParameters([{ type: "string[]" }], [options]);
}

export default function PollComponent({
  next,
  setIsLoading,
}: {
  next: (title: string) => void;
  setIsLoading: (loading: boolean) => void;
}) {
  const [pollData, setPollData] = useState<PollData>({ title: "Dummy Title", options: [""], country: COUNTRIES[0] });
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [country, setCountry] = useState<SelectMenuOption["value"]>("AF");

  const handleCountryChange = (selectedCountry: SelectMenuOption["value"]) => {
    setCountry(selectedCountry);
    setPollData({ ...pollData, country: COUNTRIES.find(c => c.value === country) || COUNTRIES[0] });
  };

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

  function removeOptions(index: number): void {
    const newOptions = [...pollData.options];
    newOptions.splice(index, 1);
    setPollData({ ...pollData, options: newOptions });
  }

  const { data: fees } = useScaffoldContractRead({
    contractName: "PollManager",
    functionName: "fees",
  });

  const { writeAsync, data, isLoading } = useScaffoldContractWrite({
    contractName: "PollManager",
    functionName: "createPoll",
    args: [pollData?.title, encodeOptions(pollData?.options || []), "", BigInt(pollData?.options?.length || 0)],
    value: fees,
  });

  console.log(data);

  useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading]);

  async function onSubmit() {
    try {
      await writeAsync();
    } catch (err) {
      console.log(err);
    }

    next(pollData?.title);
  }

  return (
    <div className="max-w-2xl mx-auto p-6 shadow-2xl rounded-md  bg-gradient-to-r from-[#19244F]  to-[#181436]">
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
          <h2 className="text-xl font-semibold font-mono ">{pollData.title}</h2>
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
      <div className="flex flex-row place-contents-center">
        <div className="flex self-center mr-5 text-lg ">Pick the Country</div>
        <div className="flex flex-1 flex-col">
          <CountrySelector
            id={"country-selector"}
            open={isOpen}
            onToggle={() => setIsOpen(!isOpen)}
            onChange={handleCountryChange}
            selectedValue={COUNTRIES.find(c => c.value === country) || COUNTRIES[0]}
          />
        </div>
      </div>

      <div className="w-full h-[0.5px] bg-[#3647A4] shadow-2xl my-5" />

      <div className="mb-3">Create the options</div>

      {pollData.options.map((option, index) => (
        <div key={index} className="mb-2 flex flex-row">
          <input
            type="text"
            className="border border-[#3647A4] bg-[#3647A4] rounded-md px-4 py-2 w-full focus:outline-none "
            placeholder={`Candidate ${index + 1}`}
            value={option}
            onChange={e => handleOptionChange(index, e.target.value)}
          />
          {index === pollData.options.length - 1 ? (
            <button className="btn btn-outline ml-4" onClick={handleAddOption}>
              <LuCross size={20} />
            </button>
          ) : (
            <button className="btn btn-outline ml-4" onClick={() => removeOptions(index)}>
              <RxCross2 size={20} />
            </button>
          )}
        </div>
      ))}

      <div className="mt-5">
        <HoverBorderCard click={onSubmit}>
          <div className="flex justify-center w-full text-xl "> Create a Poll </div>
        </HoverBorderCard>
      </div>
    </div>
  );
}
