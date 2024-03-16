import type { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const appId = "app_staging_20f05974c1aca041018b2aa53c5dda6c";
const actionId = "register";

const worldIdContracts: Record<string, `0x${string}`> = {
  optimismSepolia: "0x11cA3127182f7583EfC416a8771BD4d11Fae4334",
};

const deployContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  if (!Object.keys(worldIdContracts).includes(hre.network.name)) throw "world id not on this chain";
  const { deployer } = await hre.getNamedAccounts();
  // deploy the gatekeeper
  await hre.deployments.deploy("WorldcoinGatekeeper", {
    from: deployer,
    args: [worldIdContracts[hre.network.name], appId, actionId],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });
  const gatekeeper = await hre.ethers.getContract("WorldcoinGatekeeper", deployer);
  console.log(`The gatekeeper is deployed at ${await gatekeeper.getAddress()}`);
};

export default deployContracts;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployContracts.tags = ["Gatekeeper"];
