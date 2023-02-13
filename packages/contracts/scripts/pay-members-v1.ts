import { ethers } from 'hardhat';
import { Contract, utils } from 'ethers';

import {
    PAYROll,
    ORGANIZATION_CONTRACT_V1,
    ORGANIZATION_DATA_JSON_V1,
    PAYMENTS_V1,
} from '../utils/constants';

async function main() {
    console.log('Paying members...');
    const OrganizationContract = await ethers.getContractAt(
        ORGANIZATION_CONTRACT_V1,
        ORGANIZATION_DATA_JSON_V1.address
    );
    const encodedPaymentsObjects = PAYMENTS_V1.slice(0,1).map((payment) => {
        return utils.defaultAbiCoder.encode(
            ['address', 'uint256'],
            [payment.to, payment.amount]
        );
    });
    const encodedPayments = utils.defaultAbiCoder.encode(
        ['bytes[]'],
        [encodedPaymentsObjects]
    );
    // NOTE: Be sure that PAYROLL.MEMBERS variable are members of the organization
    // else the transaction will fail.
    const tx = await OrganizationContract.payMembers(encodedPayments);
    const txResult = await tx.wait();
    console.log('payMembers() txResult', txResult);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
