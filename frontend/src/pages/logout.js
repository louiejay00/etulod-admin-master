/* eslint-disable react/jsx-no-undef */
import { Box, Button, Paper } from "@material-ui/core";

import { useContext } from "react";

import AuthContext from "../context/AuthProvider";


export default function LogoutPage () {
  const { Logout } = useContext(AuthContext);
  return (
    <Box>
      <Paper>
        <Button onClick={Logout}>
          <h1 >Log Out</h1>
        </Button>
      </Paper>
    </Box>
  )
  
}







  

  
 

