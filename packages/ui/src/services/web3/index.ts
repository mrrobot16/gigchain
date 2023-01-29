import { Signer, ContractFactory, ethers, BigNumber } from 'ethers';
import OrganizationABI from 'services/web3/abis/Organization.json';

import { Member } from 'types';

const { REACT_APP_NETWORK: NETWORK } = process.env;

export class Web3 {
  private static _instance: Web3;
  private static initialized = false;
  public static async getInstance(): Promise<Web3> {
    if (!this.initialized) {
      const instance = new Web3();
      await instance.initialize();
      this._instance = instance;
      console.log('Web3 service instance has been initialized...');
    }
    return this._instance;
  }

  private async initialize() {
    Web3.initialized = true;
  }

  public async deployOrgContract(
    name: string, 
    members: string[] | Member[], 
    signer: Signer, 
    depositAmount = 0.0001888, 
    callback?: (address: string) => void,
  ) {
    console.log('Deploying Org Contract... please confirm transaction in MetaMask.');
    const contract  = new ContractFactory(OrganizationABI.abi, OrganizationABI.bytecode, signer);
    const txConfig = {
      value: ethers.utils.parseEther(depositAmount.toString())
    };
    const deployedOrgContract = await contract.deploy(
      name, 
      members, 
      txConfig
    );

    const deployedOrgContractAddress = deployedOrgContract.address
    console.log("Contract deployed successfully: ");
    console.log("Contract address: ", deployedOrgContractAddress);
    // console.log('deployedOrgContract', deployedOrgContract);
    
    const contractUrl = `https://${NETWORK}.etherscan.io/address/${deployedOrgContract.address}`;
    window.open(contractUrl, '_blank');
    callback != undefined ? callback(deployedOrgContractAddress) : null;
  }

  public async getOrgMembers(orgContractAddress: string) {
    console.log('Getting Org Members...');
    
    const contract = new ethers.Contract(orgContractAddress, OrganizationABI.abi);
    const members = await contract.getMembers();
    
    return members;
  }

  public async payOrgMember(orgContractAddress: string, member: string, amount: BigNumber | number | string, signer: Signer) {
    console.log(`Pay Org Member: ${member} amount: ${amount}`);

    
    const contract = new ethers.Contract(orgContractAddress, OrganizationABI.abi, signer);
    console.log('contract', contract);
    
    const tx = await contract.payMember(member, amount, { gasLimit: 1000000 });
    
    return tx;
  }
}