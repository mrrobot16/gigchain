import { ethers } from "hardhat";
import { Contract, ContractInterface } from "ethers";
// import { MEMBERS } from "../utils/constants";

// const sendEtherExampleAddress = "0xC7F734730e5cb1488B4BaF1dfA53cc722F3B6477";
// const sendEtherExampleAddress = "0x187D7Fd937f304d97c35357627a835A216F6aa34";
const sendEtherExampleAddress = "0xa6E332D0b7196D3D6AC045af43F308b68e130dBA";
const member = "0x5Db06acd673531218B10430bA6dE9b69913Ad545";
// const member = MEMBERS[1];
// const randomPaymentReceiverAddress = "0x3D694A1C605e014b195FaA913e090e4BB9544FE3";
async function main() {
    console.log("SendEtherExample Paying members...");
    const SendEtherExampleContract = await ethers.getContractAt('SendEtherExample', sendEtherExampleAddress);
    const payAmount = ethers.utils.parseEther("0.00006190");
    // const withdraw = await SendEtherExampleContract.withdraw(randomPaymentReceiver, { value: payAmount });
    const withdraw = await SendEtherExampleContract.withdrawMoney(member, { value: payAmount, gasLimit: 1000000 });
    const tx = await withdraw.wait();
    console.log('tx', tx);
    // const result = await tx.wait();
    // console.log('result', result);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
