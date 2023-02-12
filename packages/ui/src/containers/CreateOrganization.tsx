import React, { useEffect } from "react";
import  { Container, Box, Typography } from "@mui/material";

import { detectMetamask } from "utils";
import { 
  CreateOrganizationForm, 
 } from "components";

function CreateOrganization() {
  useEffect(()=>{
    detectMetamask().then((hasMetamask: boolean) => {
      if (!hasMetamask) {
        console.log("Metamask is not installed or not available");
        // alert("Install Meta Mask")
        // window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en", "_blank");
      } else {
        console.log("Metamask is installed and available");
      }
    });
  },[])

  return (
    <Container maxWidth="md">
      <Box>
        <Typography variant="h1" component="h1" align="center">
          Create an Organization
        </Typography>
      </Box>
      <CreateOrganizationForm/>
    </Container>
  );
}

export default CreateOrganization;
