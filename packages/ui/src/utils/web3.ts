import { 
  EthereumWindowProvider,
} from "types"
import {
  ChainId,
  CHAIN_INFO,
  SUPPORTED_CHAINS,
} from "utils/constants"


// NOTE: This ENV variable are set in the .env file
// We are gonna need them once we deploy for production to be sure we are on the right network.
// export const { 
//   REACT_APP_ENVIRONMENT: APP_ENVIRONMENT,
//   REACT_APP_NETWORK: APP_NETWORK,
//   REACT_APP_NETWORK_CHAIN_ID: APP_NETWORK_CHAIN_ID,
// } = process.env;


const ethereum = (window).ethereum as EthereumWindowProvider;

// NOTE: Need to Check if MetaMask is installed 
// what chain the user is on, 
// at the moment we want to support ETH Mainnet and Goerli.
export async function detectMetamask() {
  try {
    await ethereum.request({ method: "eth_requestAccounts" });
    return true;
  } catch (error) {
    return false;
  }
}

export async function detectChain() {
  const chainId = await ethereum.request({ method: "eth_chainId" });  
  try {
    if (SUPPORTED_CHAINS.includes(chainId)) {
      return {
        hasSupportedChain: true,
        ...CHAIN_INFO[chainId as ChainId]
      }
    } else {
      return {
        hasSupportedChain: false,
        id: chainId,
        name: "Unsupported Chain"
      }
    }
  } catch (error) {
    return {
      hasSupportedChain: false,
      chainId,
      error
    };
  }
}

export const detectWeb3 = () => {
  detectMetamask().then(async (hasMetamask: boolean) => {
    if (!hasMetamask) {
      console.log("Metamask is not installed.");
      const ALERT_MESSAGE  = `Please Install MetaMask and connect to the ${'Goerli Network'}`
      alert(ALERT_MESSAGE)
      window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en", "_blank");
    }
    if(hasMetamask) {
      console.log("MetaMask is installed.");
      const detectedChain = await detectChain()
      const { 
        id,
        hasSupportedChain,
        // name,
      } = detectedChain;
      const ALERT_MESSAGE = `
        We are sorry at the moment we do not support chainId ${id}:
        Please switch your wallet network on of the following chains: Ethereum Mainnet, Ethereum Goerli, Mumbai, and Matic.
      `
  
      if(!hasSupportedChain) {
        console.log("MetaMask is at not supported chain")
        alert(ALERT_MESSAGE);
      } else {
        console.log("MetaMask is at a supported chain  ")
      }
    }
  });
};