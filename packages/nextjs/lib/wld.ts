// import { defaultAbiCoder as abi } from 'ethers/lib/utils'
import type { AbiParameter } from "abitype";
import { decodeAbiParameters } from "viem";

export const decode = <T>(type: AbiParameter, encodedString: `0x${string}`): T => {
  return decodeAbiParameters([type], encodedString)[0] as T;
};
