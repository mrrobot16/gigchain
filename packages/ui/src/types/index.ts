import { BigNumber } from 'ethers';

export interface Member {
  address: string;
  amount: number | string | BigNumber;
  exists?: boolean;
  active?: boolean;
}

export interface Payment {
  to: string;
  amount: number | string | BigNumber;
}

export declare interface EthereumWindowProvider {
  selectedAddress: string;
  enable(): Promise<void>;
  request(request: { method: string, params?: Array<any> }): Promise<any>
}
