export interface Member {
  address: string;
}

export declare interface Ethereum {
  selectedAddress: string;
  enable(): Promise<void>;
}