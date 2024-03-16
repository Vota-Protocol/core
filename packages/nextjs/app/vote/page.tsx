"use client";

import { useSearchParams } from "next/navigation";

const Vote = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "-1";

  return (
    <div>
      <h1>Vote</h1>
      <p>Vote for {id}</p>
    </div>
  );
};

export default Vote;
