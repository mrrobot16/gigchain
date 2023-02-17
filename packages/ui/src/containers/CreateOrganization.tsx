import React from "react";
import { Container, Box, Typography } from "@mui/material";

import { CreateOrganizationForm } from "components";

function CreateOrganization() {
  return (
    <Container maxWidth="md">
      <Box>
        <Typography variant="h1" component="h1" align="center">
          Create an Organization
        </Typography>
      </Box>
      <CreateOrganizationForm />
    </Container>
  );
}

export default CreateOrganization;
