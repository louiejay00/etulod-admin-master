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


export default function BasicTable() {
  const [revalidataReportsData, setRevalidateReportsData] = useState();

  return (
    <Box>
      <Paper>
      <Box p={2}>
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <Paper variant="outlined">
                <Box p={2}>
                  <Typography variant="h6">Reports</Typography>
                </Box>
              </Paper>
              <TransportationReportsTable
               revalidateData={revalidataReportsData}
                onDeleteButtonClicked={(data) => {
                  console.log("LOGS TO BE DELETED", data);

                  axios
                    .delete("/process/" + data._id)
                    .then((responseData) => {
                      console.log(responseData, "Deleted");
                    })
                    .catch((err) => {
                      console.log("Error deleting", data);
                      console.log(err.message);
                    })
                    .finally(() => {
                      setRevalidateReportsData((prevState) => !prevState);
                    });
                }}S
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

const TransportationReportsTable = ({
  onDeleteButtonClicked,
  revalidateData,
}) => {
  const [reports, setReports] = useState();
  useEffect(() => {
    fetchData();
  }, [revalidateData]);

  const fetchData = () => {
    axios
      .get("/process")
      .then((res) => {
        setReports(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  if (!reports) {
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
              <TableCell align="left">Passenger Name</TableCell>
              <TableCell align="left">Passenger Email</TableCell>
              <TableCell align="left">Driver Name</TableCell>
              <TableCell align="left">Destination</TableCell>
              <TableCell align="left">Location</TableCell>
              <TableCell align="left">Phone Number</TableCell>
              <TableCell align="left">Number of Passengers</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Rejected</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Completed</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((data) => (
              // eslint-disable-next-line react/no-array-index-key
              <TableRow>
                <TableCell component="th" scope="row">
                  {data.passengerName}
                </TableCell>
                <TableCell align="left">{data.passengerEmail}</TableCell>
                <TableCell align="left">{data.driverName}</TableCell>
                <TableCell align="left">{data.destination}</TableCell>
                <TableCell align="left">{data.location}</TableCell>
                <TableCell align="left">{data.cpnum}</TableCell>
                <TableCell align="left">{data.NoOfPassengers}</TableCell>
                <TableCell align="left">{data.status}</TableCell>
                {/* <TableCell align="left">Status</TableCell> */}
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