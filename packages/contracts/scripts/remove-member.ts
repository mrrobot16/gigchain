import { ethers } from "hardhat";
import { NEW_MEMBER, ORGANIZATION_DATA_JSON } from "../utils/constants";

async function main() {
    console.log("Removing member...");
    const OrganizationContract = await ethers.getContractAt('Organization', ORGANIZATION_DATA_JSON.address);
    const tx = await OrganizationContract.removeMember(NEW_MEMBER);
    const txResult = await tx.wait();
    console.log('removeMember() txResult', txResult);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
