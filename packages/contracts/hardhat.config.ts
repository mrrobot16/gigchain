import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import dotenv from "dotenv";

dotenv.config()

const { 
  INFURA_ID, 
  GOERLI_PRIVATE_KEY,
  GOERLI_INFURA_URL,
} = process.env;

// Make sure to have your own .env file with the following variables:
// console.log("INFURA_ID", INFURA_ID);
// console.log("GOERLI_PRIVATE_KEY", GOERLI_PRIVATE_KEY);
// console.log("GOERLI_INFURA_URL", GOERLI_INFURA_URL);

const url = `${GOERLI_INFURA_URL}${INFURA_ID}`;

const accounts = [`0x${GOERLI_PRIVATE_KEY}`];

const goerli = {
  url,
  accounts,
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.17", settings: {} }],
  },
  networks: {
    goerli,
  }
}


export default config;
