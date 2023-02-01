import { BigNumber } from 'ethers';

export interface Member {
  address: string;
  amount?: number | string | BigNumber;
}

export declare interface Ethereum {
  selectedAddress: string;
  enable(): Promise<void>;
}