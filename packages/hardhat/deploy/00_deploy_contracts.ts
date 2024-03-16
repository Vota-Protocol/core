import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
// import { Contract } from "ethers";
// import { deployMaci } from "../ts/index";
import { deploy, deployVkRegistryContract, genKeyPair, setVerifyingKeys } from "../cli/index";
import { poseidonContract } from "circomlibjs";

type ExtendedHre = HardhatRuntimeEnvironment & { overwriteArtifact: (name: string, code: unknown) => Promise<void> };

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // /*
  //   On localhost, the deployer account is the one that comes with Hardhat, which is already funded.
  //   When deploying to live networks (e.g `yarn deploy --network goerli`), the deployer account
  //   should have sufficient balance to pay for the gas fees for contract creation.
  //   You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
  //   with a random private key in the .env file (then used on hardhat.config.ts)
  //   You can run the `yarn account` command to check your balance in every network.
  // */
  // const { deployer } = await hre.getNamedAccounts();
  // const { deploy } = hre.deployments;
  // await deploy("YourContract", {
  //   from: deployer,
  //   // Contract constructor arguments
  //   args: [deployer],
  //   log: true,
  //   // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
  //   // automatically mining the contract deployment transaction. There is no effect on live networks.
  //   autoMine: true,
  // });
  // // Get the deployed contract to interact with it after deploying.
  // const yourContract = await hre.ethers.getContract<Contract>("YourContract", deployer);
  // console.log("👋 Initial greeting:", await yourContract.greeting());

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

  const s = await deploy({
    hre,
    stateTreeDepth: 10,
    initialVoiceCredits: undefined,
    initialVoiceCreditsProxyAddress: undefined,
    signupGatekeeperAddress: undefined,
    poseidonT3Address: undefined,
    poseidonT4Address: undefined,
    poseidonT5Address: undefined,
    poseidonT6Address: undefined,
    useQv: true,
    quiet: false,
    signer,
  });

  console.log(s);

  console.log(vk);
};

export default deployContracts;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployContracts.tags = ["All"];
