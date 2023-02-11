import { Signer, ContractFactory, ethers, BigNumber, providers, Contract } from 'ethers';

import OrganizationABI from 'services/web3/abis/OrganizationV1.json';
import { Member, EthereumWindowProvider, Payment } from 'types';
import { convertMembersArrayToArrayOfObject, encodePayments } from 'utils';

const { REACT_APP_NETWORK: NETWORK } = process.env;

const ethereum = (window).ethereum as (providers.ExternalProvider & EthereumWindowProvider);

export class Web3 {
  private static _instance: Web3;
  private static initialized = false;
  private signer: providers.JsonRpcProvider | Signer | undefined = new providers.JsonRpcProvider();
  private contract: Contract = new Contract("", OrganizationABI.abi, this.signer);
  public static async getInstance(address: string | null = null): Promise<Web3> {
    if (!this.initialized) {
      const instance = new Web3();
      await instance.initialize(address);
      this._instance = instance;
      console.log('Web3 service instance has been initialized...');
    }
    return this._instance;
  }

  private async initialize(address: string | null = null) {
    Web3.initialized = true;
    try {
      const provider = new ethers.providers.Web3Provider(ethereum as providers.ExternalProvider);
      this.signer = provider.getSigner();
      if(address != null) {
        this.contract = new Contract(address as string, OrganizationABI.abi, this.signer);
      }
    } catch (error) {
      throw 'Web3.initialize() error: ' + error;
    }
  }

  public async deployOrgContractV1(
    name: string, 
    members: string[] | Member[], 
    depositAmount = 0.0001888
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
    const contractExplorerUrl = `https://${NETWORK}.etherscan.io/address/${deployedOrgContract?.address}`;

    return {
      address: deployedOrgContractAddress,
      url: contractExplorerUrl,
      deployed,
      receipt
    }
    // window.open(contractUrl, '_blank');
    // callback != undefined ? callback(deployedOrgContractAddress as string) : null;
  }

  public async getOrgMembersV1() {
    console.log('Getting Org Members...');
    if(ethereum?.selectedAddress != null) {
      try {
        const members = await this.contract.getMembers();
        return convertMembersArrayToArrayOfObject(members);
      } catch (error) {
        console.log('Error getting org members: ', error);
        return [];
      }
    } else {
      await ethereum?.enable();
      const members = await this.contract.getMembers();
      return convertMembersArrayToArrayOfObject(members);
    }
  }

  public async getOrgBalanceV1() {
    console.log('Getting Org Balance...');
    try {
      const balance = await this.contract.getBalance();
      return balance;
    } catch (error) {
      return 0;
    }
  }

  public async payOrgMemberV1(member: string, amount: BigNumber | number | string) {
    console.log(`Pay Org Member: ${member} amount: ${amount}`);
    const tx = await this.contract.payMember(member, amount, { gasLimit: 1000000 });
    return tx;
  }

  public async payOrgMembersV1(payments: Payment[]) {
    console.log(`PayOrgMembers Payments: `, payments);
    const tx = await this.contract.payMembers(encodePayments(payments), { gasLimit: 1000000 });
    return tx;
  }

  public async addOrgMemberV1(member: string) {
    console.log(`Add Org Member: ${member}`);
    const tx = await this.contract.addMember(member, { gasLimit: 1000000 });
    return tx;
  }

  public async removeOrgMemberV1(member: string) {
    console.log(`Remove Org Member: ${member}`);
    const tx = await this.contract.removeMember(member, { gasLimit: 1000000 });
    return tx;
  }
}