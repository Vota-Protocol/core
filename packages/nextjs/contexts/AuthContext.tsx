"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Keypair } from "@se-2/hardhat/domainobjs";
import { useAccount } from "wagmi";
import { useScaffoldContractRead } from "~~/hooks/scaffold-eth";
import { fetchOrCreateUserKeyPair } from "~~/utils/crypto";

interface IAuthContext {
  isRegistered: boolean;
  refetchIsRegistered: () => any;
  keypair: Keypair | null;
}

export const AuthContext = createContext<IAuthContext>({} as IAuthContext);

export default function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const [keypair, setKeyPair] = useState<Keypair | null>(null);

  useEffect(() => {
    setKeyPair(fetchOrCreateUserKeyPair(address));
  }, [address]);

  const { data: isRegistered, refetch: refetchIsRegistered } = useScaffoldContractRead({
    contractName: "WorldcoinGatekeeper",
    functionName: "registeredUsers",
    args: [address],
  });

  console.log(isRegistered);

  // useEffect(() => {
  //   if (!isRegistered) {
  //     redirect("/register");
  //   }
  // }, [isRegistered]);

  return (
    <AuthContext.Provider value={{ isRegistered: Boolean(isRegistered), keypair, refetchIsRegistered }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
