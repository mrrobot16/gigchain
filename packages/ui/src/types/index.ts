import { BigNumber } from 'ethers';

export interface Member {
  address: string;
  amount: number | string | BigNumber;
  exists?: boolean;
  active?: boolean;
}

export declare interface EthereumWindowProvider {
  selectedAddress: string;
  enable(): Promise<void>;
}