import { ethers } from "hardhat";
export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

const MEMBER_1 = "0x5Db06acd673531218B10430bA6dE9b69913Ad545"
const MEMBER_1_PAYMENT = ethers.utils.parseEther("1");
const MEMBER_2 = "0x11bb17983E193A3cB0691505232331634B8FCa01";
const MEMBER_2_PAYMENT = ethers.utils.parseEther("2");
const MEMBER_3 = "0x44A814f80c14977481b47C613CD020df6ea3D25D";
const MEMBER_3_PAYMENT = ethers.utils.parseEther("3");

export const MEMBERS = [
    MEMBER_1,
    MEMBER_2,
    MEMBER_3
];

export const NEW_MEMBER = "0x3D694A1C605e014b195FaA913e090e4BB9544FE3";
export const NEW_MEMBER_PAYMENT = ethers.utils.parseEther("4");
export const RANDOM_ADDRESS = "0xE36A62413F4eED447514cE9Ee3645dfb19f9b554";

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
}

export const PAYMENTS_GOERLI = [
    ethers.utils.parseEther("0.0000000123456"),
    ethers.utils.parseEther("0.0000000789101"),
];

export const PAYROll = {
    MEMBERS: PAYROLL_MEMBERS,
    PAYMENTS: PAYMENTS_GOERLI,
}