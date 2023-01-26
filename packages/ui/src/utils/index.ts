import { Member } from 'types';

export function convertToArrayOfAddresses(members: Member[]) {
  return members.map((member) => member.address);
}