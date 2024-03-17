// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import { IMailbox } from "../interfaces/IMailbox.sol";

contract HyperlaneReceiver is Ownable {
	uint32 public origin;
	bytes32 public sender;
	bytes public latestReceivedMessage;
	address public mailbox;
	address public receiver;
	bytes32 public latestSentMessageID;

	constructor(address _mailbox, address _receiver) {
		mailbox = _mailbox;
		receiver = _receiver;
	}

	function bridgeWorldcoinID(
		string memory _merkleTreeRoot
	) public payable onlyOwner {
		IMailbox hyperMailbox = IMailbox(mailbox);
		bytes32 messageId = hyperMailbox.dispatch{ value: msg.value }(
			80001,
			addressToBytes32(receiver),
			bytes(_merkleTreeRoot)
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
		latestReceivedMessage = _message;
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
