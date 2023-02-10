import { Payment, Member } from "types";

export const sanitizePayments = (payments: Payment[], to: Member["address"], amount: number) => {
  if(amount == 0) {
    const filteredPayments = payments.filter((payment) => payment.to !== to);
    return [
      ...filteredPayments
    ]
  }
  const newPayment = {
    to,
    amount,
  }
  const isPayeeAdded = payments.some((payment) => payment.to === to);
  if(isPayeeAdded) {
    const cleanPayments = payments.filter(payment => payment.to !== to);
    return [...cleanPayments, newPayment] 
  }
  return [...payments, newPayment]
}