import { expect } from 'chai';
import { ethers } from 'hardhat';
import { BigNumber, ContractFactory, Contract } from 'ethers';

import {
    MEMBERS,
    NEW_MEMBER,
    RANDOM_MEMBER_ADDRESS,
    ADDRESS_ZERO,
    PAYROll_TESTS,
    ORGANIZATION_CONTRACT_V2,
    ORGANIZATION_NAME_TEST,
    ORGANIZATION_DEPOSIT_TEST,
} from '../utils/constants';

describe.only('Organization Contract V2', function () {
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

    // TODO: replace beforeAll with hardhat test deploy fixture.
    // Checkout https://github.com/NomicFoundation/hardhat-boilerplate/blob/d3d81691855e6666fcdac90dbdd28f349ec68597/test/Token.js#L25
    // NOTE: Before all tests, deploy the contract and get the contract instance
    this.beforeAll(async () => {
        OrganizationContract = await ethers.getContractFactory(
            ORGANIZATION_CONTRACT_V2,
        );
        organization = await OrganizationContract.deploy(
            ORGANIZATION_NAME_TEST,
            members,
            { value: ORGANIZATION_DEPOSIT_TEST }
        );
        members = await organization.getMembers();
        organizationAddress = organization.address;
        organizationName = await organization.name();
        balance = await organization.getBalance();
        owner = await organization.owner();
        signer = await organization.signer.getAddress();
    });

    describe('Deployment', function () {
        it('Should have deployed with the correct owner & signer', async function () {
            expect(owner).to.equal(signer);
        });

        it('Should have deployed with proper address', async function () {
            expect(organizationAddress).to.not.equal(ADDRESS_ZERO);
            expect(organizationAddress).to.be.properAddress;
        });

        it('Should have deployed with correct name', async function () {
            expect(organizationName).to.equal('MyOrganization_TEST');
        });

        it('Should have deployed with correct balance of 10 ETH', async function () {
            expect(balance).equal(ethers.utils.parseEther('10'));
        });
    });

    describe('Members', function () {
        it('Should have the correct members', async function () {
            // const members = await organization.getMembers();
            // NOTE: MEMBERS.length + 1 because the deployer is also a member;
            // NOTE: Somecases you may want to exclude the deployer from the members list;
            expect(members.length).equal(4);
        });

        it('Should get a member', async function () {
            const getMember = await organization.getMember(member);
            expect(getMember).equal(member);
        });

        it('Should add a member', async function () {
            await organization.addMember(newMember);
            const updated_add_members = await organization.getMembers();
            expect(updated_add_members.length).equal(5);
        });

        it('Should remove a member', async function () {
            await organization.removeMember(MEMBERS[2]);
            const updated_remove_members = await organization.getMembers();
            expect(updated_remove_members.length).equal(4);
        });

        it('Should not find a random member', async function () {
            const getMember = await organization.getMember(
                RANDOM_MEMBER_ADDRESS
            );
            expect(getMember).equal(ADDRESS_ZERO);
        });
    });

    describe('Payments', function () {
        it('Should pay a member', async function () {
            const member = newMember;
            const amount = ethers.utils.parseEther('1');
            const balanceBefore = await organization.getBalance();
            await organization.payMember(member, amount);
            const balanceAfter = await organization.getBalance();
            expect(balanceBefore.sub(balanceAfter)).equal(amount);
        });

        it('Should not pay a random address', async function () {
            const amount = ethers.utils.parseEther('1');
            const balanceBefore = await organization.getBalance();
            try {
                await organization.payMember(RANDOM_MEMBER_ADDRESS, amount);
            } catch {
                const balanceAfter = await organization.getBalance();
                expect(balanceBefore).equal(balanceAfter);
            }
        });

        it('Should not pay a member with an amount greater than the balance', async function () {
            const amount = ethers.utils.parseEther('100');
            const balanceBefore = await organization.getBalance();
            try {
                await organization.payMember(member, amount);
            } catch {
                const balanceAfter = await organization.getBalance();
                expect(balanceBefore).equal(balanceAfter);
            }
        });

        it('Should have enough balance to pay list of members', async function () {
            const balance = await organization.getBalance();
            const totalPayment = PAYROll_TESTS.PAYMENTS.reduce((a, b) =>
                a.add(b)
            );
            expect(balance).to.greaterThanOrEqual(totalPayment);
        });

        it('Should pay list of members', async function () {
            const balance = await organization.getBalance();
            const totalPayment = PAYROll_TESTS.PAYMENTS.reduce((a, b) =>
                a.add(b)
            );
            await organization.payMembers(
                PAYROll_TESTS.MEMBERS,
                PAYROll_TESTS.PAYMENTS
            );
            const balanceAfter = await organization.getBalance();
            expect(balance.sub(balanceAfter)).equal(totalPayment);
        });
    });
});
