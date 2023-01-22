// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "hardhat/console.sol";

contract SendEtherExample {
    uint public balanceReceived;
    event ReceiveEth(address indexed from, uint256 value);

    receive() external payable {
        console.log("Received Ether: %s", msg.value);
        emit ReceiveEth(msg.sender, msg.value);
    }

    function receiveMoney() public payable {
        balanceReceived += msg.value;
    }

    function getBalance() public view returns(uint) {
        return address(this).balance;
    }

    function withdrawMoney(address payable member) public payable {
        // address payable to = payable(member);
        member.transfer(msg.value);
    }
}