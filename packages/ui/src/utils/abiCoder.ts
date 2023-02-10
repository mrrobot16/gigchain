import { utils } from 'ethers';

export const encode = (payments: any[]) => {
  const encodedPaymentsObjects = payments.map((payment) => {
    return utils.defaultAbiCoder.encode(
        ['address', 'uint256'],
        [payment.to, payment.amount]
    );
  });
  const encodedPayments = utils.defaultAbiCoder.encode(
    ['bytes[]'],
    [encodedPaymentsObjects]
  );
  return encodedPayments;
}