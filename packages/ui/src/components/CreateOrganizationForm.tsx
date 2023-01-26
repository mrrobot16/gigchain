import React, { 
  useEffect 
} from "react";
import { 
  Typography, 
  Box, 
  Button,
  TextField, 
  List, ListItem, 
  ListItemText, 
  ListItemIcon,
  FormControl,
  FormLabel,
} from "@mui/material";
import { RemoveCircle as RemoveCircleIcon, AddCircle as AddCircleIcon  } from '@mui/icons-material';

import { useAccount } from "wagmi";
import { connect } from '@wagmi/core'
import { InjectedConnector } from '@wagmi/core/connectors/injected'


export interface Member {
  address: string | undefined;
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
}

const mockMembers: Member[] = [
  { address: "0x5Db06acd673531218B10430bA6dE9b69913Ad545" },
  { address: "0x11bb17983E193A3cB0691505232331634B8FCa01" },
]

function CreateOrganizationForm() {
  const [name, setName] = React.useState<string>("");
  const [member, setMember ] = React.useState<Member>({ address: "0x5Db06acd673531218B10430bA6dE9b69913Ad545" });
  const [members, setMembers] = React.useState<Member[]>([]);

  const account = useAccount();
  const onChangeText = (textField: string, input: string) => {
    switch (textField) {
      case "address":
        setMember({ address: input });
      break;
      case "name":
        setName(input);
      break;
    }
  }

  // const onValidate = (textField: string): boolean => {
  //   switch (textField) {
  //     case "address":
  //       return (member.address as string).length === 42 && (member.address as string).slice(0, 2) === "0x";
  //     break;
  //     case "name":
  //       return name !== "";
  //     break;
  //     default:
  //       return true
  //   }
  // }

  const addMember = () => {
    console.log("add member");
    console.log(member);
    setMembers([...members, member]);
    // members.push(member);
  };

  const removeMember = (index: number) => {
    console.log("remove member");
    console.log(index);
    const newMembers = members.filter((item, i) => i !== index);
    setMembers(newMembers);
  };

  const onSubmit = async () => {
    if(!account.isConnected) {
      console.log('account not connected');
      const result = await connect({
        connector: new InjectedConnector(),
      });
      console.log('result', result);
      return;
    }
  }

  const MemberList = () => {
    return (
      <List>
        List of Members
        {
          members.map((item, index) => (
            <ListItem key={index}>
                <ListItemText primary={(item as Member).address} />
                <ListItemIcon onClick={()=>{
                  removeMember(index);
                }}>
                  <RemoveCircleIcon onClick={addMember}/>
                </ListItemIcon>
            </ListItem>
          ))
        }
      </List>
    )
  }

  const FormTitle = () => {
    return (
      <Box>
        <Typography variant="h1" component="h1" align="center">
          Create an Organization
        </Typography>
      </Box>
    );
  }

  const componentDidMount = () => {
    setName("TestUiOrg");
    setMember({ address: "0x3D694A1C605e014b195FaA913e090e4BB9544FE3" });
    setMembers(mockMembers);
  }

  useEffect(componentDidMount, []);

  return (
    <Box sx={formStyle}>
      {/* Title */}
      <FormTitle />
      {/* <br/> */}

      {/* Form */}
      <Box component="form" onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}>
        <Box sx={formStyle}>
          <FormControl>
                <FormLabel>
                  Organization Name
                </FormLabel>
                <br/>
                <TextField 
                  label="Organization Name" 
                  variant="outlined" 
                  onChange={(event) => onChangeText("name", event.target.value)}
                  required={true}
                  value={name}
                />
          </FormControl>
          <br/>
          <FormControl>
                <FormLabel>
                    Add Member
                </FormLabel>
                <br/>
                  <TextField 
                    label="Member Address" 
                    variant="outlined" 
                    onChange={(event) => onChangeText("address", event.target.value)}
                    required={true}
                    value={member.address}
                  /> 
                <AddCircleIcon onClick={addMember}/>
          </FormControl>
          
          {/* Submit */}
          <FormControl>
              <Button variant="contained" color="primary" type="submit">
                Create Organization
              </Button>
          </FormControl>  
        </Box>
      </Box>
      {/* List */}
      <MemberList />
    </Box>
  );
}

export default CreateOrganizationForm;
