import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { MACI, PollManager, Verifier, VkRegistry } from "../typechain-types";
import { Keypair } from "../domainobjs";
import fs from "fs";

function fetchOrCreateKeyPair(filePath: string) {
  let keypair: Keypair | null = null;
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    const jsonPair = JSON.parse(data.toString("utf-8"));
    keypair = Keypair.fromJSON(jsonPair);
  }
  if (!keypair) {
    keypair = new Keypair();
    fs.writeFileSync(filePath, JSON.stringify(keypair.toJSON()));
  }

  return keypair as Keypair;
}

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();

  const maciContract = await hre.ethers.getContract<MACI>("MACI", deployer);

  // deploy the gatekeeper
  await hre.deployments.deploy("PollManager", {
    from: deployer,
    args: [await maciContract.getAddress()],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
  const pollManager = await hre.ethers.getContract<PollManager>("PollManager", deployer);
  console.log(`The poll manager is deployed at ${await pollManager.getAddress()}`);

  // update the maci contract
  await maciContract.updateManager(await pollManager.getAddress());

  // update the config on the poll manager
  const verifier = await hre.ethers.getContract<Verifier>("Verifier", deployer);
  const vkRegistry = await hre.ethers.getContract<VkRegistry>("VkRegistry", deployer);

  // generate and save the coordinator key pair
  const filePath = "./coordinatorKeyPair.json";
  const coordinatorKeypair = fetchOrCreateKeyPair(filePath);

  await pollManager.setConfig(
    {
      intStateTreeDepth: 1,
      messageTreeSubDepth: 1,
      messageTreeDepth: 2,
      voteOptionTreeDepth: 2,
    },
    coordinatorKeypair.pubKey.asContractParam(),
    await verifier.getAddress(),
    await vkRegistry.getAddress(),
    false,
  );
};

export default deployContracts;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployContracts.tags = ["PollManager"];
