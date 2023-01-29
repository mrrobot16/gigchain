import React, { useEffect } from "react";
import  { Container, Box, Typography, Button } from "@mui/material";

import { useParams  } from "react-router-dom";
import { BigNumber, utils, Signer } from "ethers";
import { useContractRead, useContract, useSigner, useAccount } from "wagmi";
// import { readContract } from "@wagmi/core"

import { Web3 } from "services/web3";
import { DashboardMemberList } from "components";
import { Member } from "types";

import OrganizationABI from "services/web3/abis/Organization.json";

const buttonStyle = {
  width: "50%",
  margin: "10px",
}

function Organization() {
  const params = useParams();
  const organization = params.address as (`0x${string}`);
  const { data: signer } = useSigner();
  const config = { 
    address: organization, 
    abi: OrganizationABI.abi,
  }
  const contract = useContract(config);
  const { data: orgMembers } = useContractRead({...config, functionName: "getMembers"});
  const { data: orgBalance } = useContractRead({...config, functionName: "getBalance"});
  const account = useAccount();
  console.log('account', account);
  
  const componentDidMount = async () => {
    console.log('contract.getMembers', contract);
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
    console.log('payMember signer', signer);
    await web3.payOrgMember(organization, member, amount, signer as Signer);
  }

  const payMembers = (members?: string[], amount?: (BigNumber[] | number[]))  => {
    console.log('payMembers members', members);
    console.log('payMembers amount', amount);
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
          members={orgMembers as Member[]} 
          onRemoveMember={removeMember} 
          onPayMember={payMember} 
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
