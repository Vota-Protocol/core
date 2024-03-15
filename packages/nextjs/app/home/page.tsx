// create a new page for the voter that return Hover
import HoverBorderCard from "~~/components/card/HoverBorderCard";

const VoterPage = () => {
  const voters = [
    { id: 1, title: "Voter Page 1", numberOfCandidates: 3 },
    { id: 2, title: "Voter Page 2", numberOfCandidates: 5 },
  ];

  return (
    <div className={`flex-col bg-gradient-to-r from-cyan-[#181436] to-blue-[#19244F] h-screen p-7`}>
      <div className="flex flex-row">
        <div className="text-3xl font-bold mb-4">Poll Your Vote</div>
      </div>
      {voters.map(voter => (
        <div className="mb-4 mx-4" key={voter.id}>
          <HoverBorderCard showArrow={true}>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold">{voter.title}</h1>
              <h1 className="text-md text-slate-500">{voter.numberOfCandidates} Candidates</h1>
            </div>
          </HoverBorderCard>
        </div>
      ))}
    </div>
  );
};

export default VoterPage;
