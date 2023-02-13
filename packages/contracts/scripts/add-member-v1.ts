import { ethers } from 'hardhat';
import {
    NEW_MEMBER,
    ORGANIZATION_DATA_JSON_V1,
    ORGANIZATION_CONTRACT_V1,
    NEW_MEMBER_V1,
} from '../utils/constants';

async function main() {
    console.log('Adding member...');
    const OrganizationContract = await ethers.getContractAt(
        ORGANIZATION_CONTRACT_V1,
        ORGANIZATION_DATA_JSON_V1.address
    );
    const tx = await OrganizationContract.addMember(NEW_MEMBER_V1.account);
    const txResult = await tx.wait();
    console.log('addMember() txResult', txResult);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
