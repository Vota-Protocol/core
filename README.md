# VOTA

```md

### Deployments & Infrastructure

#### MACI

- ToDo

#### Chainlink Automation

Running for smart contract `0x3Cd1f1dF7DBcda4d0BA0C6B15367425461DAfD23` on chain `Ethereum Sepolia` every 15 minutes.

#### CCIPWorldcoinBridging

- Sepolia - `0x3Cd1f1dF7DBcda4d0BA0C6B15367425461DAfD23`
- Polygon Mumbai - `0x01d0ADFF34833aC8C74fac8Fc940Ad217CFA0b83`

#### HyperlaneWorldcoinBridging

- Sepolia - `0xe93F6d33F04c738F8D50a0E5739b41509901a8EA`
- Polygon Mumbai - ``

#### Hyperlane

##### Arbitrum Sepolia

    "merkleRootMultisigIsmFactory": "0xEcc119D8d180589bC66CEF3d9bD0A5fE0e564C0C",
    "messageIdMultisigIsmFactory": "0x435d35cF8dD876f07dAEaC57377a3C0C75b11332",
    "aggregationIsmFactory": "0xa777F9A5f281187aa81b4D7bAc749e2D1922d1b6",
    "aggregationHookFactory": "0x135198dFC62364872bBD01c6d2eec30c8888f2E0",
    "routingIsmFactory": "0xd58047f585Fba8f2d69B7945e3Fc487b6DBE8e8a",
    "interchainSecurityModule": "0x9A968E07776b593713C9043539E280fE95B140ec",
    "sepolia": {
      "messageIdMultisigIsm": "0x918Bac1Cf221474d558a329C9245dacb05Ac567d",
      "merkleRootMultisigIsm": "0xa477bfdF938F4A9c3B873F14BCb516d3E2C5d9f4",
      "staticAggregationIsm": "0xe6Dd9cc0F872DE3C8739936b0C463620AE1D92e3"
    },
    "domainRoutingIsm": "0x9A968E07776b593713C9043539E280fE95B140ec",
    "merkleTreeHook": "0xA4b78aFF9003De6490645897479C0b39c7B6BcaC",
    "protocolFee": "0xe8Fea4176D66658455961b8EbCabE72A2DD7d4C2",
    "testRecipient": "0x2ee3B227330326ddF76Ad412799dCA7C3B1Aec7B",
    "mailbox": "0x7C31Cc45dAC967645b2954940Ec0C1106cE37B72",
    "proxyAdmin": "0x73820bdD103587C1A4adEEc270d1155c690e065a",
    "validatorAnnounce": "0xa7A3901192a356aDff7043f58e396505CDc75f07"

##### Ethereum Sepolia

    "merkleRootMultisigIsmFactory": "0x0a71AcC99967829eE305a285750017C4916Ca269",
    "messageIdMultisigIsmFactory": "0xFEb9585b2f948c1eD74034205a7439261a9d27DD",
    "aggregationIsmFactory": "0xC83e12EF2627ACE445C298e6eC418684918a6002",
    "aggregationHookFactory": "0x160C28C92cA453570aD7C031972b58d5Dd128F72",
    "routingIsmFactory": "0x3F100cBBE5FD5466BdB4B3a15Ac226957e7965Ad",
    "interchainSecurityModule": "0xd9c6415ED929C445a691886AF53D782D77E820cf",
    "arbitrumtestnet": {
      "messageIdMultisigIsm": "0x730ca4037BbBA7704f23a9F3af0888f8a4577A4b",
      "merkleRootMultisigIsm": "0x2e8EB32A9E1d6dced2CdDc7fe3ef408a29b3b36B",
      "staticAggregationIsm": "0x0c5E9F9BB207A94018A76DC58A4aB7CE5CD38171"
    },
    "domainRoutingIsm": "0xd9c6415ED929C445a691886AF53D782D77E820cf",
    "merkleTreeHook": "0x4917a9746A7B6E0A57159cCb7F5a6744247f2d0d",
    "protocolFee": "0x13AC3349Cb159fE86A22cf42DdA803D9f7309DB5",
    "customHook": "0x4917a9746A7B6E0A57159cCb7F5a6744247f2d0d",
    "testRecipient": "0x20b6c115Cc2538EE0E8FAE91d1260459e5eE869C",
    "mailbox": "0xfFAEF09B3cd11D9b20d1a19bECca54EEC2884766",
    "proxyAdmin": "0x97Bbc6bBaFa5Ce3b2FA966c121Af63bD09e940f8",
    "validatorAnnounce": "0xE6105C59480a1B7DD3E4f28153aFdbE12F4CfCD9"
````

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

To get started with Scaffold-ETH 2, follow the steps below:

1. Clone this repo & install dependencies

```
git clone https://github.com/scaffold-eth/scaffold-eth-2.git
cd scaffold-eth-2
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

This command starts a local Ethereum network using Hardhat. The network runs on your local machine and can be used for testing and development. You can customize the network configuration in `hardhat.config.ts`.

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

This command deploys a test smart contract to the local network. The contract is located in `packages/hardhat/contracts` and can be modified to suit your needs. The `yarn deploy` command uses the deploy script located in `packages/hardhat/deploy` to deploy the contract to the network. You can also customize the deploy script.

4. On a third terminal, start your NextJS app:

```
yarn start
```

Visit your app on: `http://localhost:3000`. You can interact with your smart contract using the `Debug Contracts` page. You can tweak the app config in `packages/nextjs/scaffold.config.ts`.

Run smart contract test with `yarn hardhat:test`

- Edit your smart contract `YourContract.sol` in `packages/hardhat/contracts`
- Edit your frontend in `packages/nextjs/pages`
- Edit your deployment scripts in `packages/hardhat/deploy`

## Documentation

Visit our [docs](https://docs.scaffoldeth.io) to learn how to start building with Scaffold-ETH 2.

To know more about its features, check out our [website](https://scaffoldeth.io).

## Contributing to Scaffold-ETH 2

We welcome contributions to Scaffold-ETH 2!

Please see [CONTRIBUTING.MD](https://github.com/scaffold-eth/scaffold-eth-2/blob/main/CONTRIBUTING.md) for more information and guidelines for contributing to Scaffold-ETH 2.
