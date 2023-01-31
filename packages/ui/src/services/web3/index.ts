import { Signer, ContractFactory, ethers, BigNumber, providers } from 'ethers';
import OrganizationABI from 'services/web3/abis/Organization.json';

import { Member, Ethereum } from 'types';

const { REACT_APP_NETWORK: NETWORK } = process.env;

const ethereum = (window).ethereum as Ethereum;

export class Web3 {
  private static _instance: Web3;
  private static initialized = false;
  private signer: providers.JsonRpcProvider | Signer | undefined = new providers.JsonRpcProvider();
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
    const provider = new ethers.providers.Web3Provider(ethereum as providers.ExternalProvider);
    this.signer = provider.getSigner();
  }

  public async deployOrgContract(
    name: string, 
    members: string[] | Member[], 
    depositAmount = 0.0001888, 
    callback?: (address: string) => void,
  ) {
    console.log('Deploying Org Contract... please confirm transaction in MetaMask.');
    const contract  = new ContractFactory(OrganizationABI.abi, OrganizationABI.bytecode, this.signer as Signer);
    const txConfig = {
      value: ethers.utils.parseEther(depositAmount.toString())
    };
    let deployedOrgContract;
    if(ethereum?.selectedAddress != null) {
      try {
        deployedOrgContract = await contract.deploy(
          name, 
          members, 
          txConfig
        );
      } catch (error: unknown) {
        throw new Error('Possible RPC Error: Metamask Tx Signature: User denied transaction signature');
      }
    } else {
      await ethereum?.enable();
      deployedOrgContract = await contract.deploy(
        name, 
        members, 
        txConfig
      );
    }

    const deployed = await deployedOrgContract?.deployed();
    console.log('Contract deployed successfully at address : ', deployed?.address);
    const receipt = await deployedOrgContract?.deployTransaction.wait();
    console.log('Contract mined successfully at block: ', receipt?.blockNumber);
    const deployedOrgContractAddress = deployed?.address
    const contractUrl = `https://${NETWORK}.etherscan.io/address/${deployedOrgContract?.address}`;
    window.open(contractUrl, '_blank');
    callback != undefined ? callback(deployedOrgContractAddress as string) : null;
  }

  public async getOrgMembers(orgContractAddress: string) {
    console.log('Getting Org Members...');
    const contract = new ethers.Contract(orgContractAddress, OrganizationABI.abi, this.signer);    
    if(ethereum?.selectedAddress != null) {
      try {
        const members = await contract.getMembers();
        return members;
      } catch (error) {
        console.log('Error getting org members: ', error);
        return [];
      }
    } else {
      await ethereum?.enable();
      const members = await contract.getMembers();
      return members;
    }
  }

  public async getOrgBalance(orgContractAddress: string) {
    console.log('Getting Org Balance...');
    try {
      const contract = new ethers.Contract(orgContractAddress, OrganizationABI.abi, this.signer);
      const balance = await contract.getBalance();
      return balance;
    } catch (error) {
      return 0;
    }
  }

  public async payOrgMember(orgContractAddress: string, member: string, amount: BigNumber | number | string) {
    console.log(`Pay Org Member: ${member} amount: ${amount}`);
    const contract = new ethers.Contract(orgContractAddress, OrganizationABI.abi, this.signer);
    const tx = await contract.payMember(member, amount, { gasLimit: 1000000 });
    return tx;
  }

  public async payOrgMembers(orgContractAddress: string, members: string[], amounts: BigNumber[] | number[] | string[] | undefined) {
    console.log(`Pay Org Members: ${members} amount: ${amounts}`);
    const contract = new ethers.Contract(orgContractAddress, OrganizationABI.abi, this.signer);
    const tx = await contract.payMembers(members, amounts, { gasLimit: 1000000 });
    return tx;
  }
}