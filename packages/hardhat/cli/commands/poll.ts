import { ZeroAddress } from "ethers";
import { MACI__factory as MACIFactory, Poll__factory as PollFactory } from "../../typechain-types";

import type { IGetPollArgs, IGetPollData } from "../utils/interfaces";

import { banner } from "../utils/banner";
import { logError, logGreen, success } from "../utils/theme";

/**
 * Get deployed poll from MACI contract
 * @param {IGetPollArgs} args - The arguments for the get poll command
 * @returns {IGetPollData} poll data
 */
export const getPoll = async ({ maciAddress, signer, pollId, quiet = true }: IGetPollArgs): Promise<IGetPollData> => {
  banner(quiet);

  const maciContract = MACIFactory.connect(maciAddress, signer);
  const id =
    pollId === undefined ? await maciContract.nextPollId().then(nextPollId => nextPollId - 1n) : BigInt(pollId);

  if (id < 0n) {
    logError(`Invalid poll id ${id}`);
  }

  const pollAddress = await maciContract.polls(id);

  if (pollAddress === ZeroAddress) {
    logError(`MACI contract doesn't have any deployed poll ${id}`);
  }

  const pollContract = PollFactory.connect(pollAddress, signer);

  const [[deployTime, duration], isStateAqMerged] = await Promise.all([
    pollContract.getDeployTimeAndDuration(),
    pollContract.stateAqMerged(),
  ]);

  const numSignups = await (isStateAqMerged ? pollContract.numSignups() : maciContract.numSignUps());

  logGreen(
    quiet,
    success(
      [
        `ID: ${id}`,
        `Deploy time: ${new Date(Number(deployTime) * 1000).toString()}`,
        `End time: ${new Date(Number(deployTime + duration) * 1000).toString()}`,
        `Number of signups ${numSignups}`,
        `State Aq merged: ${isStateAqMerged}`,
      ].join("\n"),
    ),
  );

  return {
    id,
    address: pollAddress,
    deployTime,
    duration,
    numSignups,
    isStateAqMerged,
  };
};
