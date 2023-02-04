// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
// import "hardhat/console.sol";

struct Member {
    address account;
    uint256 balance;
    bool exists;
    // bool active; // This could be useful to check if a member is active or not to determine if should be paid.
}

struct Payment { 
    address payable to;
    uint256 amount;
}

contract OrganizationV1 {
    address public owner;
    string public name;
    address public controller;
    mapping(address => Member) public membersV1;
    uint256 public memberCount;
    event AddMemberV1(address indexed member);
    event MultiTransfer(address indexed from, address[] indexed to, uint256[] value);
    event Transfer(address indexed from, address indexed to, uint256 value);
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
        controller = msg.sender;
        addMembersV1(_members);
        // For now we always want the signer to be a member and the owner of an Organization.
        addMemberV1(owner);
    }

    function addMemberV1(address account) public onlyController("addMemberV2") {
        require(!membersV1[account].exists, "Member already exists");
        Member memory member = Member(account, 0, true, true);
        membersV1[account] = member;
        memberCount++;
        emit AddMemberV1(membersV1[account].account);
    }

    function addMembersV1(address[] memory _members) public onlyController("addMembers") {
        for (uint i = 0; i < _members.length; i++) {
            addMemberV1(_members[i]);
            emit AddMemberV1(membersV1[_members[i]].account);
        }
    }

    function removeMemberV1(address _member) public onlyController("removeMember") memberMustExist(_member) {
        delete(membersV1[_member]);
    }

    function getMemberV1(address account) public view returns (Member memory) {
        if(membersV1[account].account == account) {
            return membersV1[account];
        }
        return Member(address(0), 0, false, false);
    }

    function getMemberCount() public view returns (uint256) {
        return memberCount;
    }

    function payMember(Payment calldata payment) 
        public payable 
        onlyController("payMemberV1")
        memberMustExist(payment.to)
        organizationHasFundsForPayment(payment.amount)
    {
        if(payment.to.send(payment.amount)) {
            emit Transfer(address(this), payment.to, payment.amount);
        } else {
            revert TransferFailed();
        }
    }

    function payMembers(Payment[] calldata payments) 
        public 
        onlyController("payMembersV1")
        organizationHasFundsForPayments(payments)
    {
        address[] memory payees;
        uint256[] memory amounts;
        for (uint i = 0; i < payments.length; i++) {
            amounts[i] = payments[i].amount;
            payees[i] = payments[i].to;
            payMember(payments[i]);
        }
        emit MultiTransfer(address(this), payees, amounts);
    }

    function transferControllership(address newController) public onlyController("transferControllership") {
        controller = newController;
    }

    modifier onlyController(string memory functionName) {
        string memory message = string(abi.encodePacked("Only the controller can call: ", functionName));
        require(msg.sender == controller, message);
        _;
    }
    modifier memberMustExist(address _member) {
        Member memory member = getMemberV1(_member);
        require(member.account != address(0) && member.exists, "Member does not exist");
        _;
    }

    modifier organizationHasFundsForPayment(uint _amount) {
        uint256 balance = address(this).balance;
        require(_amount <= address(this).balance, "The amount payment should alway be less than balance");
        _;
    }

    modifier organizationHasFundsForPayments(Payment[] memory payments) {
        uint256 balance = address(this).balance;
        uint256 total = 0;
        for (uint i = 0; i < payments.length; i++) {
            total += payments[i].amount;
        }
        require(total <= balance, "The total payment amount should alway be less than balance");
        _;
    }

    modifier onlyOwner(string memory functionName) {
        string memory message = string(abi.encodePacked("Only the owner can call: ", functionName));
        require(msg.sender == owner, message);
        _;
    }
}