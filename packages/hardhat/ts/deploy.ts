import { type ContractFactory, type Signer, BaseContract } from "ethers";

import type { IDeployMaciArgs, IDeployedMaci, IDeployedPoseidonContracts } from "./types";

import {
  AccQueueQuinaryMaci,
  ConstantInitialVoiceCreditProxy,
  FreeForAllGatekeeper,
  PoseidonT3__factory as PoseidonT3Factory,
  PoseidonT4__factory as PoseidonT4Factory,
  PoseidonT5__factory as PoseidonT5Factory,
  PoseidonT6__factory as PoseidonT6Factory,
  MACI,
  MockVerifier,
  PollFactory,
  MessageProcessorFactory,
  SubsidyFactory,
  TallyFactory,
  PoseidonT3,
  PoseidonT4,
  PoseidonT5,
  PoseidonT6,
  SignUpToken,
  SignUpTokenGatekeeper,
  TopupCredit,
  Verifier,
  VkRegistry,
  TallyNonQvFactory,
} from "../typechain-types";

import { parseArtifact } from "./abi";
import { getDefaultSigner, log } from "./utils";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { Address } from "hardhat-deploy/types";

/**
 * Link Poseidon libraries to a Smart Contract
 * @param solFileToLink - the name of the contract to link the libraries to
 * @param poseidonT3Address - the address of the PoseidonT3 contract
 * @param poseidonT4Address - the address of the PoseidonT4 contract
 * @param poseidonT5Address - the address of the PoseidonT5 contract
 * @param poseidonT6Address - the address of the PoseidonT6 contract
 * @param signer - the signer to use to deploy the contract
 * @param quiet - whether to suppress console output
 * @returns a contract factory with the libraries linked
 */
export const linkPoseidonLibraries = async (
  solFileToLink: string,
  poseidonT3Address: string,
  poseidonT4Address: string,
  poseidonT5Address: string,
  poseidonT6Address: string,
  signer?: Signer,
  quiet = false,
): Promise<ContractFactory> => {
  log(`Linking Poseidon libraries to ${solFileToLink}`, quiet);
  const { ethers } = await import("hardhat");

  const contractFactory = await ethers.getContractFactory(solFileToLink, {
    signer: signer || (await getDefaultSigner()),
    libraries: {
      PoseidonT3: poseidonT3Address,
      PoseidonT4: poseidonT4Address,
      PoseidonT5: poseidonT5Address,
      PoseidonT6: poseidonT6Address,
    },
  });

  console.log("jdshfkjhsd");

  return contractFactory;
};

/**
 * Deploy a Smart Contract given a name and some arguments
 * @param contractName - the name of the contract
 * @param signer - the signer to use to deploy the contract
 * @param quiet - whether to suppress console output
 * @param args - the constructor arguments of the contract
 */
export const deployContract = async <T extends BaseContract>(
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  signer?: Signer,
  quiet = false,
  ...args: unknown[]
): Promise<T> => {
  log(`Deploying ${contractName}`, quiet);
  // const { ethers } = await import("hardhat");

  // const contractFactory = await ethers.getContractFactory(contractName, signer || (await getDefaultSigner()));
  // const feeData = await getFeeData();
  // const contract = await contractFactory.deploy(...args, {
  //   maxFeePerGas: feeData?.maxFeePerGas,
  //   maxPriorityFeePerGas: feeData?.maxPriorityFeePerGas,
  // });
  // await contract.deploymentTransaction()!.wait();

  const { deploy } = hre.deployments;

  const { deployer } = await hre.getNamedAccounts();

  await deploy(contractName, {
    from: deployer,
    // Contract constructor arguments
    args: args,
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const contract = await hre.ethers.getContract<T>(contractName, deployer);

  return contract;
};

/**
 * Deploy a TopupCredit contract
 * @param signer - the signer to use to deploy the contract
 * @param quiet - whether to suppress console output
 * @returns the deployed TopupCredit contract
 */
export const deployTopupCredit = async (
  hre: HardhatRuntimeEnvironment,
  signer?: Signer,
  quiet = false,
): Promise<TopupCredit> => deployContract<TopupCredit>(hre, "TopupCredit", signer, quiet);

/**
 * Deploy a VkRegistry contract
 * @param signer - the signer to use to deploy the contract
 * @param quiet - whether to suppress console output
 * @returns the deployed VkRegistry contract
 */
export const deployVkRegistry = async (
  hre: HardhatRuntimeEnvironment,
  signer?: Signer,
  quiet = false,
): Promise<VkRegistry> => deployContract<VkRegistry>(hre, "VkRegistry", signer, quiet);

/**
 * Deploy a MockVerifier contract (testing only)
 * @param signer - the signer to use to deploy the contract
 * @param quiet - whether to suppress console output
 * @returns the deployed MockVerifier contract
 */
export const deployMockVerifier = async (
  hre: HardhatRuntimeEnvironment,
  signer?: Signer,
  quiet = false,
): Promise<MockVerifier> => deployContract<MockVerifier>(hre, "MockVerifier", signer, quiet);

/**
 * Deploy a Verifier contract
 * @param signer - the signer to use to deploy the contract
 * @param quiet - whether to suppress console output
 * @returns the deployed Verifier contract
 */
export const deployVerifier = async (
  hre: HardhatRuntimeEnvironment,
  signer?: Signer,
  quiet = false,
): Promise<Verifier> => deployContract<Verifier>(hre, "Verifier", signer, quiet);

/**
 * Deploy a constant initial voice credit proxy contract
 * @param signer - the signer to use to deploy the contract
 * @param amount - the amount of initial voice credit to give to each user
 * @param quiet - whether to suppress console output
 * @returns the deployed ConstantInitialVoiceCreditProxy contract
 */
export const deployConstantInitialVoiceCreditProxy = async (
  hre: HardhatRuntimeEnvironment,
  amount: number,
  signer?: Signer,
  quiet = false,
): Promise<ConstantInitialVoiceCreditProxy> =>
  deployContract<ConstantInitialVoiceCreditProxy>(
    hre,
    "ConstantInitialVoiceCreditProxy",
    signer,
    quiet,
    amount.toString(),
  );

/**
 * Deploy a SignUpToken contract
 * @param signer - the signer to use to deploy the contract
 * @param quiet - whether to suppress console output
 * @returns the deployed SignUpToken contract
 */
export const deploySignupToken = async (
  hre: HardhatRuntimeEnvironment,
  signer?: Signer,
  quiet = false,
): Promise<SignUpToken> => deployContract<SignUpToken>(hre, "SignUpToken", signer, quiet);

/**
 * Deploy a SignUpTokenGatekeeper contract
 * @param signUpTokenAddress - the address of the SignUpToken contract
 * @param signer - the signer to use to deploy the contract
 * @param quiet - whether to suppress console output
 * @returns a SignUpTokenGatekeeper contract
 */
export const deploySignupTokenGatekeeper = async (
  hre: HardhatRuntimeEnvironment,
  signUpTokenAddress: string,
  signer?: Signer,
  quiet = false,
): Promise<SignUpTokenGatekeeper> =>
  deployContract<SignUpTokenGatekeeper>(hre, "SignUpTokenGatekeeper", signer, quiet, signUpTokenAddress);

/**
 * Deploy a FreeForAllGatekeeper contract
 * @param signer - the signer to use to deploy the contract
 * @param quiet - whether to suppress console output
 * @returns the deployed FreeForAllGatekeeper contract
 */
export const deployFreeForAllSignUpGatekeeper = async (
  hre: HardhatRuntimeEnvironment,
  signer?: Signer,
  quiet = false,
): Promise<FreeForAllGatekeeper> => deployContract<FreeForAllGatekeeper>(hre, "FreeForAllGatekeeper", signer, quiet);

/**
 * Deploy Poseidon contracts
 * @param signer - the signer to use to deploy the contracts
 * @param quiet - whether to suppress console output
 * @returns the deployed Poseidon contracts
 */
export const deployPoseidonContracts = async (
  hre: HardhatRuntimeEnvironment,
  signer?: Signer,
  { poseidonT3, poseidonT4, poseidonT5, poseidonT6 }: IDeployMaciArgs["poseidonAddresses"] = {},
  quiet = false,
): Promise<IDeployedPoseidonContracts> => {
  const [PoseidonT3Contract, PoseidonT4Contract, PoseidonT5Contract, PoseidonT6Contract] = await Promise.all([
    !poseidonT3
      ? await deployContract<PoseidonT3>(hre, "PoseidonT3", signer, quiet)
      : PoseidonT3Factory.connect(poseidonT3),
    !poseidonT4
      ? await deployContract<PoseidonT4>(hre, "PoseidonT4", signer, quiet)
      : PoseidonT4Factory.connect(poseidonT4),
    !poseidonT5
      ? await deployContract<PoseidonT5>(hre, "PoseidonT5", signer, quiet)
      : PoseidonT5Factory.connect(poseidonT5),
    !poseidonT6
      ? await deployContract<PoseidonT6>(hre, "PoseidonT6", signer, quiet)
      : PoseidonT6Factory.connect(poseidonT6),
  ]);

  console.log(await PoseidonT3Contract.poseidon([1n, 1n]));

  return {
    PoseidonT3Contract,
    PoseidonT4Contract,
    PoseidonT5Contract,
    PoseidonT6Contract,
  };
};

/**
 * Deploy a contract with linked libraries
 * @param contractFactory - the contract factory to use
 * @param name - the name of the contract
 * @param quiet - whether to suppress console output
 * @param args - the constructor arguments of the contract
 * @returns the deployed contract instance
 */
export const deployContractWithLinkedLibraries = async <T extends BaseContract>(
  hre: HardhatRuntimeEnvironment,
  contractFactory: ContractFactory,
  name: string,
  quiet = false,
  libraries: { [libraryName: string]: Address },
  ...args: unknown[]
): Promise<T> => {
  log(`Deploying ${name}`, quiet);
  // const feeData = await getFeeData();

  const { deploy } = hre.deployments;

  const { deployer } = await hre.getNamedAccounts();

  console.log({ name, args, libraries });

  await deploy(name, {
    from: deployer,
    // Contract constructor arguments
    args: args,
    log: true,
    libraries,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  const contract = await hre.ethers.getContract<T>(name, deployer);

  return contract;

  // const contract = await contractFactory.deploy(...args, {
  //   maxFeePerGas: feeData?.maxFeePerGas,
  //   maxPriorityFeePerGas: feeData?.maxPriorityFeePerGas,
  // });
  // await contract.deploymentTransaction()!.wait();

  // return contract as T;
};

/**
 * Deploy a Poll Factory contract
 * @param signer - the signer object to use to deploy the contract
 * @param quiet - whether to suppress console output
 * @returns the deployed Poll Factory contract
 */
export const deployPollFactory = async (
  hre: HardhatRuntimeEnvironment,
  signer: Signer,
  quiet = false,
): Promise<PollFactory> => {
  const poseidonContracts = await deployPoseidonContracts(hre, signer, {}, quiet);
  const [poseidonT3Contract, poseidonT4Contract, poseidonT5Contract, poseidonT6Contract] = await Promise.all([
    poseidonContracts.PoseidonT3Contract.getAddress(),
    poseidonContracts.PoseidonT4Contract.getAddress(),
    poseidonContracts.PoseidonT5Contract.getAddress(),
    poseidonContracts.PoseidonT6Contract.getAddress(),
  ]);

  const contractFactory = await linkPoseidonLibraries(
    "PollFactory",
    poseidonT3Contract,
    poseidonT4Contract,
    poseidonT5Contract,
    poseidonT6Contract,
    signer,
    quiet,
  );
  return deployContractWithLinkedLibraries(hre, contractFactory, "PollFactory", quiet, {
    PoseidonT3: poseidonT3Contract,
    PoseidonT4: poseidonT4Contract,
    PoseidonT5: poseidonT5Contract,
    PoseidonT6: poseidonT6Contract,
  });
};

/**
 * Deploy a MACI contract
 * @param {IDeployMaciArgs} args - deploy arguments
 * @returns {IDeployedMaci} the deployed MACI contract
 */
export const deployMaci = async ({
  hre,
  signUpTokenGatekeeperContractAddress,
  initialVoiceCreditBalanceAddress,
  topupCreditContractAddress,
  signer,
  poseidonAddresses,
  stateTreeDepth = 10,
  useQv = true,
  quiet = true,
}: IDeployMaciArgs): Promise<IDeployedMaci> => {
  const { PoseidonT3Contract, PoseidonT4Contract, PoseidonT5Contract, PoseidonT6Contract } =
    await deployPoseidonContracts(hre, signer, poseidonAddresses, quiet);

  const poseidonAddrs = await Promise.all([
    PoseidonT3Contract.getAddress(),
    PoseidonT4Contract.getAddress(),
    PoseidonT5Contract.getAddress(),
    PoseidonT6Contract.getAddress(),
  ]).then(([poseidonT3, poseidonT4, poseidonT5, poseidonT6]) => ({
    poseidonT3,
    poseidonT4,
    poseidonT5,
    poseidonT6,
  }));

  console.log(poseidonAddrs);

  const contractsToLink = [
    "MACI",
    "PollFactory",
    "MessageProcessorFactory",
    "TallyFactory",
    "TallyNonQvFactory",
    "SubsidyFactory",
  ];

  // Link Poseidon contracts to MACI
  const linkedContractFactories = await Promise.all(
    contractsToLink.map(async (contractName: string) =>
      linkPoseidonLibraries(
        contractName,
        poseidonAddrs.poseidonT3,
        poseidonAddrs.poseidonT4,
        poseidonAddrs.poseidonT5,
        poseidonAddrs.poseidonT6,
        signer,
        quiet,
      ),
    ),
  );

  const [
    maciContractFactory,
    pollFactoryContractFactory,
    messageProcessorFactory,
    tallyFactory,
    tallyFactoryNonQv,
    subsidyFactory,
  ] = await Promise.all(linkedContractFactories);

  console.log("sd");

  const pollFactoryContract = await deployContractWithLinkedLibraries<PollFactory>(
    hre,
    pollFactoryContractFactory,
    "PollFactory",
    quiet,
    {
      PoseidonT3: poseidonAddrs.poseidonT3,
      PoseidonT4: poseidonAddrs.poseidonT4,
      PoseidonT5: poseidonAddrs.poseidonT5,
      PoseidonT6: poseidonAddrs.poseidonT6,
    },
  );

  console.log("fsd");
  const messageProcessorFactoryContract = await deployContractWithLinkedLibraries<MessageProcessorFactory>(
    hre,
    messageProcessorFactory,
    "MessageProcessorFactory",
    quiet,
    {
      PoseidonT3: poseidonAddrs.poseidonT3,
      PoseidonT4: poseidonAddrs.poseidonT4,
      PoseidonT5: poseidonAddrs.poseidonT5,
      PoseidonT6: poseidonAddrs.poseidonT6,
    },
  );

  console.log("sdfjkshdk");

  // deploy either the qv or non qv tally factory - they both implement the same interface
  // so as long as maci is concerned, they are interchangeable
  const tallyFactoryContract = useQv
    ? await deployContractWithLinkedLibraries<TallyFactory>(hre, tallyFactory, "TallyFactory", quiet, {
        PoseidonT3: poseidonAddrs.poseidonT3,
        PoseidonT4: poseidonAddrs.poseidonT4,
        PoseidonT5: poseidonAddrs.poseidonT5,
        PoseidonT6: poseidonAddrs.poseidonT6,
      })
    : await deployContractWithLinkedLibraries<TallyNonQvFactory>(hre, tallyFactoryNonQv, "TallyNonQvFactory", quiet, {
        PoseidonT3: poseidonAddrs.poseidonT3,
        PoseidonT4: poseidonAddrs.poseidonT4,
        PoseidonT5: poseidonAddrs.poseidonT5,
        PoseidonT6: poseidonAddrs.poseidonT6,
      });

  const subsidyFactoryContract = await deployContractWithLinkedLibraries<SubsidyFactory>(
    hre,
    subsidyFactory,
    "SubsidyFactory",
    quiet,
    {
      PoseidonT3: poseidonAddrs.poseidonT3,
      PoseidonT4: poseidonAddrs.poseidonT4,
      PoseidonT5: poseidonAddrs.poseidonT5,
      PoseidonT6: poseidonAddrs.poseidonT6,
    },
  );

  const [pollAddr, mpAddr, tallyAddr, subsidyAddr] = await Promise.all([
    pollFactoryContract.getAddress(),
    messageProcessorFactoryContract.getAddress(),
    tallyFactoryContract.getAddress(),
    subsidyFactoryContract.getAddress(),
  ]);
  console.log("A");

  console.log({
    maciContractFactory,
    asd: "MACI",
    quiet,
    l: {
      PoseidonT3: poseidonAddrs.poseidonT3,
      PoseidonT4: poseidonAddrs.poseidonT4,
      PoseidonT5: poseidonAddrs.poseidonT5,
      PoseidonT6: poseidonAddrs.poseidonT6,
    },
    pollAddr,
    mpAddr,
    tallyAddr,
    subsidyAddr,
    signUpTokenGatekeeperContractAddress,
    initialVoiceCreditBalanceAddress,
    topupCreditContractAddress,
    stateTreeDepth,
  });

  // const maciContract = await deployContract(
  //   hre,
  //   "MACI",
  //   signer,
  //   quiet,
  //   pollAddr,
  //   mpAddr,
  //   tallyAddr,
  //   subsidyAddr,
  //   signUpTokenGatekeeperContractAddress,
  //   initialVoiceCreditBalanceAddress,
  //   topupCreditContractAddress,
  //   stateTreeDepth,
  // );

  const maciContract = await deployContractWithLinkedLibraries<MACI>(
    hre,
    maciContractFactory,
    "MACI",
    quiet,
    {
      PoseidonT3: poseidonAddrs.poseidonT3,
      PoseidonT4: poseidonAddrs.poseidonT4,
      PoseidonT5: poseidonAddrs.poseidonT5,
      PoseidonT6: poseidonAddrs.poseidonT6,
    },
    pollAddr,
    mpAddr,
    tallyAddr,
    subsidyAddr,
    signUpTokenGatekeeperContractAddress,
    initialVoiceCreditBalanceAddress,
    topupCreditContractAddress,
    stateTreeDepth,
  );

  const [AccQueueQuinaryMaciAbi] = parseArtifact("AccQueue");
  const stateAqContractAddress = await maciContract.stateAq();
  const stateAqContract = new BaseContract(
    stateAqContractAddress,
    AccQueueQuinaryMaciAbi,
    await getDefaultSigner(),
  ) as AccQueueQuinaryMaci;

  return {
    maciContract,
    stateAqContract,
    pollFactoryContract,
    poseidonAddrs,
  };
};
