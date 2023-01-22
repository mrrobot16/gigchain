// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "hardhat/console.sol";

contract Organization {
    address public owner;
    string public name;
    address[] public members;
    event Transfer(address indexed from, address indexed to, uint256 value);
    event ReceiveEth(address indexed from, uint256 value);

    receive() external payable {
        console.log("Received Ether: %s", msg.value);
        emit ReceiveEth(msg.sender, msg.value);
    }

    constructor(string memory _name, address[] memory _members) payable {
        owner = msg.sender;
        name = _name;
        members = _members;
        addMember(owner);
    }

    function addMember(address _member) public {
        require(msg.sender == owner, "Only the owner can add members");
        members.push(_member);
    }

    function removeMember(address _member) public {
        require(msg.sender == owner, "Only the owner can remove members");
        for (uint i = 0; i < members.length; i++) {
            if (members[i] == _member) {
                members[i] = members[members.length - 1];
                members.pop();
                break;
            }
        }
    }

    function getMembers() public view returns (address[] memory) {
        return members;
    }

    function getMemberCount() public view returns (uint) {
        return members.length;
    }

    function getMember(address member) public view returns (address) {
        for (uint i = 0; i < members.length; i++) {
            if (members[i] == member) {
                return members[i];
            }
        }
        return address(0);
    }

    function payMember(address payable member) public payable {
        require(msg.sender == owner, "Only the owner can pay members");
        require(msg.value > 0, "You must send some Ether");
        require(msg.value <= address(this).balance, "You must send the correct amount of Ether");
        require(getMember(member) != address(0), "Member does not exist");
        bool sent = member.send(msg.value);
        require(sent, "Failed to send Ether");
        emit Transfer(msg.sender, member, msg.value);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function sendViaTransfer(address payable _to) external payable {
        // This function is no longer recommended for sending Ether.
        _to.transfer(msg.value);
    }

    function sendViaSend(address payable _to) public payable {
        // Send returns a boolean value indicating success or failure.
        // This function is not recommended for sending Ether.
        bool sent = _to.send(msg.value);
        require(sent, "Failed to send Ether");
    }

    function sendViaCall(address payable _to) public payable {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent, bytes memory data) = _to.call{value: msg.value}("");
        console.log("data.length: %s", data.length);
        require(sent, "Failed to send Ether");
    }

}