// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./MACI.sol";
import { Params } from "./utilities/Params.sol";
import { DomainObjs } from "./utilities/DomainObjs.sol";

contract PollManager is Ownable, Params, DomainObjs {
	struct PollContracts {
		address poll;
		address messageProcessor;
		address tally;
		address subsidy;
	}

	struct PollData {
		string name;
		string[25] options;
		string ipfsHash;
		address creator;
		PollContracts pollContracts;
		uint256 endTime;
	}

	uint256 public fees;

	mapping(uint256 => PollData) public polls;
	uint256 public totalPolls;
	uint256 public duration;

	MACI public maci;

	TreeDepths public treeDepths;
	PubKey public coordinatorPubKey;
	address public verifier;
	address public vkRegistry;
	bool public useSubsidy;

	constructor(MACI _maci) {
		fees = 0.01 ether;
		maci = _maci;
		duration = 600;
	}

	function setFees(uint256 _fees) public onlyOwner {
		fees = _fees;
	}

	function setNewVotingTime(uint256 _duration) public onlyOwner {
		duration = _duration;
	}

	function setConfig(
		TreeDepths memory _treeDepths,
		PubKey memory _coordinatorPubKey,
		address _verifier,
		address _vkRegistry,
		bool _useSubsidy
	) public onlyOwner {
		treeDepths = _treeDepths;
		coordinatorPubKey = _coordinatorPubKey;
		verifier = _verifier;
		vkRegistry = _vkRegistry;
		useSubsidy = _useSubsidy;
	}

	function createPoll(
		string calldata _name,
		string[25] calldata _options,
		string calldata _ipfsHash
	) public payable {
		require(msg.value == fees, "incorrect fees sent");

		MACI.PollContracts memory c = maci.deployPoll(
			duration,
			treeDepths,
			coordinatorPubKey,
			verifier,
			vkRegistry,
			useSubsidy
		);

		// create poll
		polls[++totalPolls] = PollData({
			name: _name,
			options: _options,
			ipfsHash: _ipfsHash,
			creator: msg.sender,
			endTime: block.timestamp + duration,
			pollContracts: PollContracts({
				poll: c.poll,
				messageProcessor: c.messageProcessor,
				tally: c.tally,
				subsidy: c.subsidy
			})
		});
	}
}
