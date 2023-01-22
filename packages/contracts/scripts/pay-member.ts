import { ethers } from "hardhat";
import { Contract, ContractInterface } from "ethers";
import { MEMBERS } from "../utils/constants";

// NOTE: This is the address of the deployed contract
// NOTE: You can get this address from the console after running the deploy script
// TODO: Add a way to get the address through a written file after running the deploy script.
const organizationAddress = "0x3Af846E763872a0bC8B4977Be9Ee0aca957F8884";
// NOTE: Be sure that member variable is a member of the organization else the transaction will fail.
const member = MEMBERS[0];
const amount = ethers.utils.parseEther("0.000001234567");
async function main() {
    console.log("Paying member...");
    const OrganizationContract = await ethers.getContractAt('Organization', organizationAddress);
    const tx = await OrganizationContract.payMember(member, amount);
    const txResult = await tx.wait();
    console.log('payMember() txResult', txResult);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
