import React from "react";
import  { Container } from "@mui/material";

import { 
  CreateOrganizationForm, 
  // CreateOrganizationForm2,
 } from "components";

function CreateOrganization() {
  return (
    <Container maxWidth="md">
      {/* 
      
      <CreateOrganizationForm2 />
      */}
      <CreateOrganizationForm/>
    </Container>
  );
}

export default CreateOrganization;
