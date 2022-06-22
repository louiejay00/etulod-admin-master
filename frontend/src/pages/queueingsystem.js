import {
    Button,
    CircularProgress,
    Divider,
    Grid,
    Typography,
    IconButton,
    ownerDocument,
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
  import Box from '@material-ui/core/Box';
  import axios from "axios";

  export default function TDQueueingSystem () {
    const [revalidateQueueData, setRevalidateQueuesData] = useState();
   
  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <Paper variant="outlined">
                <Box p={2}>
                 <Typography variant="h6">Tricycle Driver Queue</Typography>
                </Box>
              </Paper>
              <QueueingSystemTable
                revalidateData={revalidateQueueData}
                onDeleteButtonClicked={(data) => {
                  console.log("ADMIN TO BE DELETED", data);

                  axios
                    .delete("/queue/" + data._id)
                    .then((responseData) => {
                      console.log(responseData, "Deleted");
                    })
                    .catch((err) => {
                      console.log("Error deleting", data);
                      console.log(err.message);
                    })
                    .finally(() => {
                      setRevalidateQueuesData((prevState) => !prevState);
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

const QueueingSystemTable = ({
  revalidateData,
  onDeleteButtonClicked,
}) => {
  const [queueingSystem, setQueueingSystem] = useState();
  useEffect(() => {
    fetchData();
  }, [revalidateData]);

  const fetchData = () => {
    axios
      .get("/queue")
      .then((res) => {
        setQueueingSystem(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (!queueingSystem) {
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
  return(
          <Box>
              <Paper>
                <Box p={2}>
                  <Grid container spacing={2}>
                    <Grid item md={8} xs={12}>
                      <Paper variant="outlined">
                        <Box p={2}>
                          <Divider style={{ margin: "16px 0" }} />
                          <Box p={2}>
                            <TableContainer component={(props) => <Paper variant="outlined" {...props} />} >
                            <Table> 
                              <TableHead>
                                  <TableRow>
                                      <TableCell align="left">Drivers' Order Number</TableCell>
                                      <TableCell align="left">Drivers' Name</TableCell>
                                      <TableCell align="left"> Drivers' Address</TableCell>
                                      <TableCell align="left">Plate Number</TableCell>
                                      <TableCell align="left">Drivers' Phone Number</TableCell>  
                                    </TableRow>
                              </TableHead>    
                              <TableBody>
                              {queueingSystem.map((data) => (
                                <TableRow >
                                  <TableCell align="left">{data.ordernumber}</TableCell>
                                  <TableCell component="th" scope="row">
                                    {data.drivername}
                                  </TableCell>
                                  <TableCell align="left">{data.driveraddress}</TableCell>
                                  <TableCell align="left">{data.platenumber}</TableCell>
                                  <TableCell align="left">{data.drivercpnum}</TableCell>
                                  <TableCell align="left">
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
                        <Divider style={{ margin: "16px 0" }} />
                      <Box display="flex" justifyContent="flex-end">
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};


