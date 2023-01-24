import React from 'react';
import { Typography, Box, TextField,  } from '@mui/material';

const boxStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
}

function CreateOrganizationForm() {
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("submit");
    }
    return (
        <Box sx={boxStyle} component="form" onSubmit={onSubmit}>
            <Typography variant="h1" component="h1">
                Create an Organization
            </Typography>
            <TextField label="Organization Name" variant="standard"/>
            
        </Box>
    );
}

export default CreateOrganizationForm;