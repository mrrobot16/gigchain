import React from "react";
import { 
  Typography,
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
} from "@mui/material";
import { RemoveCircle as RemoveCircleIcon  } from '@mui/icons-material';

import { Member } from "types"

export const MemberList = ({members, onRemoveMember}:{ members: Member[], onRemoveMember: (index: number) => void }) => {
  return (
    <List>
      <Typography variant="h5" align="center">
        List of Members
      </Typography>
      {
        members.map((item, index) => (
          <ListItem key={index}>
              <ListItemText primary={(item as Member).address} />
              <ListItemIcon onClick={()=>{
                onRemoveMember(index);
              }}>
                <RemoveCircleIcon/>
              </ListItemIcon>
          </ListItem>
        ))
      }
    </List>
  )
}
