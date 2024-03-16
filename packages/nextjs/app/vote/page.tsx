"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import VoteCard from "~~/components/card/VoteCard";

const Vote = () => {
  const searchParams = useSearchParams();
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);
  const handleCardClick = (index: number) => {
    setClickedIndex(index);
  };

  const candidates = ["Candidate 1", "Candidate 2", "Candidate 3"];

  return (
    <div className="flex-col bg-gradient-to-r from-[#181436] to-[#19244F] h-screen p-7">
      <h1>Vote for {searchParams.get("id") ?? "-1"}</h1>
      {candidates.map((candidate, index) => (
        <div className="pb-3" key={index}>
          <VoteCard clicked={clickedIndex === index} onClick={() => handleCardClick(index)}>
            <div>{candidate}</div>
          </VoteCard>
        </div>
      ))}
    </div>
  );
};

export default Vote;

// import { useState } from "react";

// // ...

// const Vote = () => {
//   const searchParams = useSearchParams();
//   const [clickedIndex, setClickedIndex] = useState<number | null>(null);

//   const candidates = ["Candidate 1", "Candidate 2", "Candidate 3"];

//   const handleCardClick = (index: number) => {
//     setClickedIndex(index);
//   };

//   return (
//     <div className="flex-col bg-gradient-to-r from-[#181436] to-[#19244F] h-screen p-7">
//       <h1>Vote for {searchParams.get("id") ?? "-1"}</h1>
//       {candidates.map((candidate, index) => (
//         <div className="pb-3" key={index}>
//           <VoteCard
//             clicked={clickedIndex === index}
//             onClick={() => handleCardClick(index)}
//           >
//             <div>{candidate}</div>
//           </VoteCard>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Vote;
