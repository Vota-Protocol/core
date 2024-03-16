import Lottie from "lottie-react";
import voteAnimation from "~~/components/assets/vote.json";

interface LoaderPageProps {
  message?: string;
}

const LoaderPage = ({ message = "Loading ..." }: LoaderPageProps) => {
  const style = {
    height: 400,
    width: 400,
  };

  return (
    <div className="flex flex-col justify-center items-center h-full">
      <Lottie animationData={voteAnimation} style={style} />
      <p className="text-center text-3xl md:text-xl font-mono font-extrabold">{message}</p>
    </div>
  );
};

export default LoaderPage;
