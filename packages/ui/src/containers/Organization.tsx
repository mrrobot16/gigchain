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
  const [disableButtons, setDisableButtons] = useState(false);
  
  const componentDidMount = async (): Promise<void> => {
    setOrgInfo();
  }

  const setOrgInfo = async () => {
    const web3 = await Web3.getInstance(organization);
    const getOrgMembers = await web3?.getOrgMembersV1();    
    if (getOrgMembers != undefined) setMembers(getOrgMembers);
    const getOrgBalance = await web3?.getOrgBalanceV1();
    if (getOrgBalance != undefined) setOrgBalance(getOrgBalance);
  }

  useEffect(() => {
    componentDidMount();
  }, []);
  
  const removeMember = (member: string | number)  => {
    console.log('removeMember', member);
  }

  const payMember = async (member: string, amount: BigNumber | number)  => {    
    const web3 = await Web3.getInstance(organization);
    console.log('payMember member', member);
    console.log('payMember amount', amount);
    const tx = await web3.payOrgMemberV1(member, amount);
    setDisableButtons(true);
    await tx.wait();
    setDisableButtons(false);
    setOrgInfo();
  }

  const payMembers = async ()  => {
    if(payments.length <= (orgMembers).length && payments.length > 0) {
      console.log("IS possible to make payments: ", payments);
      const web3 = await Web3.getInstance(organization);
      const tx = await web3.payOrgMembersV1(payments);
      setDisableButtons(true);
      await tx.wait();
      setOrgInfo();
      setDisableButtons(false);
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
          <Button variant="contained" color="primary" sx={buttonStyle} onClick={()=>{ payMembers() }} disabled={disableButtons}>
            { disableButtons ? 'Paying members...' : 'Pay Members' }
          </Button>
        </div>

        <div>
          <Button variant="contained" color="primary" sx={buttonStyle} onClick={()=>{ addMember() }} disabled={disableButtons}>
            Add Member
          </Button>
        </div>

      </Box>
    </Container>
  );
}

export default Organization;
