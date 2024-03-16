import React, { useState } from "react";

type VoteCardProps = {
  children: React.ReactNode;
};

const VoteCard = ({ children }: VoteCardProps) => {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <div
      className={`w-full h-14 flex justify-center items-center border-2 border-transparent text-xl rounded-full  cursor-pointer 
            transition-all  transform 
           hover:border-[#090F21]  hover:shadow hover:scale-[0.98]
            ${clicked ? " bg-[#090F21] bg-opacity-100" : " bg-[#3647A4] bg-opacity-30"}
            `}
      onClick={handleClick}
    >
      {children}
    </div>
  );
};

export default VoteCard;
