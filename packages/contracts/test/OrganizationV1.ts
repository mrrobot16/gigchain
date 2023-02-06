import { expect } from 'chai';
import { ethers } from 'hardhat';
import { BigNumber, ContractFactory, Contract, utils } from 'ethers';

import {
    NEW_MEMBER_ACCOUNT,
    NEW_MEMBER_V1,
    RANDOM_MEMBER_ACCOUNT,
    ADDRESS_ZERO,
    ORGANIZATION_CONTRACT_V1,
    ORGANIZATION_NAME_TEST,
    ORGANIZATION_DEPOSIT_TEST,
    MEMBERS_V1_ACCOUNTS,
    MEMBERS_V1,
    MEMBER_DOES_NOT_EXIST_ERROR,
    MUST_SEND_CORRECT_AMOUNT_ETHER_ERROR,
    PAYMENTS_V1,
    PAYMENTS_FAIL_V1,
    NOT_ENOUGH_ETHER_BALANCE_ERROR,
} from '../utils/constants';

import { Member, ErrorMessage } from '../types';

describe('Organization Contract V1', function () {
    let contract: ContractFactory;
    let organization: Contract;
    let address: string;
    let name: string;
    let memberCount: BigNumber;
    let balance: BigNumber | number;
    const membersV1Accounts: string[] = MEMBERS_V1_ACCOUNTS;
    let membersV1: Member[] = MEMBERS_V1;
    let memberV1: Member = MEMBERS_V1[0];
    let newMember: string = NEW_MEMBER_ACCOUNT;
    let newMemberV1: Member = NEW_MEMBER_V1;
    let owner: string;
    let controller: string;
    let signer: string;
    let correctMemberCount: number;
    // TODO: replace beforeAll with hardhat test deploy fixture.
    // Checkout https://github.com/NomicFoundation/hardhat-boilerplate/blob/d3d81691855e6666fcdac90dbdd28f349ec68597/test/Token.js#L25
    // NOTE: Before all tests, deploy the contract and get the contract instance
    this.beforeAll(async () => {
        contract = await ethers.getContractFactory(ORGANIZATION_CONTRACT_V1);
        const encodedOrganizationDeploymentData = [
            ORGANIZATION_NAME_TEST,
            membersV1,
        ];
        organization = await contract.deploy(
            ORGANIZATION_NAME_TEST,
            membersV1Accounts,
            // encodeOrganizationDeploymentData,
            { value: ORGANIZATION_DEPOSIT_TEST, gasLimit: 10000000 }
        );
        membersV1 = await organization.getMembersV1();
        memberCount = await organization.getMemberCountV1();
        address = organization.address;
        name = await organization.name();
        balance = await organization.getBalance();
        owner = await organization.owner();
        controller = await organization.controller();
        signer = await organization.signer.getAddress();
    });

    describe('Deployment', function () {
        it('Should have deployed with the correct owner & signer', async function () {
            expect(owner).to.equal(signer);
        });

        it('Should have controller to be also correct owner & signer', async function () {
            expect(controller).to.equal(signer);
            expect(owner).to.equal(signer);
        });

        it('Should have deployed with proper address', async function () {
            expect(address).to.not.equal(ADDRESS_ZERO);
            expect(address).to.be.properAddress;
        });

        it('Should have deployed with correct name', async function () {
            expect(name).to.equal('MyOrganization_TEST');
        });

        it('Should have deployed with correct balance of 10 ETH', async function () {
            expect(balance).equal(ethers.utils.parseEther('10'));
        });
    });

    describe('Members', function () {
        it('Should have the correct member count', async function () {
            let expectedCorrectMemberCount = 5;
            const actualMemberCount = await organization.getMemberCountV1();
            expect(actualMemberCount.toNumber()).equal(
                expectedCorrectMemberCount
            );
        });

        it('Should get all members accounts', async function () {
            let expectedCorrectMemberCount = 5;
            const orgMembers: string[] = await organization.getMembersV1();
            expect(orgMembers.length).equal(expectedCorrectMemberCount);
            expect(memberCount.toNumber()).equal(orgMembers.length);
        });

        it('Should get a member', async function () {
            const getMember: Member = await organization.getMemberV1(
                memberV1.account
            );
            expect(getMember.account).equal(memberV1.account);
        });

        it('Should add a member', async function () {
            let expectedCorrectMemberCount = 6;
            const before_add_members = await organization.getMembersV1();
            await organization.addMemberV1(newMemberV1.account);
            const after_add_members = await organization.getMembersV1();

            expect(before_add_members.length).equal(
                expectedCorrectMemberCount - 1
            );
            expect(after_add_members.length).equal(expectedCorrectMemberCount);
            expect(
                after_add_members[after_add_members.length - 1].account
            ).equal(newMemberV1.account);
        });

        it('Should remove a member', async function () {
            let expectedCorrectMemberCount = 5;
            const before_remove_members = await organization.getMembersV1();

            await organization.removeMemberV1(MEMBERS_V1_ACCOUNTS[2]);

            const after_remove_members = await organization.getMembersV1();
            const getMember = await organization.getMemberV1(
                MEMBERS_V1_ACCOUNTS[2]
            );

            expect(before_remove_members.length).equal(
                expectedCorrectMemberCount + 1
            );
            expect(after_remove_members.length).equal(
                expectedCorrectMemberCount
            );
            expect(after_remove_members.length).equal(
                before_remove_members.length - 1
            );
            expect(after_remove_members[2].account).equal(
                NEW_MEMBER_V1.account
            );
            expect(getMember.account).equal(ADDRESS_ZERO);
        });

        it('Should not find a random member', async function () {
            const getMember = await organization.getMemberV1(
                RANDOM_MEMBER_ACCOUNT
            );
            expect(getMember.account).equal(ADDRESS_ZERO);
        });
    });

    describe('Payments', function () {
        it('Should pay a member', async function () {
            const member = newMember;
            const amount = ethers.utils.parseEther('1');
            const balanceBefore = await organization.getBalance();
            await organization.payMemberV1(member, amount);
            const balanceAfter = await organization.getBalance();
            expect(balanceBefore.sub(balanceAfter)).equal(amount);
        });

        it('Should not pay a random address', async function () {
            const amount = ethers.utils.parseEther('1');
            const balanceBefore = await organization.getBalance();
            try {
                await organization.payMemberV1(RANDOM_MEMBER_ACCOUNT, amount);
            } catch (error) {
                const balanceAfter = await organization.getBalance();
                expect((error as ErrorMessage).message).equal(
                    MEMBER_DOES_NOT_EXIST_ERROR
                );
                expect(balanceBefore).equal(balanceAfter);
            }
        });

        it(`Should not pay a member with an amount greater than the organization's balance`, async function () {
            const member = newMember;
            const amount = ethers.utils.parseEther('100');
            const balanceBefore = await organization.getBalance();
            try {
                await organization.payMemberV1(member, amount);
            } catch (error) {
                const balanceAfter = await organization.getBalance();
                expect((error as ErrorMessage).message).equal(
                    MUST_SEND_CORRECT_AMOUNT_ETHER_ERROR
                );
                expect(balanceBefore).equal(balanceAfter);
            }
        });

        it('Should pay list of members', async function () {
            const balance = await organization.getBalance();
            try {
                const encodedPaymentsObjects = PAYMENTS_V1.map((payment) => {
                    return utils.defaultAbiCoder.encode(
                        ['address', 'uint256'],
                        [payment.to, payment.amount]
                    );
                });
                const encodedPayments = utils.defaultAbiCoder.encode(
                    ['bytes[]'],
                    [encodedPaymentsObjects]
                );
                const tx = await organization.payMembersV1(encodedPayments);
                const result = await tx.wait();
                // NOTE
                // it should emit PAYMENTS_V2.length + 1 events.
                // 1 for the PayMembersV2 event and 1 for each PayMemberV2 event
                const expectedEventsCount = PAYMENTS_V1.length + 1;
                expect(result.logs.length).equal(PAYMENTS_V1.length + 1);
            } catch (error) {
                throw error;
            }
            const balanceAfter = await organization.getBalance();
        });

        it('Should not pay list of members', async function () {
            const balance = await organization.getBalance();
            try {
                const encodedPaymentsObjects = PAYMENTS_FAIL_V1.map(
                    (payment) => {
                        return utils.defaultAbiCoder.encode(
                            ['address', 'uint256'],
                            [payment.to, payment.amount]
                        );
                    }
                );
                const encodedPayments = utils.defaultAbiCoder.encode(
                    ['bytes[]'],
                    [encodedPaymentsObjects]
                );
                const tx = await organization.payMembersV1(encodedPayments);
            } catch (error) {
                expect((error as ErrorMessage).message).equal(
                    NOT_ENOUGH_ETHER_BALANCE_ERROR
                );
            }
            const balanceAfter = await organization.getBalance();
            expect(balance).equal(balanceAfter);
        });
    });
});
