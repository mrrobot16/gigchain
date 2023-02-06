import { ethers } from 'hardhat';
import { utils } from 'ethers';

import { Payment } from '../../types';
import { MEMBERS_V2, NEW_MEMBER_V2, NEW_MEMBER_ACCOUNT } from './member';

const MEMBER_1_PAYMENT_V2 = utils.parseEther('0.0000000000012');

const MEMBER_2_PAYMENT_V2 = utils.parseEther('0.0000000000023');

const MEMBER_3_PAYMENT_V2 = utils.parseEther('0.0000000000045');

export const PAY_MEMBER_AMOUNT_V2 = utils.parseEther('0.0000001234567');

export const NEW_MEMBER_PAYMENT_V2 = utils.parseEther('0.0000000000067');

const { [0]: MEMBER_1, [1]: MEMBER_2, [2]: MEMBER_3 } = MEMBERS_V2;

const PAYMENT_1: Payment = {
    amount: MEMBER_1_PAYMENT_V2,
    to: MEMBER_1.account,
};

const PAYMENT_2: Payment = {
    amount: MEMBER_2_PAYMENT_V2,
    to: MEMBER_2.account,
};

const PAYMENT_3: Payment = {
    amount: MEMBER_3_PAYMENT_V2,
    to: MEMBER_3.account,
};

const PAYMENT_4: Payment = {
    amount: NEW_MEMBER_PAYMENT_V2,
    to: NEW_MEMBER_ACCOUNT,
};

const PAYMENT_1_FAIL: Payment = {
    amount: utils.parseEther('1000'),
    to: MEMBER_1.account,
};

const PAYMENT_2_FAIL: Payment = {
    amount: utils.parseEther('1000'),
    to: MEMBER_2.account,
};

export const PAYMENTS_V2 = [
    PAYMENT_1,
    PAYMENT_2,
    // PAYMENT_3, // This payment is not included in the test because in the test suite that member is removed.
    PAYMENT_4, // This is the added member test.
];

export const PAYMENTS_FAIL_V2 = [PAYMENT_1_FAIL, PAYMENT_2_FAIL];

const PAYMENT_1_GOERLI_V2: Payment = {
    amount: utils.parseEther('0.0000000123456'),
    to: MEMBER_1.account,
};

const PAYMENT_2_GOERLI_V2: Payment = {
    amount: utils.parseEther('0.0000000789101'),
    to: MEMBER_2.account,
};

export const PAYMENTS_GOERLI_V2 = [PAYMENT_1_GOERLI_V2, PAYMENT_2_GOERLI_V2];
