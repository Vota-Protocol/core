"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Keypair, PubKey } from "@se-2/hardhat/domainobjs";
import { IDKitWidget, ISuccessResult } from "@worldcoin/idkit";
import Lottie from "lottie-react";
import { encodeAbiParameters, parseAbiParameters } from "viem";
import { useAccount, useConnect } from "wagmi";
import walletAnimation from "~~/components/assets/wallet.json";
import walletConnectedAnimation from "~~/components/assets/wallet_connected.json";
import worldCoinGif from "~~/components/assets/worldcoin.gif";
import HoverBorderCard from "~~/components/card/HoverBorderCard";
import { useAuthContext } from "~~/contexts/AuthContext";
import { useScaffoldContractWrite } from "~~/hooks/scaffold-eth";
import { useAuthUserOnly } from "~~/hooks/useAuthUserOnly";
import { decode } from "~~/lib/wld";
import { fetchOrCreateUserKeyPair } from "~~/utils/crypto";

export default function RegisterPage() {
  const { address } = useAccount();
  const [keypair, setKeyPair] = useState<Keypair | null>(null);
  const [proof, setProof] = useState<ISuccessResult | null>(null);
  const [encodedProof, setEncodedProof] = useState<`0x${string}` | undefined>();

  useAuthUserOnly({ inverted: true });

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

  const { connect, connectors } = useConnect();

  const { writeAsync } = useScaffoldContractWrite({
    contractName: "MACI",
    functionName: "signUp",
    args: [
      keyToParam(keypair?.pubKey),
      encodedProof,
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    ],
  });

  const { refetchIsRegistered } = useAuthContext();

  useEffect(() => {
    if (!encodedProof) return;
    (async () => {
      try {
        await writeAsync();
        refetchIsRegistered();
        console.log("Registered");
      } catch (e) {
        console.error(e);
      }
    })();
  }, [encodedProof]);

  const style = {
    height: 120,
    width: 120,
  };

  return (
    <div className="flex flex-col bg-gradient-to-r from-[#181436] to-[#19244F] h-screen p-7">
      <div>
        <div className="mb-10">
          <HoverBorderCard disabled={address != null} click={() => connect({ connector: connectors[0] })}>
            <div className="flex justify-center w-full text-xl flex-col items-center">
              <div className="my-2">{address ? "Wallet Connected" : "Connect to"}</div>
              {address ? (
                <Lottie animationData={walletConnectedAnimation} loop={false} style={style} />
              ) : (
                <Lottie animationData={walletAnimation} style={style} />
              )}
            </div>
          </HoverBorderCard>
        </div>
        <IDKitWidget
          signal={address}
          action="register"
          onSuccess={setProof}
          app_id={process.env.NEXT_PUBLIC_APP_ID! as `app_${string}`}
        >
          {({ open }) => (
            <div>
              <HoverBorderCard click={open} disabled={address == null}>
                <div className="flex justify-center w-full text-xl flex-col items-center ">
                  Register with
                  <Image className="rounded-full my-10" src={worldCoinGif} alt="my gif" height={100} width={100} />
                </div>
              </HoverBorderCard>
            </div>
          )}
        </IDKitWidget>
      </div>
    </div>
  );
}
