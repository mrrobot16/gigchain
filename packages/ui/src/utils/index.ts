export * from './abiCoder';
export * from './payments';
import { Member } from 'types';

export function convertToArrayOfAddresses(members: Member[]) {
  return members.map((member) => member.address);
}

export function convertToArrayOfAmounts(members: Member[]) {
  return members.map((member: Member) => member.amount.toString());
}


export function convertMembersArrayToArrayOfObject(members: []) {
  const membersArray: Member [] = members.map((membersArr: []) => {
    const tempArr: (string | number | boolean)[] = []
    membersArr.forEach((member) => {
      tempArr.push(member);
    });
    return {
      address: tempArr[0] as string,
      amount: tempArr[1] as number,
      exists: tempArr[2] as boolean,
      active: tempArr[3] as boolean,
    }
  });
  return membersArray
}