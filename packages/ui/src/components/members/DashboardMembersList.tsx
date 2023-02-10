import React from "react";

import { 
  Typography,
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  TextField,
} from "@mui/material";
import { RemoveCircle as RemoveCircleIcon,  CurrencyBitcoin } from '@mui/icons-material';

import { Member, Payment } from "types"
import { sanitizePayments } from "utils";

interface DashboardMemberListProps {
  members: Member[],
  onRemoveMember: (member: string | number) => void
  onPayMember: (member: string, amount: number) => void
  payments: Payment[],
  setPayments: (members: Payment[]) => void;
}

export const DashboardMemberList = ({members, onRemoveMember, onPayMember, setPayments, payments}: DashboardMemberListProps) => {
  return (
    <List>
      <Typography variant="h5" align="center">
        List of Members
      </Typography>
      {
        members.map((member, index) => {
          const [amount, setAmount] = React.useState(0);

          const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseInt(event.target.value);
            setAmount(value);
            const sanitizedPayments  = sanitizePayments(payments, member.address, amount);
            setPayments(sanitizedPayments)
          }

          const onClickPayMember = () => {
            if(amount == 0) return;
            onPayMember(member.address, amount);
          }

          const onClickRemoveMember = () => {
            onRemoveMember(member.address);
          }

          return (
            <ListItem key={index}>
              <ListItemText primary={member.address} />
              <TextField inputProps={{ inputMode: 'numeric' }} type="number" onChange={onChange}/>
              <ListItemIcon onClick={onClickPayMember}>
                <CurrencyBitcoin/>
              </ListItemIcon>

              <ListItemIcon onClick={onClickRemoveMember}>
                <RemoveCircleIcon/>
              </ListItemIcon>
            </ListItem>
          )
        })
      }
    </List>
  )
}
