import React, { useState } from "react";
import HoverBorderCard from "../card/HoverBorderCard";
import { LuCross } from "react-icons/lu";
import { MdEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";

interface PollData {
  title: string;
  options: string[];
}

const PollComponent: React.FC = () => {
  const [pollData, setPollData] = useState<PollData>({ title: "DummyTitle", options: [""] });
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);

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
          <div className="flex justify-center w-full text-xl "> Create a Poll </div>
        </HoverBorderCard>
      </div>
    </div>
  );
};

export default PollComponent;
