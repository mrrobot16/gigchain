import { Member } from 'types';

export function convertToArrayOfAddresses(members: Member[]) {
  return members.map((member) => member.address);
}

export function convertToArrayOfAmounts(members: Member[]) {
  return members.map((member: Member) => member.amount.toString());
}