import { 
  EthereumWindowProvider,
} from "types"

const ethereum = (window).ethereum as EthereumWindowProvider;
// NOTE: Need to Check if MetaMask is installed and what chain the user is on, at the moment we want to support ETH Mainnet and Goerli.
export async function detectMetamask() {
  try {
    await ethereum.request({ method: "eth_requestAccounts" });
    return true;
  } catch (error) {
    return false;
  }
}