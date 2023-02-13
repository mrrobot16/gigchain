import { ethers } from 'hardhat';
import { NEW_MEMBER, NEW_MEMBER_V1, ORGANIZATION_DATA_JSON_V1 } from '../utils/constants';

async function main() {
    console.log('Removing member...');
    const OrganizationContract = await ethers.getContractAt(
        'OrganizationV1',
        ORGANIZATION_DATA_JSON_V1.address
    );
    const tx = await OrganizationContract.removeMember(NEW_MEMBER_V1.account);
    const txResult = await tx.wait();
    console.log('removeMember() txResult', txResult);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
