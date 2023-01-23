import { ethers } from "hardhat";

import { MEMBERS, HARDHAT_NETWORK, ORGANIZATION_NAME, ORGANIZATION_CONTRACT, ORGANIZATION_DEPOSIT, ORGANIZATION_CONTRACT_FILE_PATH } from "../utils/constants";
import { writeJSONFile } from "../utils/files";

async function main() {
  const depositAmount = ORGANIZATION_DEPOSIT
  const Organization = await ethers.getContractFactory(ORGANIZATION_CONTRACT);
  const organization = await Organization.deploy(ORGANIZATION_NAME, MEMBERS.slice(0, MEMBERS.length -1), { value: depositAmount});

  await organization.deployed();
  console.log("Organization deployed to:", organization.address);

  // const filePath = `scripts/deployments/${HARDHAT_NETWORK}/organization.json`;
  const filePath = ORGANIZATION_CONTRACT_FILE_PATH;
  const fileData = {
    organizationName: ORGANIZATION_NAME,
    network: HARDHAT_NETWORK,
    address: organization.address,
    etherscan_url: `https://${HARDHAT_NETWORK}.etherscan.io/address/${organization.address}`,
  }
  writeJSONFile(filePath, fileData);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
