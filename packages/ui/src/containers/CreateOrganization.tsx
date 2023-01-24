import React from "react";
import { Typography, Container, Box, TextField } from "@mui/material";

import { CreateOrganizationForm } from "components";

function CreateOrganization() {
  return (
    <Container maxWidth="xl">
      <CreateOrganizationForm />
    </Container>
  );
}

export default CreateOrganization;
