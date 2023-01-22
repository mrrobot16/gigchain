import { ethers } from "hardhat";

// import { MEMBERS } from "../utils/constants";

async function main() {
  const depositAmount = ethers.utils.parseEther("0.00016190");

  const SendEtherExample = await ethers.getContractFactory("SendEtherExample");
//   const sendEtherExample = await SendEtherExample.deploy({ value: depositAmount});
  const sendEtherExample = await SendEtherExample.deploy();
  await sendEtherExample.deployed();
  console.log("SendEtherExample deployed to:", sendEtherExample.address);
  await sendEtherExample.receiveMoney({ value: depositAmount});
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
