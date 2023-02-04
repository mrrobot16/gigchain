import { ethers } from 'hardhat';

export const { HARDHAT_NETWORK } = process.env;

const Network = HARDHAT_NETWORK || 'hardhat';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export const ORGANIZATION_CONTRACT = 'Organization';
export const ORGANIZATION_CONTRACT_V1 = 'OrganizationV1';
export const ORGANIZATION_CONTRACT_V2 = 'OrganizationV2';
export const ORGANIZATION_NAME_TEST = 'MyOrganization_TEST';
export const ORGANIZATION_NAME = 'MyOrganization';
export const ORGANIZATION_DEPOSIT = ethers.utils.parseEther('0.00016190');
export const ORGANIZATION_DEPOSIT_TEST = ethers.utils.parseEther('10');
export const ORGANIZATION_CONTRACT_FILE_PATH = `scripts/deployments/${Network}/organization.json`;
// NOTE: This is the path to the file where the organization address is stored
const organizationFilePath = `../../${ORGANIZATION_CONTRACT_FILE_PATH}`;
export const ORGANIZATION_DATA_JSON = require(`../../${ORGANIZATION_CONTRACT_FILE_PATH}`);

const MEMBER_1 = '0x5Db06acd673531218B10430bA6dE9b69913Ad545';
const MEMBER_1_PAYMENT = ethers.utils.parseEther('1');
const MEMBER_2 = '0x11bb17983E193A3cB0691505232331634B8FCa01';
const MEMBER_2_PAYMENT = ethers.utils.parseEther('2');
const MEMBER_3 = '0x44A814f80c14977481b47C613CD020df6ea3D25D';
const MEMBER_3_PAYMENT = ethers.utils.parseEther('3');

export const MEMBERS = [MEMBER_1, MEMBER_2, MEMBER_3];
export const MEMBERS_V1 = [MEMBER_1, MEMBER_2, MEMBER_3];

export const MEMBER = MEMBERS[0];
export const PAY_MEMBER_AMOUNT = ethers.utils.parseEther('0.000001234567');

export const NEW_MEMBER = '0x3D694A1C605e014b195FaA913e090e4BB9544FE3';
export const NEW_MEMBER_PAYMENT = ethers.utils.parseEther('4');
export const RANDOM_MEMBER_ADDRESS =
    '0xE36A62413F4eED447514cE9Ee3645dfb19f9b554';

// NOTE: This is a bad practice, but it's just for testing purposes
// NOTE: You should use a database or a file to store this data
export const PAYROLL_MEMBERS = [
    MEMBER_1,
    MEMBER_2,
    // NEW_MEMBER
];

export const PAYMENTS_TESTS = [
    MEMBER_1_PAYMENT,
    MEMBER_2_PAYMENT,
    // NEW_MEMBER_PAYMENT,
];

// NOTE: This should an array of objects with the
// following structure: { address: string, payment: BigNumber }[]
// rather than an object with 2 arrays
export const PAYROll_TESTS = {
    MEMBERS: PAYROLL_MEMBERS,
    PAYMENTS: PAYMENTS_TESTS,
};

export const PAYMENTS_GOERLI = [
    ethers.utils.parseEther('0.0000000123456'),
    ethers.utils.parseEther('0.0000000789101'),
];

export const PAYROll = {
    MEMBERS: PAYROLL_MEMBERS,
    PAYMENTS: PAYMENTS_GOERLI,
};
