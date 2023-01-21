import { ethers } from "hardhat";

import { MEMBERS } from "../utils/constants";

async function main() {
  const depositAmount = ethers.utils.parseEther("0.0000000002000301");

  const Organization = await ethers.getContractFactory("Organization");
  const organization = await Organization.deploy("MyOrganization", MEMBERS, { value: depositAmount});

  await organization.deployed();
  console.log("Organization deployed to:", organization.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
