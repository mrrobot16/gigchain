import { expect } from "chai";
import { ethers } from "hardhat";
import {  BigNumber, ContractFactory, Contract } from "ethers";

import { 
  MEMBERS, 
  NEW_MEMBER, 
  RANDOM_ADDRESS, 
  ADDRESS_ZERO,
  PAYROll_TESTS,
} from "../utils/constants";
import { toNumber } from "../utils/numbers";

describe("Organization Contract", function () {
  let OrganizationContract: ContractFactory;
  let organization: Contract;
  let organizationAddress: string;
  let organizationName: string;
  let balance: BigNumber | number;
  let members: string[] = MEMBERS;
  let member: string = MEMBERS[0];
  let newMember: string = NEW_MEMBER;
  let owner: string;
  let signer: string;
  const depositAmount: BigNumber = ethers.utils.parseEther("10");

  this.beforeAll(async () => {
    OrganizationContract = await ethers.getContractFactory("Organization");
    organization = await OrganizationContract.deploy("MyOrganization", members, { value: depositAmount });
    members = await organization.getMembers();
    organizationAddress = organization.address;
    organizationName = await organization.name();
    balance = await organization.getBalance();
    owner = await organization.owner();
    signer = await organization.signer.getAddress();
  });

  describe("Deployment", function () {

    it("Should have the correct owner", async function () {
        expect(owner).to.equal(signer);
    });

    it("Should have deploy an organization", async function () {
        expect(organizationName).to.equal("MyOrganization");
        expect(organizationAddress).to.be.properAddress;
    });

    it("Should have the correct members", async function () {
        // const members = await organization.getMembers();       
        // NOTE: MEMBERS.length + 1 because the deployer is also a member;
        // NOTE: Somecases you may want to exclude the deployer from the members list;        
        expect(members.length).equal(4);
    });

    it("Should have balance of 10 ETH", async function () {
        expect(balance).equal(ethers.utils.parseEther("10"));
    });

    it("Should add a member", async function () {
        await organization.addMember(newMember);
        const updated_members = await organization.getMembers();
        expect(updated_members.length).equal(5);
    });

    it("Should remove a member", async function () {
        await organization.removeMember(MEMBERS[2]);    
        expect(members.length).equal(4);
    });
  });

  describe("Payments", function () {
    it("Should pay a member", async function () {
        const member = newMember;
        const amount = ethers.utils.parseEther("1");
        const balanceBefore = await organization.getBalance();
        await organization.payMember(member, amount);
        const balanceAfter = await organization.getBalance();
        expect(balanceBefore.sub(balanceAfter)).equal(amount);
    });

    it("Should not pay a random address", async function () {
      const amount = ethers.utils.parseEther("1");
      const balanceBefore = await organization.getBalance();
      try {
        await organization.payMember(RANDOM_ADDRESS, amount);
      } catch {
        const getMember = await organization.getMember(RANDOM_ADDRESS);
        const balanceAfter = await organization.getBalance();
        expect(getMember).equal(ADDRESS_ZERO);
        expect(balanceBefore).equal(balanceAfter);
      }
    });

    it("Should pay list of members", async function () {
      const balance = await organization.getBalance();
      const totalPayment = PAYROll_TESTS.PAYMENTS.reduce((a, b) => a.add(b));
      const members = await organization.getMembers();
      expect(balance).to.greaterThanOrEqual(totalPayment);
      await organization.payMembers(PAYROll_TESTS.MEMBERS, PAYROll_TESTS.PAYMENTS);
      const balanceAfter = await organization.getBalance();
      expect(balance.sub(balanceAfter)).equal(totalPayment);
      
    });
  });

});
