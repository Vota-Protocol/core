// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import { IMailbox } from "../interfaces/IMailbox.sol";
import { IWorldIDIdentityManager } from "../interfaces/IWorldIDIdentityManager.sol";
import { IWorldID } from "../interfaces/IWorldID.sol";
import { ByteHasher } from "../utilities/ByteHasher.sol";

contract HyperlaneWorldcoinBridging is
	Ownable,
	IWorldIDIdentityManager,
	IWorldID
{
	using ByteHasher for bytes;

	mapping(uint256 => bool) public registeredTokenIds;

	/// @notice Thrown when attempting to reuse a nullifier
	error InvalidNullifier();

	/// @dev The World ID instance that will be used for verifying proofs
	IWorldID internal immutable worldId;

	/// @dev The contract's external nullifier hash
	uint256 internal immutable externalNullifier;

	/// @dev The World ID group ID (always 1)
	// uint256 internal immutable groupId = 1;

	/// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
	mapping(uint256 => bool) internal nullifierHashes;

	error InvalidProver();

	// @dev Config for the HyperlaneWorldcoinBridging
	uint32 public destinationChain; // 80001 for Polygon Mumbai
	IWorldIDIdentityManager public identityManager; // https://docs.worldcoin.org/reference/address-book
	address public mailbox; // https://docs.hyperlane.xyz/docs/reference/contract-addresses
	address public receiver;
	// ToDo delete below this line
	uint32 public origin;
	bytes32 public sender;
	// ToDo delete above this line
	uint256 public latestReceivedMessage;
	bytes32 public latestSentMessageID;
	uint256 public receivedTime;

	constructor(
		address _mailbox,
		address _receiver,
		address _identityManager,
		uint32 _destinationChain,
		IWorldID _worldId,
		string memory _appId,
		string memory _actionId
	) {
		mailbox = _mailbox;
		receiver = _receiver;
		identityManager = IWorldIDIdentityManager(_identityManager);
		destinationChain = _destinationChain;
		worldId = _worldId;
		externalNullifier = abi
			.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
			.hashToField();
	}

	function verifyProof(
		uint256 root,
		uint256 groupId,
		uint256 signalHash,
		uint256 nullifierHash,
		uint256 externalNullifierHash,
		uint256[8] calldata proof
	) public view {
		// Check Uniqueness
		if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

		// Verify User has a valid World ID
		worldId.verifyProof(
			root,
			groupId, // set to "1" in the constructor
			abi.encodePacked(signalHash).hashToField(),
			nullifierHash,
			externalNullifier,
			proof
		);

		// nullifierHashes[nullifierHash] = true;
	}

	function latestRoot() external view returns (uint256) {
		return latestReceivedMessage;
	}

	function bridgeWorldcoinID() public payable onlyOwner {
		uint256 _merkleTreeRoot = identityManager.latestRoot();
		IMailbox hyperMailbox = IMailbox(mailbox);
		bytes32 messageId = hyperMailbox.dispatch{ value: msg.value }(
			destinationChain,
			addressToBytes32(receiver),
			abi.encodePacked(_merkleTreeRoot)
		);
		latestSentMessageID = messageId;
	}

	function handle(
		uint32 _origin,
		bytes32 _sender,
		bytes calldata _message
	) public onlyMailbox {
		origin = _origin;
		sender = _sender;
		uint256 decodedValue = abi.decode(_message, (uint256));
		latestReceivedMessage = decodedValue;
		receivedTime = block.timestamp;
	}

	function addressToBytes32(address _addr) internal pure returns (bytes32) {
		return bytes32(uint256(uint160(_addr)));
	}

	modifier onlyMailbox() {
		require(
			msg.sender == address(mailbox),
			"MailboxClient: sender not mailbox"
		);
		_;
	}
}
