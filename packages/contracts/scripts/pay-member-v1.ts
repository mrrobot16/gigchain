import { ethers } from 'hardhat';
import { Contract, ContractInterface } from 'ethers';
import {
    MEMBERS,
    MEMBER,
    MEMBERS_V1,
    PAY_MEMBER_AMOUNT,
    ORGANIZATION_CONTRACT_V1,
    ORGANIZATION_DATA_JSON_V1,
} from '../utils/constants';

// NOTE: Be sure that MEMBER variable is a member of the organization else the transaction will fail.
async function main() {
    console.log('Paying member...');
    const OrganizationContract = await ethers.getContractAt(
        ORGANIZATION_CONTRACT_V1,
        ORGANIZATION_DATA_JSON_V1.address
    );
    const tx = await OrganizationContract.payMember(MEMBERS_V1[0].account, PAY_MEMBER_AMOUNT);
    const txResult = await tx.wait();
    console.log('payMember() txResult', txResult);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
