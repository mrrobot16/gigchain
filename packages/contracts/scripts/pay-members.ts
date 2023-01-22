import { ethers } from "hardhat";
import { Contract } from "ethers";
import { PAYROll } from "../utils/constants";

// NOTE: This is the address of the deployed contract
// NOTE: You can get this address from the console after running the deploy script
// TODO: Add a way to get the address through a written file after running the deploy script.
const organizationAddress = "0x3Af846E763872a0bC8B4977Be9Ee0aca957F8884";
// NOTE: Be sure that members variable is are members of the organization 
// else the transaction will fail.

async function main() {
    console.log("Paying members...");
    const OrganizationContract = await ethers.getContractAt('Organization', organizationAddress);
    const tx = await OrganizationContract.payMembers(PAYROll.MEMBERS, PAYROll.PAYMENTS);
    const txResult = await tx.wait();
    console.log('payMembers() txResult', txResult);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
