import { ethers } from "hardhat";
import { Contract, ContractInterface } from "ethers";
import { MEMBERS } from "../utils/constants";

const organizationAddress = "0xC7F734730e5cb1488B4BaF1dfA53cc722F3B6477";
const member = "0x5Db06acd673531218B10430bA6dE9b69913Ad545";
// const member = MEMBERS[1];
// const randomPaymentReceiverAddress = "0x3D694A1C605e014b195FaA913e090e4BB9544FE3";
async function main() {
    console.log("Paying members...");

    // const Organization = await ethers.getContractFactory
    const OrganizationContract = await ethers.getContractAt('Organization', organizationAddress);
    // console.log('OrganizationContract.functions', OrganizationContract.functions);
    const owner = await OrganizationContract.owner();
    // console.log('OrganizationContract.owner', owner);
    const balance = await OrganizationContract.getBalance();
    // console.log('OrganizationContract.balance', ethers.utils.formatEther(balance));
    const members = await OrganizationContract.getMembers();
    // console.log('OrganizationContract.members', members);
    const payAmount = ethers.utils.parseEther("0.000001742301");
    // const tx = await OrganizationContract.payMember(member, { value: payAmount });
    const tx = await OrganizationContract.sendViaTransfer(member, { value: payAmount });
    // console.log('tx', tx);
    const result = await tx.wait();
    console.log('result', result);

  //   function sendViaTransfer(address payable _to) public payable {
  //     // This function is no longer recommended for sending Ether.
  //     _to.transfer(msg.value);
  // }

  // function sendViaSend(address payable _to) public payable {
  //     // Send returns a boolean value indicating success or failure.
  //     // This function is not recommended for sending Ether.
  //     bool sent = _to.send(msg.value);
  //     require(sent, "Failed to send Ether");
  // }

  // function sendViaCall(address payable _to) public payable {
  //     // Call returns a boolean value indicating success or failure.
  //     // This is the current recommended method to use.
  //     (bool sent, bytes memory data) = _to.call{value: msg.value}("");
  //     require(sent, "Failed to send Ether");
  // }
    // const tx = await OrganizationContract.payMembers(payAmount);
    // const OrganizationContract = await new Contract(organizationAddress, new ContractInterface(), ethers.provider);
//   const depositAmount = ethers.utils.parseEther("0.0000000002000301");

//   const Organization = await ethers.getContractFactory("Organization");
//   const organization = await Organization.deploy("MyOrganization", MEMBERS, { value: depositAmount});

//   await organization.deployed();
//   console.log("Organization deployed to:", organization.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
