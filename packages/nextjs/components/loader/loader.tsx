"use client";

import Lottie from "lottie-react";
import voteAnimation from "~~/components/assets/vote.json";

const LoaderPage = () => {
  const style = {
    height: 400,
    width: 400,
  };
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Lottie animationData={voteAnimation} style={style} />
      <p className="text-center text-3xl font-mono font-extrabold">Loading...</p>
    </div>
  );
};

export default LoaderPage;
