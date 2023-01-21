import { ethers } from "hardhat";
import { BigNumber } from "ethers";

export function toNumber(number: BigNumber) {
  const formattedEther = ethers.utils.formatEther(number);
  return Number(formattedEther);
}