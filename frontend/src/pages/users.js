import {
  CircularProgress,
  Grid,
  Typography,
  IconButton,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core/";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import axios from "axios";
import { Box } from "@mui/system";


export default function UserManagementPage() {

  const [revalidateUsersData, setRevalidateUsersData] = useState();
  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <Paper variant="outlined">
                <Box p={2}>
                  <Typography variant="h6">User Information</Typography>
                </Box>
              </Paper>
              <UsersTable
                revalidateData={revalidateUsersData}
                onDeleteButtonClicked={(data) => {
                  console.log("USER TO BE DELETED", data);

                  axios
                    .delete("/user/" + data._id)
                    .then((responseData) => {
                      console.log(responseData, "Deleted");
                    })
                    .catch((err) => {
                      console.log("Error deleting", data);
                      console.log(err.message);
                    })
                    .finally(() => {
                      setRevalidateUsersData((prevState) => !prevState);
                    });
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

const UsersTable = ({
  onDeleteButtonClicked,
  revalidateData,
}) => {
  const [users, setUsers] = useState();
  useEffect(() => {
    fetchData();
  }, [revalidateData]);
  const fetchData = () => {
    axios
      .get("/user")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  if (!users) {
    return (
      <Paper
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
        variant="outlined"
      >
        <CircularProgress color="primary" size={72} thickness={8} />
      </Paper>
    );
  }
  return (
    <Box mt={2}>
      <TableContainer
        component={(props) => <Paper variant="outlined" {...props} />}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Name</TableCell>
              <TableCell align="left">Email</TableCell>
              <TableCell align="left">Password</TableCell>
              <TableCell align="left">Date of Birth</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((data) => (
              // eslint-disable-next-line react/no-array-index-key
              <TableRow>
                <TableCell component="th" scope="row">
                  {data.name}
                </TableCell>
                <TableCell align="left">{data.email}</TableCell>
                <TableCell align="left">{data.password}</TableCell>
                <TableCell align="left">{data.dateOfBirth}</TableCell>
                <TableCell>
                  
                  <IconButton
                    onClick={() => {
                      onDeleteButtonClicked(data);
                    }}
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};


