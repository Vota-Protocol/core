"use client";

import { useState } from "react";
import ContractAbi from "../../abi/Contract.abi";
import { decode } from "../../lib/wld";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { parseAbiParameters } from "viem";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";

export default function Worldcoin() {
  const { address } = useAccount();
  const [proof, setProof] = useState<ISuccessResult | null>(null);

  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDR as `0x${string}`,
    abi: ContractAbi,
    enabled: Boolean(proof) && Boolean(address),
    functionName: "verifyAndExecute",
    args: proof
      ? [
          address!,
          proof.merkle_root
            ? decode<bigint>(parseAbiParameters("uint256")[0], (proof.merkle_root ?? "") as `0x${string}`)
            : 0n,
          proof.nullifier_hash
            ? decode<bigint>(parseAbiParameters("uint256")[0], (proof.nullifier_hash ?? "") as `0x${string}`)
            : 0n,
          proof.proof
            ? decode<[bigint, bigint, bigint, bigint, bigint, bigint, bigint, bigint]>(
                parseAbiParameters("uint256[8]")[0],
                (proof.proof ?? "") as `0x${string}`,
              )
            : [0n, 0n, 0n, 0n, 0n, 0n, 0n, 0n],
        ]
      : undefined,
  });

  const { write } = useContractWrite(config);

  return (
    <main>
      {address ? (
        proof ? (
          <button onClick={write}>submit tx</button>
        ) : (
          <IDKitWidget
            signal={address}
            action="register"
            onSuccess={setProof}
            app_id={process.env.NEXT_PUBLIC_APP_ID! as `app_${string}`}
          >
            {({ open }) => <button onClick={open}>verify with world id</button>}
          </IDKitWidget>
        )
      ) : (
        <div>Connect First</div>
      )}
    </main>
  );
}
