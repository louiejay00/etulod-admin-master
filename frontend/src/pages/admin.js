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
import axios from "axios";
import { Box } from "@mui/system";
import Modal from "@material-ui/core/Modal";
import Fade from "@material-ui/core/Fade";
import Backdrop from "@material-ui/core/Backdrop";
import lightGreen from "@material-ui/core/colors/lightGreen";

const fields = [
  {
    label: "Admin Name",
    name: "AdminName",
  },
  {
    label: "Admin Email",
    name: "AdminEmail",
  },
  {
    label: "Admin Password",
    name: "AdminPassword",
  },
  {
    label: "Admin Date of Birth",
    name: "AdminDateOfBirth",
  },
];
export default function AdminManagementPage() {
  const [formValues, setFormValues] = useState({
    AdminName: "",
    AdminEmail: "",
    AdminPassword: "",
    AdminDateOfBirth: "",
  });

  const handleSubmit = () => {
    axios
      .post("/admin", {
        ...formValues,
      })
      .then((res) => {
        console.log("res", res);
        console.log("res", res.data);
      })
      .catch((err) => {
        console.error("error in log Creation", err);
      })
      .finally(() => {
        setFormValues({
          AdminName: "",
          AdminEmail: "",
          AdminPassword: "",
          AdminDateOfBirth: "",
        });
        setRevalidateAdminData((prev) => !prev);
      });
  };
  const [updateAdminModalOpen, setUpdateAdminModalOpen] = useState();
  const [toBeUpdated, setToBeUpdated] = useState();

  const [revalidateAdminData, setRevalidateAdminData] = useState();

  return (
    <Box>
      <Paper>
        <Box p={4}>
          <Grid container spacing={2}>
            <Grid item md={8} xs={12}>
              <Paper variant="outlined">
                <Box p={2}>
                  <Typography variant="h6">Add Admin</Typography>
                  <Typography color="textSecondary" variant="body2">
                    Add new Admin
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
             <AdminTable
                revalidateData={revalidateAdminData}
                onRowClick={(data) => {
                  // setToBeUpdated(data);
                }}
                onUpdateButtonClicked={(data) => {
                  console.log("updatebuttonclicked");
                  setToBeUpdated(data);
                  setUpdateAdminModalOpen(true);
                }}
                onDeleteButtonClicked={(data) => {
                  console.log("ADMIN TO BE DELETED", data);

                  axios
                    .delete("/admin/" + data._id)
                    .then((responseData) => {
                      console.lod(responseData, "Deleted");
                    })
                    .catch((err) => {
                      console.log("Error deleting", data);
                      console.log(err.message);
                    })
                    .finally(() => {
                      setRevalidateAdminData((prevState) => !prevState);
                    });
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
      {toBeUpdated && (
        <UpdateAdminModal
          open={updateAdminModalOpen}
          setOpen={setUpdateAdminModalOpen}
          originalFormValues={toBeUpdated}
          triggerRevalidate={() => {
            setRevalidateAdminData((prevState) => !prevState);
          }}
        />
      )}
    </Box>
  );
}

const AdminTable = ({
  onRowClick,
  onUpdateButtonClicked,
  onDeleteButtonClicked,
  revalidateData,
}) => {
  const [admins, setAdmins] = useState();
  useEffect(() => {
    fetchData();
  }, [revalidateData]);

  const fetchData = () => {
    axios
      .get("/admin")
      .then((res) => {
        setAdmins(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };
  if (!admins) {
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
              <TableCell align="left">Admins Name</TableCell>
              <TableCell align="left"> Admins Email</TableCell>
              <TableCell align="left">Admin Password</TableCell>
              <TableCell align="left">Date of Birth</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((data) => (
              <TableRow>
                <TableCell component="th" scope="row">
                  {data.AdminName}
                </TableCell>
                <TableCell align="left">{data.AdminEmail}</TableCell>
                <TableCell align="left">{data.AdminPassword}</TableCell>
                <TableCell align="left">{data.AdminDateOfBirth}</TableCell>
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

const UpdateAdminModal = ({
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
      .patch("/admin/" + formValues._id, formValues)
      .then((res) => {
        console.log(res);
        console.log("Admin Updated");
      })
      .catch((err) => {
        console.error("Error in Admin Update", err);
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
