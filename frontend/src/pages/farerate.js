import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
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
import UpdateIcon from "@material-ui/icons/Update";
import axios from "axios";
import { Box } from "@mui/system";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import lightGreen from "@material-ui/core/colors/lightGreen";

const fields = [
  {
    label: "Pick-up To Destination",
    name: "destination",
  },
  {
    label: "Fare Rate",
    name: "fare",
  },
];
export default function FareRateManagementPage() {
  const [formValues, setFormValues] = useState({
    detination: "",
    fare: "",
  });

  const handleSubmit = () => {
    axios
      .post("/fare", {
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
          destination: "",
          fare: "",
        });
        setRevalidateFareRateData((prev) => !prev);
      });
  };

  const [updateFareRateModalOpen, setUpdateFareRateModalOpen] = useState(false);
  const [toBeUpdated, setToBeUpdated] = useState();

  const [revalidateFareRateData, setRevalidateFareRateData] = useState(false);
  return (
    <Box>
      <Paper>
        <Box p={2}>
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <Paper variant="outlined">
                <Box p={2}>
                  <Typography variant="h6">
                    Add Pick-up to Destination and Fare Rate
                  </Typography>
                  <Typography color="textSecondary" variant="body2">
                    Add new Pick-up to Destination and Fare Rate
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
              <FareRateTable
                revalidateData={revalidateFareRateData}
                onRowClick={(data) => {
                  // setToBeUpdated(data);
                }}
                onUpdateButtonClicked={(data) => {
                  console.log("updatebuttonclicked");
                  setToBeUpdated(data);
                  setUpdateFareRateModalOpen(true);
                }}
                onDeleteButtonClicked={(data) => {
                  console.log(" FARE RATE TO BE DELETED", data);

                  axios
                    .delete("/fare/" + data._id)
                    .then((responseData) => {
                      console.log(responseData, "Deleted");
                    })
                    .catch((err) => {
                      console.log("Error deleting ", data);
                      console.error(err.message);
                    })
                    .finally(() => {
                      setRevalidateFareRateData((prevState) => !prevState);
                    });
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
      {toBeUpdated && (
        <UpdateFareRateModal
          open={updateFareRateModalOpen}
          setOpen={setUpdateFareRateModalOpen}
          originalFormValues={toBeUpdated}
          triggerRevalidate={() => {
            setRevalidateFareRateData((prevState) => !prevState);
          }}
        />
      )}
    </Box>
  );
}

const FareRateTable = ({
  onRowClick,
  onUpdateButtonClicked,
  onDeleteButtonClicked,
  revalidateData,
}) => {
  const [fareRate, setFareRate] = useState();
  useEffect(() => {
    fetchData();
  }, [revalidateData]);

  const fetchData = () => {
    axios
      .get("/fare")
      .then((res) => {
        setFareRate(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  if (!fareRate) {
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
              <TableCell align="left">Pick-up toDestination</TableCell>
              <TableCell align="left">Fare Rate</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fareRate.map((row, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <TableRow
                onClick={() => {
                  onRowClick(row);
                }}
                style={{
                  cursor: "pointer",
                }}
                key={`${row.name}-${index}`}
              >
                <TableCell component="th" scope="row">
                  {row.destination}
                </TableCell>
                <TableCell align="left">{row.fare}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => {
                      onUpdateButtonClicked(row);
                    }}
                  >
                    <UpdateIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      onDeleteButtonClicked(row);
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

const UpdateFareRateModal = ({
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
      .patch("/fare/" + formValues._id, formValues)
      .then((res) => {
        console.log(res);
        console.log("Fare Rate Updated");
      })
      .catch((err) => {
        console.error("Error in fare rate Update", err);
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
            <Typography variant="h6">Modify Fare Rate</Typography>
            <Typography variant="body1">Change Fare Rates</Typography>
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
