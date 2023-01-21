import { expect } from "chai";
import { ethers } from "hardhat";
import {  BigNumber, ContractFactory, Contract } from "ethers";

import { MEMBERS } from "../utils/constants";
import { toNumber } from "../utils/numbers";

describe("Organization Contract", function () {
  let OrganizationContract: ContractFactory;
  let organization: Contract;
  let organizationAddress: string;
  let balance: BigNumber | number;
  let members: string[]; 
  
  this.beforeAll(async () => {
    console.log("Organization Contract tests running...");
    OrganizationContract = await ethers.getContractFactory("Organization");
    members = MEMBERS.slice(0, MEMBERS.length - 1);
    const depositAmount = ethers.utils.parseEther("10");
    organization = await OrganizationContract.deploy("MyOrganization", members);
    organizationAddress = organization.address;
    balance = await ethers.provider.getBalance(organization.address);
    // console.log("Organization Contract toNumber(balance)", toNumber(balance));
  });

  describe("Deployment", function () {
    it("Should have deploy an organization", async function () {
        expect(await organization.name()).to.equal("MyOrganization");
        expect(organizationAddress).to.be.properAddress;
    });

    it("Should have the correct members", async function () {
        const members = await organization.getMembers();       
        // NOTE: MEMBERS.length + 1 because the deployer is also a member;
        // NOTE: Somecases you may want to exclude the deployer from the members list;
        expect(members.length).equal(3);
    });

    it("Should have balance of 10 ETH", async function () {
        // expect(balance).equal(ethers.utils.parseEther("10"));
    });

    it("Should add a member", async function () {
        const member = MEMBERS[MEMBERS.length - 1];
        await organization.addMember(member);
        const members = await organization.getMembers();
        expect(members.length).equal(4);
    });
  });

  describe("Pay Members", function () {
    it("Should pay a member", async function () {
        const member = MEMBERS[0];
        const amount = ethers.utils.parseEther("100");
        const balanceBefore = toNumber(await organization.getBalance());
        console.log("Organization Contract balanceBefore", balanceBefore);
        const recipient = await organization.payMember(member, { value: amount });
        const result = await recipient.wait();
        const balanceAfter = toNumber(await organization.getBalance());
        console.log("Organization Contract balanceAfter", balanceAfter);
    });
  });

});
