import { ethers } from 'hardhat';

import { Member } from '../../types';

const MEMBER_1_ACCOUNT = '0x5Db06acd673531218B10430bA6dE9b69913Ad545';

const MEMBER_2_ACCOUNT = '0x11bb17983E193A3cB0691505232331634B8FCa01';

const MEMBER_3_ACCOUNT = '0x44A814f80c14977481b47C613CD020df6ea3D25D';

const MEMBER_4_ACCOUNT = "0x3D694A1C605e014b195FaA913e090e4BB9544FE3";

export const NEW_MEMBER_ACCOUNT = '0xE36A62413F4eED447514cE9Ee3645dfb19f9b554';

export const RANDOM_MEMBER_ACCOUNT = '0x07d278B7a3872e5c4536A7C0e5Ab9759206976aA';

const BALANCE_ZERO = ethers.utils.parseEther('0');

const Member1_V2 = {
  account: MEMBER_1_ACCOUNT,
  balance: BALANCE_ZERO,
  exists: true,
  active: true,
}

const Member2_V2 = {
  account: MEMBER_2_ACCOUNT,
  balance: BALANCE_ZERO,
  exists: true,
  active: true,
}

const Member3_V2 = {
  account: MEMBER_3_ACCOUNT,
  balance: BALANCE_ZERO,
  exists: true,
  active: true,
}

const Member4_V2 = {
  account: MEMBER_4_ACCOUNT,
  balance: BALANCE_ZERO,
  exists: true,
  active: true,
}

export const NEW_MEMBER_V2 = {
  account: NEW_MEMBER_ACCOUNT,
  balance: BALANCE_ZERO,
  exists: true,
  active: true,
}

export const MEMBERS_V2 = [
  Member1_V2,
  Member2_V2,
  Member3_V2,
  Member4_V2,
]

export const MEMBERS_V2_ACCOUNTS = [
  Member1_V2.account,
  Member2_V2.account,
  Member3_V2.account,
  Member4_V2.account,
]