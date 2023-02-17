import { utils } from "ethers";
import { Payment } from "types";

export const encodePayments = (payments: Payment[]) => {
  const encodedPaymentsObjects = payments.map((payment) => {
    return utils.defaultAbiCoder.encode(
      ["address", "uint256"],
      [payment.to, payment.amount]
    );
  });
  const encodedPayments = utils.defaultAbiCoder.encode(
    ["bytes[]"],
    [encodedPaymentsObjects]
  );
  return encodedPayments;
};
