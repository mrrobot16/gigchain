// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
// import "hardhat/console.sol";

struct Member {
    address account;
    uint256 balance;
    bool exists;
    bool active; // This could be useful to check if a member is active or not to determine if should be paid.
}

struct Payment {
    address to;
    uint256 amount;
    uint256 timestamp;
}

contract OrganizationV1 {
    address public owner;
    address public controller;
    string public name;
    address[] public membersAccounts;
    uint256 public memberCount;
    mapping(address => Member) public members;
    Payment[] public payments;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event MultiTransfer(address indexed from, address[] indexed to, uint256 value);
    event ReceiveEth(address indexed from, uint256 value);
    event AddMember(address indexed member);
    event RemoveMember(address indexed member);
    error TransferFailed();
    error NotEnoughEtherBalance();

    receive() external payable {
        emit ReceiveEth(msg.sender, msg.value);
    }

    constructor(string memory _name, address[] memory _members) payable {
        owner = msg.sender;
        controller = msg.sender;
        name = _name;
        addMembers(_members);
        addMember(controller);
    }

    function addMembers(address[] memory _members) public onlyController("addMembers") {
        for (uint i = 0; i < _members.length; i++) {
            addMember(_members[i]);
        }
    }

    function addMember(address account) 
        public 
        onlyController("addMember") 
        mustNotExistMember(account)
    {
        Member memory member = Member(account, 0, true, true);
        members[account] = member;
        membersAccounts.push(account);
        memberCount++;
        emit AddMember(members[account].account);
    }

    function removeMember(address account) 
        public 
        onlyController("removeMember")
        mustExistMember(account)
    {
        members[account].exists = false;
        delete(members[account]);
        memberCount--;
        for (uint i = 0; i < membersAccounts.length; i++) {
            if (membersAccounts[i] == account) {
                membersAccounts[i] = membersAccounts[membersAccounts.length - 1];
                membersAccounts.pop();
                emit RemoveMember(account);
                break;
            }
        }
    }

    function payMember(address payable _member, uint256 _amount) 
        public 
        onlyController("payMember") 
        mustSendEther(_amount)
        correctAmount(_amount)
        mustExistMember(_member) 
    {
        if(_member.send(_amount)) {
           emit Transfer(address(this), _member, _amount);
        } else {
            revert TransferFailed();
        }
    }

    function payMembers(bytes memory _payments) 
        public
        onlyController("payMembers")
    {
        (bytes[] memory decoded) = abi.decode(_payments, (bytes[])); // This should a Payment[] struct instead of bytes[]. :/ 
        uint256 totalPayment = 0;
        address[] memory payees = new address[](decoded.length);

        for (uint i = 0; i < decoded.length; i++) {
            (address to, uint256 amount) = abi.decode(decoded[i], (address, uint256));
            totalPayment += amount;
            if(address(this).balance < totalPayment) revert NotEnoughEtherBalance();
            Payment memory payment = Payment(to, amount, block.timestamp);
            payments.push(payment);
            payees[i] = to;
            payMember(payable(to), amount);
        }
        emit MultiTransfer(address(this), payees, totalPayment);
    }

    function getMembers()
        public 
        view
        returns (Member[] memory)
    {
        Member[] memory membersArray = new Member[](memberCount);
        uint256 index = 0;
        for (uint i = 0; i < membersArray.length; i++) {
            if (members[membersAccounts[i]].exists) {
                membersArray[index] = members[membersAccounts[i]];
                index++;
            }
        }
        return membersArray;
    }

    function getMemberCount() public view returns (uint256) {
        return memberCount;
    }

    function getMember(address account) public view returns (Member memory) {
        return members[account];
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function transferControllership(address newController) public onlyOwner("transferControllership") {
        controller = newController;
    }


    
    modifier mustExistMember(address _member) {
        require(members[_member].exists == true, "Member does not exist");
        _;
    }

    modifier mustNotExistMember(address account) {
        require(members[account].exists == false, "Member already exists");
        _;
    }
    
    modifier memberMustExist(address _member) {
        require(getMember(_member).account != address(0), "Member does not exist");
        _;
    }

    modifier onlyOwner(string memory functionName) {
        string memory message = string(abi.encodePacked("Only the owner can call: ", functionName));
        require(msg.sender == owner, message);
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