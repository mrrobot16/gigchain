import { BigNumber } from 'ethers';

export interface Member {
    account: string;
    balance: string | number | BigNumber;
    exists: boolean;
    active: boolean;
}

export interface Payment {
    amount: BigNumber;
    to: Member['account'];
}

export interface ErrorMessage {
    message: string;
}