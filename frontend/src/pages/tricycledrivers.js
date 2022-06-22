/* eslint-disable no-undef */
import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  TextField,
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
import UpdateIcon from "@material-ui/icons/Update";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import { Box } from "@mui/system";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import lightGreen from "@material-ui/core/colors/lightGreen";
import axios from "axios";
import useSWR from 'swr';




const fields = [

  {
    label: "Drivers' Name",
    name: "drivername",
  },
  {
    label: "Drivers' Address",
    name: "driveraddress",
  },
  {
    label: "Plate Number",
    name: "platenumber",
  },
  {
    label: "Drivers' Phone Number",
    name: "drivercpnum",
  },

];


export default function TDManagementPage() {
  const [formValues, setFormValues] = useState(
    {
    drivername: "",
    driveraddress: "",
    platenumber: "",
    drivercpnum: "",
    ordernumber: "",
    }
  );
  const {
    data,
    error,
    isValidating: loading,
} = useSWR(
    formValues,
);

  if (data) {
      data.map((ea)=> {
        <div>{JSON.stringify(ea, null, 2)}</div>;
      }) 
  }

  if (loading) {
    <CircularProgress color="primary" size={72} thickness={8} />;
  }
  if (error) {
   message.error(error);
  }

  const handleSubmit = () => {
    axios
      .post("/driver", {
        ...formValues,
      })
      .then((res) => {
        console.log("res", res);
        console.log("responseData", res.data);
      })
      .catch((err) => {
        console.error("error in user Creation", err);
      })
      .finally(() => {
        setFormValues({
          drivername: "",
          driveraddress: "",
          platenumber: "",
          drivercpnum: "",
          ordernumber: "",  
        });
        setRevalidateDriverData((prev) => !prev);
      });
  };

  const [updateDriverModalOpen, setUpdateDriverModalOpen] = useState();
  const [toBeUpdated, setToBeUpdated] = useState();

  const [revalidateDriverData, setRevalidateDriverData] = useState();

  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <Paper variant="outlined">
                <Box p={2}>
                  <Typography variant="h6">Add Tricycle Driver</Typography>
                  <Typography color="textSecondary" variant="body2">
                    Add new Tricycle Driver
                  </Typography>
                  <Divider style={{ margin: "16px 0" }} />
                  <Box p={2}>
                    {fields.map((ea) => (
                      <Box key={ea.label}>
                        <Typography variant="body2">{ea.label}</Typography>
                        <TextField
                          variant="outlined"
                          size="small"
                          name={ea.name}
                          fullWidth
                          onChange={(e) => {
                           setFormValues((prevState) => ({
                              ...prevState,
                              [e.target.name]: e.target.value,
                            }));
                          }}
                          value={formValues[ea.name]}
                        />
                      </Box>
                    ))}
                  </Box>
                  <Divider style={{ margin: "16px 0" }} />
                  <Box display="flex" justifyContent="flex-end">
                    <Button
                      disableElevation
                      color="primary"
                      variant="contained"
                      // onClick={handleSubmit}
                      onClick={handleSubmit}
                    >
                      Confirm
                    </Button>
                  </Box>
                </Box>
              </Paper>
              <TricycleDriverTable
                revalidateData={revalidateDriverData}
                onRowClick={(data) => {
                  setToBeUpdated(data);
                }}
                onUpdateButtonClicked={(data) => {
                  console.log("updatebuttonclicked");
                  setToBeUpdated(data);
                  setUpdateDriverModalOpen(true);
                }}
                onDeleteButtonClicked={(data) => {
                  console.log("DRIVER TO BE DELETED", data);

                  axios
                    .delete("/driver/" + data._id)
                    .then((responseData) => {
                      console.log(responseData, "Deleted");
                    })
                    .catch((err) => {
                      console.log("Error deleting", data);
                      console.log(err.message);
                    })
                    .finally(() => {
                      setRevalidateDriverData((prevState) => !prevState);
                    });
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
      {toBeUpdated && (
        <UpdateTricycleDriverModal
          open={updateDriverModalOpen}
          setOpen={setUpdateDriverModalOpen}
          originalFormValues={toBeUpdated}
          triggerRevalidate={() => {
            setRevalidateDriverData((prevState) => !prevState);
          }}
        />
      )}
    </Box>
  );
}


const TricycleDriverTable = ({
  onRowClick,
  onUpdateButtonClicked,
  onDeleteButtonClicked,
  revalidateData,
}) => {

  const [tricycleDrivers, setTricycleDrivers] = useState();
  useEffect(() => {
    fetchData();
  }, [revalidateData]);

  const fetchData = () => {
    axios
      .get("/driver")
      .then((res) => {
        setTricycleDrivers(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (!tricycleDrivers) {
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
              <TableCell align="left">Drivers' Order</TableCell>
              <TableCell align="left"> Drivers' Name</TableCell>
              <TableCell align="left">Drivers' Address</TableCell>

              <TableCell align="left">Drivers' Plate Number</TableCell>
              <TableCell align="left">Drivers' Phone Number</TableCell>
              <TableCell align="left">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tricycleDrivers.map((data) =>(
              <TableRow>
                <TableCell align="left">{data.ordernumber}</TableCell>
                <TableCell component="th" scope="row">
                  {data.drivername}
                </TableCell>
                <TableCell align="left">{data.driveraddress}</TableCell>
                <TableCell align="left">{data.platenumber}</TableCell>
                <TableCell align="left">{data.drivercpnum}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      onUpdateButtonClicked(data);
                    }}
                  >
                    <UpdateIcon />
                  </IconButton>
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


const UpdateTricycleDriverModal = ({
  originalFormValues,
  open,
  setOpen,
  triggerRevalidate,
}) => {
 

  const [formValues, setFormValues] = useState(originalFormValues);

  useEffect(() => {
    setFormValues(originalFormValues);
  }, [originalFormValues]);

  const handleUpdate = () => {
    axios
      .patch("/driver/" + formValues._id, formValues)
      .then((res) => {
        console.log(res);
        console.log("Driver Updated");
      })
      .catch((err) => {
        console.error("Error in driver Update", err);
      })
      .finally(() => {
        triggerRevalidate();
      });
  };
  return (
    <Modal
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <Paper>
          <Box p={2}>
            <Typography variant="h6">Modify Drivers</Typography>
            <Typography variant="body1">Change Drivers</Typography>
            <Divider style={{ margin: "16px 0" }} />
            <Box>
              {fields.map((ea) => (
                <Box key={ea.name}>
                  <Typography variant="body2">{ea.label}</Typography>
                  <TextField
                    variant="outlined"
                    size="small"
                    name={ea.name}
                    multiline
                    fullWidth
                    onChange={(e) => {
                      setFormValues((updateState) => ({
                        ...updateState,
                        [e.target.name]: e.target.value,
                      }));
                    }}
                    defaultValue={formValues[ea.name] || ""}
                  />
                </Box>
              ))}
            </Box>
            <Box my={2}>
              <Divider />
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Button
                disableElevation
                color="default"
                variant="contained"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                style={{
                  background: lightGreen["A700"],
                }}
                disableElevation
                variant="contained"
                onClick={handleUpdate}
              >
                Save
              </Button>
            </Box>
          </Box>
        </Paper>
      </Fade>
    </Modal>
  );
};
