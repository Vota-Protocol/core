import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { deploy, deployVkRegistryContract, genKeyPair, setVerifyingKeys } from "../cli/index";
import { poseidonContract } from "circomlibjs";
import { WorldcoinGatekeeper } from "../typechain-types";

type ExtendedHre = HardhatRuntimeEnvironment & { overwriteArtifact: (name: string, code: unknown) => Promise<void> };

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const pair1 = genKeyPair({});
  const pair2 = genKeyPair({});
  console.log(pair1);
  console.log(pair2);

  const signer = (await hre.ethers.getSigners())[0];

  const vk = await deployVkRegistryContract({ hre, signer });

  try {
    await setVerifyingKeys({
      stateTreeDepth: 10,
      intStateTreeDepth: 1,
      messageTreeDepth: 2,
      voteOptionTreeDepth: 2,
      messageBatchDepth: 1,
      processMessagesZkeyPath: "./zkeys/ProcessMessages_10-2-1-2_test/ProcessMessages_10-2-1-2_test.0.zkey",
      tallyVotesZkeyPath: "./zkeys/TallyVotes_10-1-2_test/TallyVotes_10-1-2_test.0.zkey",
      vkRegistry: vk,
      subsidyZkeyPath: undefined,
      signer,
      quiet: false,
    });
  } catch (e) {
    console.log(e);
  }

  const buildPoseidon = async (numInputs: number) => {
    await (hre as ExtendedHre).overwriteArtifact(`PoseidonT${numInputs + 1}`, poseidonContract.createCode(numInputs));
  };

  buildPoseidon(2);
  buildPoseidon(3);
  buildPoseidon(4);
  buildPoseidon(5);

  const { deployer } = await hre.getNamedAccounts();

  const gatekeeper = await hre.ethers.getContract<WorldcoinGatekeeper>("WorldcoinGatekeeper", deployer);

  console.log(`The gatekeeper is deployed at ${await gatekeeper.getAddress()}`);

  const s = await deploy({
    hre,
    stateTreeDepth: 10,
    initialVoiceCredits: undefined,
    initialVoiceCreditsProxyAddress: undefined,
    signupGatekeeperAddress: await gatekeeper.getAddress(),
    poseidonT3Address: undefined,
    poseidonT4Address: undefined,
    poseidonT5Address: undefined,
    poseidonT6Address: undefined,
    useQv: true,
    quiet: false,
    signer,
  });

  await gatekeeper.setMaciInstance(s.maciAddress);

  console.log(s);

  console.log(vk);
};

export default deployContracts;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployContracts.tags = ["All"];
