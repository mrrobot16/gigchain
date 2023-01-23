import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import dotenv from "dotenv";

dotenv.config()

const { 
  INFURA_ID, 
  GOERLI_PRIVATE_KEY,
  GOERLI_PRIVATE_KEY2, 
  GOERLI_INFURA_URL,
  MAINNET_PRIVATE_KEY,
  MAINNET_INFURA_URL,
} = process.env;


const url = `${GOERLI_INFURA_URL}${INFURA_ID}`;

const accounts = [`0x${GOERLI_PRIVATE_KEY}`];
// NOTE: this private key is for the second account(accounts2) 
// that is not the deployer to test the contract
// const accounts = [`0x${GOERLI_PRIVATE_KEY2}`];

const goerli = {
  url,
  accounts,
}

const networks = {
  goerli,
};

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.17", settings: {} }],
  },
  networks: {
    goerli,
  }
}


export default config;
