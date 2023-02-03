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

import { Member } from "types"

interface DashboardMemberListProps {
  members: Member[] | string[],
  onRemoveMember: (member: string | number) => void
  onPayMember: (member: string, amount: number) => void
  membersToPay: Member[] | string[],
  setMembersToPay: (members: Member[]) => void;
}

export const DashboardMemberList = ({members, onRemoveMember, onPayMember, setMembersToPay, membersToPay}: DashboardMemberListProps) => {
  return (
    <List>
      <Typography variant="h5" align="center">
        List of Members
      </Typography>
      {
        members.map((item, index) => {
          const [amount, setAmount] = React.useState(0);

          const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const newMember: Member = {
              address: typeof item == "string" ? item : item.address,
              amount: parseInt(event.target.value),
            }
            setAmount(
              parseInt(event.target.value)
            );
            setMembersToPay([
              ...membersToPay as Member[],
              newMember
            ]);
          }
          const onClickPayMember = () => {
            onPayMember(typeof item == "string" ? item : item.address, amount);
          }

          const onClickRemoveMember = () => {
            onRemoveMember(typeof item == "string" ? item : item.address);
          }

          return (
            <ListItem key={index}>
              <ListItemText primary={typeof item == "string" ? item.slice(0,20) : item.address} />
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
