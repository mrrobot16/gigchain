import { expect } from 'chai';
import { ethers } from 'hardhat';
import { BigNumber, ContractFactory, Contract, utils } from 'ethers';

import {
    NEW_MEMBER_ACCOUNT,
    NEW_MEMBER_V2,
    RANDOM_MEMBER_ACCOUNT,
    ADDRESS_ZERO,
    PAYROll_TESTS,
    ORGANIZATION_CONTRACT_V2,
    ORGANIZATION_NAME_TEST,
    ORGANIZATION_DEPOSIT_TEST,
    MEMBERS_V2_ACCOUNTS,
    MEMBERS_V2,
    MEMBER_DOES_NOT_EXIST_ERROR,
    // TRANSFER_FAILED_REVERT_ERROR,
    MUST_SEND_CORRECT_AMOUNT_ETHER_ERROR,
    PAYMENTS_V2,
} from '../utils/constants';

import { Member, ErrorMessage, Payment } from '../types';

describe('Organization Contract V2', function () {
    let contract: ContractFactory;
    let organization: Contract;
    let address: string;
    let name: string;
    let memberCount: BigNumber;
    let balance: BigNumber | number;
    const membersV2Accounts: string[] = MEMBERS_V2_ACCOUNTS;
    let membersV2: Member[] = MEMBERS_V2;
    let memberV2: Member = MEMBERS_V2[0];
    let newMember: string = NEW_MEMBER_ACCOUNT;
    let newMemberV2: Member = NEW_MEMBER_V2;
    let owner: string;
    let controller: string;
    let signer: string;
    let correctMemberCount: number;
    // TODO: replace beforeAll with hardhat test deploy fixture.
    // Checkout https://github.com/NomicFoundation/hardhat-boilerplate/blob/d3d81691855e6666fcdac90dbdd28f349ec68597/test/Token.js#L25
    // NOTE: Before all tests, deploy the contract and get the contract instance
    this.beforeAll(async () => {
        contract = await ethers.getContractFactory(ORGANIZATION_CONTRACT_V2);
        const encodedOrganizationDeploymentData = [
            ORGANIZATION_NAME_TEST,
            membersV2,
        ];
        organization = await contract.deploy(
            ORGANIZATION_NAME_TEST,
            membersV2Accounts,
            // encodeOrganizationDeploymentData,
            { value: ORGANIZATION_DEPOSIT_TEST, gasLimit: 10000000 }
        );
        membersV2 = await organization.getMembersV2();
        memberCount = await organization.getMemberCountV2();
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
        // let expectedCorrectMemberCount = 5;
        it('Should have the correct member count', async function () {
            let expectedCorrectMemberCount = 5;
            const actualMemberCount = await organization.getMemberCountV2();
            expect(actualMemberCount.toNumber()).equal(
                expectedCorrectMemberCount
            );
        });

        it('Should get all members accounts', async function () {
            let expectedCorrectMemberCount = 5;
            // expect(members.length).equal(expectedCorrectMemberCount);
            const orgMembers: string[] = await organization.getMembersV2();
            expect(orgMembers.length).equal(expectedCorrectMemberCount);
            expect(memberCount.toNumber()).equal(orgMembers.length);
        });

        it('Should get a member', async function () {
            const getMember: Member = await organization.getMemberV2(
                memberV2.account
            );
            expect(getMember.account).equal(memberV2.account);
        });

        it('Should add a member', async function () {
            let expectedCorrectMemberCount = 6;
            const before_add_members = await organization.getMembersV2();
            await organization.addMemberV2(newMemberV2.account);
            const after_add_members = await organization.getMembersV2();

            expect(before_add_members.length).equal(expectedCorrectMemberCount-1);
            expect(after_add_members.length).equal(expectedCorrectMemberCount);
            expect(
                after_add_members[after_add_members.length - 1].account
            ).equal(newMemberV2.account);
        });

        it('Should remove a member', async function () {
            let expectedCorrectMemberCount = 5;
            const before_remove_members = await organization.getMembersV2();

            await organization.removeMemberV2(MEMBERS_V2_ACCOUNTS[2]);
            
            const after_remove_members = await organization.getMembersV2();
            const getMember = await organization.getMemberV2(
                MEMBERS_V2_ACCOUNTS[2]
            );

            expect(before_remove_members.length).equal(expectedCorrectMemberCount+1);
            expect(after_remove_members.length).equal(expectedCorrectMemberCount);
            expect(after_remove_members.length).equal(
                before_remove_members.length - 1
            );
            expect(after_remove_members[2].account).equal(
                NEW_MEMBER_V2.account
            );
            expect(getMember.account).equal(ADDRESS_ZERO);
        });

        it('Should not find a random member', async function () {
            const getMember = await organization.getMemberV2(
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
            await organization.payMemberV2(member, amount);
            const balanceAfter = await organization.getBalance();
            expect(balanceBefore.sub(balanceAfter)).equal(amount);
        });

        it('Should not pay a random address', async function () {
            const amount = ethers.utils.parseEther('1');
            const balanceBefore = await organization.getBalance();
            try {
                await organization.payMemberV2(RANDOM_MEMBER_ACCOUNT, amount);
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
                await organization.payMemberV2(member, amount);
            } catch (error) {
                const balanceAfter = await organization.getBalance();
                expect((error as ErrorMessage).message).equal(MUST_SEND_CORRECT_AMOUNT_ETHER_ERROR);
                expect(balanceBefore).equal(balanceAfter);     
            }
        });

        it('Should have enough balance to pay list of members', async function () {
            const balance = await organization.getBalance();

            // const totalPayment = PAYMENTS_V2.reduce((a, b) => console.log(a, b)
            //     // a.add(b)
            // );
            // const totalPayment = PAYMENTS_V2.map(
                // (payment) => ethers.utils.parseEther(payment)
                // payment => payment.amount
            // ).reduce((a, b) => a.add(b));
            // expect(balance).to.greaterThanOrEqual(totalPayment);
        });

        it('Should pay list of members', async function () {
            const balance = await organization.getBalance();
            try {
                const functionSignature = 'payMembersV2(bytes)';
                // Define the ABI type for the payments array
                const paymentsType = 'bytes';
                // Encode the payments array
                const argumentsTypes = {
                    type: 'tuple[]',
                    name: '_payments',
                    components: [{
                        name: 'to',
                        type: 'address'
                    }, {
                        name: 'amount',
                        type: 'uint256'
                    }]
                } as utils.ParamType
                const encodedPayments = utils.defaultAbiCoder.encode(
                    [paymentsType],
                    [
                        utils.defaultAbiCoder.encode([argumentsTypes], [PAYMENTS_V2])
                    ]
                );
                await organization.payMembersV2(encodedPayments);
            } catch (error) {
                console.log((error as ErrorMessage).message)
                throw(error)
            }

            const balanceAfter = await organization.getBalance();
        });
    });
});
