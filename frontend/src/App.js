import {
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from "@material-ui/core";
import Drawer from "./components/Layout/Drawer";
import { useContext, useEffect, useMemo } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import IndexPage from "./pages/index";
import AdminManagementPage from "./pages/admin";
import UserManagementPage from "./pages/users";
import TDManagementPage from "./pages/tricycledrivers";
import TDQueueingSystem from "./pages/queueingsystem";
import FareRatePage from "./pages/farerate";
import TransportationLogsPage from "./pages/transportationlogs";
import PageNotFound from "./components/screens/PageNotFound";
import LogoutPage from "./pages/logout";
import LoginPage from "./pages/Login";
import axios from "axios";
import AuthContext from "./context/AuthProvider";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const { auth } = useContext(AuthContext);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          //Color Scheme to activate
          type: prefersDarkMode ? "dark" : "light",
          primary: {
            main: "#1a237e",
          },
          secondary: {
            main: "#f4511e",
          },
        },
        //default Material UI Component Props
        props: {
          MuiButton: {
            size: "small",
          },
          MuiFilledInput: {
            margin: "dense",
          },
          MuiFormControl: {
            margin: "dense",
          },
          MuiFormHelperText: {
            margin: "dense",
          },
          MuiIconButton: {
            size: "small",
          },
          MuiInputBase: {
            margin: "dense",
          },
          MuiInputLabel: {
            margin: "dense",
          },
          MuiListItem: {
            dense: true,
          },
          MuiOutlinedInput: {
            margin: "dense",
          },
          MuiFab: {
            size: "small",
          },
          MuiTable: {
            size: "small",
          },
          MuiTextField: {
            margin: "dense",
          },
          MuiToolbar: {
            variant: "dense",
          },
        },
        //Setting fontfamily for typography components
        typography: {
          htmlFontSize: 16,
          fontSize: 16,
          fontFamily: [
            "Montserrat",
            "-apple-system",
            "BlinkMacSystemFont",
            "Roboto",
            "Oxygen",
          ].join(","),
        },
      }),
    [prefersDarkMode]
  );

  const routes = useMemo(
    () => [
      {
        title: "Dashboard",
        url: "/",
        exact: true,
        component: () => <IndexPage />,
      },
      {
        title: "Admin Management",
        url: "/admin",
        component: () => <AdminManagementPage />,
      },
      {
        title: "User Management",
        url: "/users",
        component: () => <UserManagementPage />,
      },
      {
        title: "TD Management",
        url: "/tricycledrivers",
        component: () => <TDManagementPage />,
      },
      {
        title: "TD Queueing System",
        url: "/tdqueueingsystem",
        component: () => <TDQueueingSystem />,
      },
      {
        title: "Fare Rate",
        url: "/farerate",
        component: () => <FareRatePage />,
      },
      {
        title: "Transportation Logs",
        url: "/transportationlogs",
        component: () => <TransportationLogsPage />,
      },
      {
        title: "Configurations",
        url: "/configurations",
      },
      {
        title: "Logout",
        url: "/logout",
        component: () => <LogoutPage />,
      },
    ],
    [auth]
  );

  useEffect(() => {
    axios.defaults.baseURL = process.env.BACKEND_URL;
  }, []);
  console.log({ auth });
  if (!auth) {
    return <LoginPage />;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Drawer>
            <Switch>
              {routes.map((ea) => (
                <Route
                  key={ea.title}
                  path={ea.url}
                  {...(ea.exact && { exact: true })}
                >
                  {ea?.component ? <ea.component /> : <PageNotFound />}
                </Route>
              ))}
            </Switch>
          </Drawer>
        </Router>
        {/* <Index /> */}
      </ThemeProvider>
    </>
  );
}

export default App;
