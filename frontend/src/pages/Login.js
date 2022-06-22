import {
  Button,
  CircularProgress,
  Divider,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from "@material-ui/core";
import { useContext, useState } from "react";
import axios from "axios";
import AuthContext from "../context/AuthProvider";

const useStyles = makeStyles((theme) => ({
  loginPage: {
    height: "100vh",

    "& .MuiDivider-root": {
      marginTop: 20,
      marginBottom: 20,
    },
  },
  loginForm: {
    width: 480,
    position: "relative",
    top: "50%",
    transform: "translateY(-50%)",
    padding: 16,
    margin: "auto",
    borderRadius: 20,

    "& .login-title": {
      fontWeight: 600,
      marginLeft: 180,
      color: "#e36510",
    },
    "& .login-type": {
      padding: 16,
      margin: "auto",
    },
    "& .butt": {
      color: "#000",
      marginLeft: 100,
      marginRight: 100,
    },
  },
  formContainer: {},
}));

export default function LoginPage() {
  const classes = useStyles();
  const [formValues, setFormValues] = useState({
    AdminEmail: "",
    AdminPassword: "",
  });
  const { Login } = useContext(AuthContext);
  const handleSubmit = () => {
    Login(formValues);
  };

  return (
    <div className={classes.loginPage}>
      <Paper className={classes.loginForm} variant="oulined">
        <Typography
          className="tittle-app"
          variant="h3"
          style={{
            fontWeight: 400,
            color: "#e36510",
          }}
        >
          E-Tulod
        </Typography>
        <Typography
          className="tittle-content"
          variant="h6"
          style={{
            fontWeight: 100,
            color: "#041175",
          }}
        >
          A local-tricycle ride-hailing application
        </Typography>
        <Divider variant="middle" />
        <div className={classes.formContainer}>
          <Paper className="login-type" variant="outlined">
            <Typography className="login-title" variant="h4">
              Admin
            </Typography>
            <Typography variant="h6">Admin Email: </Typography>

            <TextField
              name="email"
              variant="outlined"
              size="small"
              fullWidth
              required
              placeholder="example@gmail.com"
              autoComplete="off"
              onChange={(e) => {
                setFormValues((prevState) => ({
                  ...prevState,
                  AdminEmail: e.target.value,
                }));
              }}
            ></TextField>
            <Typography variant="h6">Admin Password:</Typography>
            <TextField
              type="password"
              name="password"
              variant="outlined"
              size="small"
              fullWidth
              style={{
                fontWeight: 100,
                borderColor: "yellow",
              }}
              required
              autoComplete="off"
              placeholder="********"
              onChange={(e) => {
                setFormValues((prevState) => ({
                  ...prevState,
                  AdminPassword: e.target.value,
                }));
              }}
            ></TextField>
          </Paper>
        </div>
        <Divider variant="middle" />
        <Button
          onClick={handleSubmit}
          variant="contained"
          style={{
            right: "-20%",
            borderRadius: 15,
            backgroundColor: "#e36510",
          }}
        >
          <Typography
            className="butt"
            style={{
              fontWeight: 100,
            }}
            variant="body1"
          >
            Login
          </Typography>
        </Button>
      </Paper>
    </div>
  );
}
