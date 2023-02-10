import React, { useEffect, useState } from "react";
import  { Container, Box, Typography, Button } from "@mui/material";

import { useParams  } from "react-router-dom";
import { BigNumber } from "ethers";

import { Web3 } from "services/web3/v1";
import { DashboardMemberList } from "components";
import { Member, Payment } from "types";

const buttonStyle = {
  width: "50%",
  margin: "10px",
}

function Organization() {
  const params = useParams();
  const organization = params.address as (`0x${string}`);
  const [orgMembers, setMembers] = useState<Member[]>([]);
  const [orgBalance, setOrgBalance] = useState<BigNumber | undefined>(undefined);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payingMembers, setPayingMembers] = useState(false);
  
  const componentDidMount = async (): Promise<void> => {
    resetOrgInfo();
  }

  const resetOrgInfo = async () => {
    const web3 = await Web3.getInstance();
    const getOrgMembers = await web3?.getOrgMembersV1(organization);    
    if (getOrgMembers != undefined) setMembers(getOrgMembers);
    const getOrgBalance = await web3?.getOrgBalanceV1(organization);
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
    if(payments.length <= (orgMembers).length && payments.length > 0) {
      console.log("IS possible to make payments: ", payments);
      const web3 = await Web3.getInstance();
      const tx = await web3.payOrgMembersV1(organization, payments);
      setPayingMembers(true)
      await tx.wait();
      resetOrgInfo();
      setPayingMembers(false)
    } else {
      console.log('NOT possible to make payments:', payments);
    }
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
          setPayments={setPayments}
          payments={payments}
        />

        <div>
          <Button variant="contained" color="primary" sx={buttonStyle} onClick={()=>{ payMembers() }} disabled={payingMembers}>
            { payingMembers ? 'Paying members...' : 'Pay Members' }
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
