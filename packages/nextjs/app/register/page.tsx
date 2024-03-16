"use client";

import { useEffect, useState } from "react";
import { Keypair, PubKey } from "@se-2/hardhat/domainobjs";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import { encodeAbiParameters, parseAbiParameters } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { decode } from "~~/lib/wld";
import { fetchOrCreateUserKeyPair } from "~~/utils/crypto";

export default function RegisterPage() {
  const { address } = useAccount();
  const [keypair, setKeyPair] = useState<Keypair | null>(null);
  const [proof, setProof] = useState<ISuccessResult | null>(null);
  const [encodedProof, setEncodedProof] = useState<`0x${string}` | undefined>();

  useEffect(() => {
    setKeyPair(fetchOrCreateUserKeyPair(address));
  }, [address]);

  useEffect(() => {
    if (!proof || !address) {
      setEncodedProof(undefined);
      return;
    }

    setEncodedProof(
      encodeAbiParameters(
        [{ type: "address" }, { type: "uint256" }, { type: "uint256" }, { type: "uint256[8]" }],
        [
          address,
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
        ],
      ),
    );
  }, [proof]);

  function keyToParam(key?: PubKey): { x: bigint; y: bigint } | undefined {
    if (!key) return undefined;
    const p = key.asContractParam();
    return { x: BigInt(p.x), y: BigInt(p.y) };
  }

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "MACI",
    functionName: "signUp",
    args: [
      keyToParam(keypair?.pubKey),
      encodedProof,
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    ],
  });

  useEffect(() => {
    writeAsync();
  }, [encodedProof]);

  return (
    <main>
      {address ? (
        <IDKitWidget
          signal={address}
          action="register"
          onSuccess={setProof}
          app_id={process.env.NEXT_PUBLIC_APP_ID! as `app_${string}`}
        >
          {({ open }) => <button onClick={open}>verify with world id</button>}
        </IDKitWidget>
      ) : (
        <div>Connect First</div>
      )}
    </main>
  );
}
