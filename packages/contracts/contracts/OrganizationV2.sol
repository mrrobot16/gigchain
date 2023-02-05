// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "hardhat/console.sol";

struct Member {
    address account;
    uint256 balance;
    bool exists;
    bool active; // This could be useful to check if a member is active or not to determine if should be paid.
}

contract OrganizationV2 {
    address public owner;
    address public controller;
    string public name;
    address[] public members;
    address[] public membersAccountsV2;
    uint256 public memberCount;
    mapping(address => Member) public membersV2;
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
        controller = msg.sender;
        name = _name;
        addMembersV2(_members);
        addMemberV2(controller);
    }

    function addMembersV2(address[] memory _members) public onlyController("addMembers") {
        for (uint i = 0; i < _members.length; i++) {
            addMemberV2(_members[i]);
        }
    }

    function addMemberV2(address account) public onlyController("addMemberV2") {
        require(!membersV2[account].exists, "Member already exists");
        Member memory member = Member(account, 0, true, true);
        membersV2[account] = member;
        membersAccountsV2.push(account);
        memberCount++;
        emit AddMember(membersV2[account].account);
    }

    function removeMemberV2(address account) public onlyController("removeMemberV2") {
        require(membersV2[account].exists, "Member does not exist");
        membersV2[account].exists = false;
        delete(membersV2[account]);
        memberCount--;
        for (uint i = 0; i < membersAccountsV2.length; i++) {
            if (membersAccountsV2[i] == account) {
                membersAccountsV2[i] = membersAccountsV2[membersAccountsV2.length - 1];
                membersAccountsV2.pop();
                emit RemoveMember(account);
                break;
            }
        }
    }

    function payMemberV2(address payable _member, uint256 _amount) public {
        require(msg.sender == controller, "You must be the controller to pay members");
        require(_amount > 0, "You must send ether to pay members");
        require(membersV2[_member].exists, "Member does not exist");  
        if(_member.send(_amount)) {
           emit Transfer(address(this), _member, _amount);
        } else {
            revert TransferFailed();
        }
    }

    function payMember(address payable _member, uint256 _amount)
        public payable
        onlyController("payMember") 
        correctAmount(_amount)
        memberMustExist(_member)  
        mustSendEther(_amount)
    {
        uint256 balance = address(this).balance;     
        if(_member.send(_amount)) {
           emit Transfer(address(this), _member, _amount);
        } else {
            revert TransferFailed();
        }
        balance = address(this).balance;
    }

    function payMembers(address[] memory _members, uint256[] memory _amounts) public onlyController("payMembers") {
        // TODO: Need to refactor this to use array of objects with address and amount.
        // TODO: Need to refactor this to use a mapping of address to amount.
        require(_members.length == _amounts.length, "You must send the correct amount of members and amounts");
        for (uint i = 0; i < _members.length; i++) {
            address payable member = payable(_members[i]);
            payMember(member, _amounts[i]);
            emit Transfer(address(this), _members[i], _amounts[i]);
        }
    // TODO: Need to emit an event with the array of members and amounts.
        emit MultiTransfer(address(this), _members, _amounts);
    }

    function getMembersV2()
        public 
        view
        returns (Member[] memory)
    {
        Member[] memory membersArray = new Member[](memberCount);
        uint256 index = 0;
        for (uint i = 0; i < membersAccountsV2.length; i++) {
            if (membersV2[membersAccountsV2[i]].exists) {
                membersArray[index] = membersV2[membersAccountsV2[i]];
                index++;
            }
        }
        return membersArray;
    } 
    
    function getMembers() public view returns (address[] memory) {
        return membersAccountsV2;
    }

    function getMemberCountV2() public view returns (uint256) {
        return memberCount;
    }

    function getMemberV2(address account) public view returns (Member memory) {
        return membersV2[account];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function transferControllership(address newController) public onlyOwner("transferControllership") {
        controller = newController;
    }

    modifier onlyOwner(string memory functionName) {
        string memory message = string(abi.encodePacked("Only the owner can call: ", functionName));
        require(msg.sender == owner, message);
        _;
    }
    
    
    modifier memberMustExist(address _member) {
        require(getMemberV2(_member).account != address(0), "Member does not exist");
        _;
    }

    modifier mustSendEther(uint _amount) {
        require(_amount > 0, "You must send some Ether");
        _;
    }

    modifier correctAmount(uint _amount) {
        uint256 balance = address(this).balance;
        require(_amount <= balance, "You must send the correct amount of Ether");
        _;
    }

    modifier correctAmounts(uint256[] memory _amounts) {
        uint256 total = 0;
        for (uint i = 0; i < _amounts.length; i++) {
            total += _amounts[i];
        }
        require(total <= address(this).balance, "You must send the correct amount of Ether");
        _;
    }

    modifier onlyController(string memory functionName) {
        string memory message = string(abi.encodePacked("Only the controller can call: ", functionName));
        require(msg.sender == controller, message);
        _;
    }
}