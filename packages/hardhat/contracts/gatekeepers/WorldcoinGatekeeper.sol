// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { SignUpGatekeeper } from "./SignUpGatekeeper.sol";
import { ByteHasher } from "../utilities/ByteHasher.sol";
import { IWorldID } from "../interfaces/IWorldID.sol";

contract WorldcoinGatekeeper is SignUpGatekeeper, Ownable {
	using ByteHasher for bytes;

	address public maci;
	mapping(uint256 => bool) public registeredTokenIds;

	/// @notice Thrown when attempting to reuse a nullifier
	error InvalidNullifier();

	/// @dev The World ID instance that will be used for verifying proofs
	IWorldID internal immutable worldId;

	/// @dev The contract's external nullifier hash
	uint256 internal immutable externalNullifier;

	/// @dev The World ID group ID (always 1)
	uint256 internal immutable groupId = 1;

	/// @dev Whether a nullifier hash has been used already. Used to guarantee an action is only performed once by a single person
	mapping(uint256 => bool) internal nullifierHashes;

	mapping(address => bool) public registeredUsers;

	error InvalidProver();
	error OnlyMACI();

	constructor(
		IWorldID _worldId,
		string memory _appId,
		string memory _actionId
	) payable Ownable() {
		worldId = _worldId;
		externalNullifier = abi
			.encodePacked(abi.encodePacked(_appId).hashToField(), _actionId)
			.hashToField();
	}

	function setMaciInstance(address _maci) public override onlyOwner {
		maci = _maci;
	}
	function register(address _user, bytes memory _data) public override {
		if (maci != msg.sender) revert OnlyMACI();

		(
			address signal,
			uint256 root,
			uint256 nullifierHash,
			uint256[8] memory proof
		) = abi.decode(_data, (address, uint256, uint256, uint256[8]));

		if (_user != signal) {
			revert InvalidProver();
		}

		verifyAndExecute(signal, root, nullifierHash, proof);

		registeredUsers[_user] = true;
	}

	function verifyAndExecute(
		address signal,
		uint256 root,
		uint256 nullifierHash,
		uint256[8] memory proof
	) internal {
		// First, we make sure this person hasn't done this before
		if (nullifierHashes[nullifierHash]) revert InvalidNullifier();

		// We now verify the provided proof is valid and the user is verified by World ID
		worldId.verifyProof(
			root,
			groupId,
			abi.encodePacked(signal).hashToField(),
			nullifierHash,
			externalNullifier,
			proof
		);

		// We now record the user has done this, so they can't do it again (proof of uniqueness)
		nullifierHashes[nullifierHash] = true;

		// Finally, execute your logic here, for example issue a token, NFT, etc...
		// Make sure to emit some kind of event afterwards!
	}
}
