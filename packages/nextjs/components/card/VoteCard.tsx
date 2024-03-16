import { BiLike } from "react-icons/bi";

type VoteCardProps = {
  children: React.ReactNode;
  clicked: boolean;
  onClick: () => void;
};

const VoteCard = ({ children, clicked, onClick }: VoteCardProps) => {
  const handleClick = () => {
    onClick();
  };

  // Rest of the component code...

  return (
    <div
      className={`w-full h-14 flex justify-end items-center border-2 border-transparent text-xl rounded-full  cursor-pointer 
            transition-all  transform 
           hover:border-[#090F21]  hover:shadow hover:scale-[0.98]
            ${
              clicked
                ? " bg-[#283896] bg-opacity-100 scale-[0.98] shadow border-[#090F21]"
                : " bg-[#3647A4] bg-opacity-30"
            }
            `}
      onClick={handleClick}
    >
      <div className="flex-grow text-center">{children}</div>
      <div className={`transition-all mr-5 transform ${clicked ? "opacity-100" : " opacity-0"}`}>
        <BiLike />
      </div>
    </div>
  );
};

export default VoteCard;
