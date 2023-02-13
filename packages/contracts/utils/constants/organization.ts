import { ethers } from 'hardhat';
export * from './member';

export const { HARDHAT_NETWORK } = process.env;

const Network = HARDHAT_NETWORK || 'hardhat';

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000';

export const ORGANIZATION_CONTRACT = 'Organization';
export const ORGANIZATION_CONTRACT_V1 = 'OrganizationV1';

export const ORGANIZATION_NAME_TEST = 'MyOrganization_TEST';
export const ORGANIZATION_NAME_TEST_V1 = 'MyOrganization_TEST_V1';
export const ORGANIZATION_NAME = 'MyOrganization';

export const ORGANIZATION_DEPOSIT = ethers.utils.parseEther('0.00016190');
export const ORGANIZATION_DEPOSIT_TEST = ethers.utils.parseEther('10');
export const ORGANIZATION_CONTRACT_FILE_PATH = `scripts/deployments/${Network}/organization.json`;
export const ORGANIZATION_CONTRACT_FILE_PATH_V1 = `scripts/deployments/${Network}/organization-v1.json`;
// NOTE: This is the path to the file where the organization address is stored
const organizationFilePath = `../../${ORGANIZATION_CONTRACT_FILE_PATH}`;
export const ORGANIZATION_DATA_JSON = require(`../../${ORGANIZATION_CONTRACT_FILE_PATH}`);
export const ORGANIZATION_DATA_JSON_V1 = require(`../../${ORGANIZATION_CONTRACT_FILE_PATH_V1}`);
