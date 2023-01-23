import { ethers } from 'hardhat';
import { Contract } from 'ethers';

import {
    PAYROll,
    ORGANIZATION_CONTRACT,
    ORGANIZATION_DATA_JSON,
} from '../utils/constants';

async function main() {
    console.log('Paying members...');
    const OrganizationContract = await ethers.getContractAt(
        ORGANIZATION_CONTRACT,
        ORGANIZATION_DATA_JSON.address
    );
    // NOTE: Be sure that PAYROLL.MEMBERS variable are members of the organization
    // else the transaction will fail.
    const tx = await OrganizationContract.payMembers(
        PAYROll.MEMBERS,
        PAYROll.PAYMENTS
    );
    const txResult = await tx.wait();
    console.log('payMembers() txResult', txResult);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
