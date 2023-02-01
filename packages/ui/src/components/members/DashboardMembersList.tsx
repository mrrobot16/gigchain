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
}

export const DashboardMemberList = ({members, onRemoveMember, onPayMember}: DashboardMemberListProps) => {
  return (
    <List>
      <Typography variant="h5" align="center">
        List of Members
      </Typography>
      {
        members.map((item, index) => {
          const [amount, setAmount] = React.useState(0);
          // item = typeof item == "string" ? item as string : item.address as string;
          return (
            <ListItem key={index}>
              <ListItemText primary={typeof item == "string" ? item.slice(0,20) : item.address} />
              <TextField inputProps={{ inputMode: 'numeric' }} type="number" onChange={(event)=>{
                setAmount(parseInt(event.target.value));
                // This useState should come from parent component
                // setMembersList([
                //   ...membersList, {
                //     amount: parseInt(event.target.value),
                //     address: typeof item == "string" ? item : item.address,
                //   }
                //   ]);
              }}/>
              <ListItemIcon onClick={()=>{
                // console.log('amount', amount);
                
                onPayMember(typeof item == "string" ? item : item.address, amount);
              }}>
                <CurrencyBitcoin/>
              </ListItemIcon>

              <ListItemIcon onClick={()=>{
                onRemoveMember(typeof item == "string" ? item : item.address);
              }}>
                <RemoveCircleIcon/>
              </ListItemIcon>
            </ListItem>
          )
        })
      }
    </List>
  )
}
