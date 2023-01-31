import React, { 
  useEffect 
} from "react";
import {
  useNavigate
} from "react-router-dom";
import { 
  Box, 
  Button,
  TextField, 
  FormControl,
  FormLabel,
} from "@mui/material";
import { AddCircle as AddCircleIcon  } from '@mui/icons-material';

import { Web3 } from "services/web3";
import { Member } from "types"
import { MemberList } from "components";
import { convertToArrayOfAddresses } from "utils";

const formStyle = {
  display: "flex",
  flexDirection: "column",
}

const mockMembers: Member[] = [
  { address: "0x5Db06acd673531218B10430bA6dE9b69913Ad545" },
  { address: "0x11bb17983E193A3cB0691505232331634B8FCa01" },
]

const { REACT_APP_ENVIRONMENT: APP_ENV } = process.env;

function CreateOrganizationForm() {
  const [name, setName] = React.useState<string>("");
  const [member, setMember ] = React.useState<Member>({ address: "0x5Db06acd673531218B10430bA6dE9b69913Ad545" });
  const [members, setMembers] = React.useState<Member[]>([]);
  const navigate = useNavigate();

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
  };

  const removeMember = (index: number) => {
    console.log("remove member");
    console.log(index);
    const newMembers = members.filter((item, i) => i !== index);
    setMembers(newMembers);
  };

  const deployOrgContract = async () => {
    try {
      const web3 = await Web3.getInstance();
      await web3.deployOrgContract(
        name, 
        convertToArrayOfAddresses(members), 
        0.00018, // this should be a constant or user input
        callbackAfterDeployOrgContract
      );
    } catch (error: unknown) {
      throw new Error('Possible RPC Error: Metamask Tx Signature: User denied transaction signature');
    }
  }

  const callbackAfterDeployOrgContract = (address: string) => {
    navigate(`/org/${address}`);
  }

  async function onSubmit() {
    deployOrgContract()
  }

  const componentDidMount = () => {
    if(APP_ENV === "development") {
      setName("TestUiOrg");
      setMember({ address: "0x3D694A1C605e014b195FaA913e090e4BB9544FE3" });
      setMembers(mockMembers);
    }
  }

  useEffect(componentDidMount, []);

  return (
    <Box sx={formStyle}>
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
      <MemberList members={members} onRemoveMember={removeMember}/>
    </Box>
  );
}

export default CreateOrganizationForm;
