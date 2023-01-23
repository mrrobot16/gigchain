import { ethers } from 'hardhat';
import {
    NEW_MEMBER,
    ORGANIZATION_DATA_JSON,
    ORGANIZATION_CONTRACT,
} from '../utils/constants';

async function main() {
    console.log('Adding member...');
    const OrganizationContract = await ethers.getContractAt(
        ORGANIZATION_CONTRACT,
        ORGANIZATION_DATA_JSON.address
    );
    const tx = await OrganizationContract.addMember(NEW_MEMBER);
    const txResult = await tx.wait();
    console.log('addMember() txResult', txResult);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
