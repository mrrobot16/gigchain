// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
// import "hardhat/console.sol";

contract Organization {
    address public owner;
    string public name;
    address[] public members;
    event Transfer(address indexed from, address indexed to, uint256 value);
    event MultiTransfer(address indexed from, address[] indexed to, uint256[] value);
    event ReceiveEth(address indexed from, uint256 value);
    event AddMember(address indexed member);
    event RemoveMember(address indexed member);
    error TransferFailed();

    receive() external payable {
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
        emit AddMember(_member);
    }

    function removeMember(address _member) public {
        require(msg.sender == owner, "Only the owner can remove members");
        for (uint i = 0; i < members.length; i++) {
            if (members[i] == _member) {
                members[i] = members[members.length - 1];
                members.pop();
                emit RemoveMember(_member);
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

    function payMember(address payable _member, uint256 _amount) public payable {
        uint256 balance = address(this).balance;     
        require(msg.sender == owner, "Only the owner can pay members");
        require(_amount > 0, "You must send some Ether");
        require(_amount <= balance, "You must send the correct amount of Ether");
        require(getMember(_member) != address(0), "Member does not exist");
        
        if(_member.send(_amount)) {
           emit Transfer(address(this), _member, _amount);
        } else {
            revert TransferFailed();
        }
        balance = address(this).balance;
    }

    function payMembers(address[] memory _members, uint256[] memory _amounts) public {
        require(msg.sender == owner, "Only the owner can pay members");
        require(_members.length == _amounts.length, "You must send the correct amount of members and amounts");
        for (uint i = 0; i < _members.length; i++) {
            address member = _members[i];
            payMember(payable(member), _amounts[i]);
            emit Transfer(address(this), _members[i], _amounts[i]);
        }
        emit MultiTransfer(address(this), _members, _amounts);
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}