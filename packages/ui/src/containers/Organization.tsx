import React, { useEffect, useState } from "react";
import  { Container, Box, Typography, Button } from "@mui/material";

import { useParams  } from "react-router-dom";
import { BigNumber } from "ethers";

import { Web3 } from "services/web3/v1";
import { DashboardMemberList } from "components";
import { Member } from "types";
import { 
  convertToArrayOfAddresses,
  convertToArrayOfAmounts, 
} from "utils";

const buttonStyle = {
  width: "50%",
  margin: "10px",
}

function Organization() {
  const params = useParams();
  const organization = params.address as (`0x${string}`);
  const [orgMembers, setMembers] = useState<Member[] | string[]>([]);
  const [orgBalance, setOrgBalance] = useState<BigNumber | undefined>(undefined);
  const [membersToPay, setMembersToPay] = useState<Member[]>([]);
  
  const componentDidMount = async (): Promise<void> => {
    const web3 = await Web3.getInstance();
    const getOrgMembers = await web3.getOrgMembersV1(organization);    
    if (getOrgMembers != undefined) setMembers(getOrgMembers);
    const getOrgBalance = await web3.getOrgBalanceV1(organization);
    if (getOrgBalance != undefined) setOrgBalance(getOrgBalance);
  }

  useEffect(() => {
    componentDidMount();
  }, []);
  
  const removeMember = (member: string | number)  => {
    console.log('removeMember', member);
  }

  const payMember = async (member: string, amount: BigNumber | number)  => {    
    const web3 = await Web3.getInstance();
    console.log('payMember member', member);
    console.log('payMember amount', amount);
    await web3.payOrgMemberV1(organization, member, amount);
  }

  const payMembers = async ()  => {
    // PayMembers expect an array of addresses and an array of amounts.
    const PAYROLL = {
      members: convertToArrayOfAddresses(membersToPay),
      amounts: convertToArrayOfAmounts(membersToPay),
    }
    console.log('PAYROLL', PAYROLL);
    const web3 = await Web3.getInstance();
    await web3.payOrgMembersV1(organization, PAYROLL.members, PAYROLL.amounts);
  }

  const addMember = (member?: string)  => {
    console.log('addMember', member);
  }

  return (
    <Container>
      <Box>
        <Typography variant="h1" component="h1" align="center">
          Organization name: { organization.slice(0, 5) } 
        </Typography>

        <Typography variant="h5" component="h5" align="center">
          Organization Address: { organization }
        </Typography>
        {/* { OrgBalance} */}
        <Typography variant="h5" component="h5" align="center">
          Organization Balance: {  orgBalance?.toString() }
        </Typography>
        
        <DashboardMemberList 
          members={
            typeof orgMembers != undefined ? 
            orgMembers : 
            [] as Member[]
          } 
          onRemoveMember={removeMember} 
          onPayMember={payMember}
          setMembersToPay={setMembersToPay}
          membersToPay={membersToPay}
        />

        <div>
          <Button variant="contained" color="primary" sx={buttonStyle} onClick={()=>{ payMembers() }}>
            Pay Members
          </Button>
        </div>

        <div>
          <Button variant="contained" color="primary" sx={buttonStyle} onClick={()=>{ addMember() }}>
            Add Member
          </Button>
        </div>

      </Box>
    </Container>
  );
}

export default Organization;
