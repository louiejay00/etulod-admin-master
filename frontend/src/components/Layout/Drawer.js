import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import QueueIcon from '@material-ui/icons/Queue';
import ListItemText from "@material-ui/core/ListItemText";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { Home, Motorcycle, Settings, RateReview } from "@material-ui/icons";
import { Box } from "@material-ui/core";
import { useHistory, useLocation } from "react-router-dom";
import logo from "./../../assets/logo.png"
const drawerWidth = 320;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  listItem: {
    transition: theme.transitions.create(["color"], {
      duration: "500ms",
      easing: theme.transitions.easing.easeInOut,
    }),
    "&:hover": {
      color: theme.palette.secondary.main,
      "& .MuiListItemIcon-root": {
        color: theme.palette.secondary.main,
        transition: theme.transitions.create(["color"], {
          duration: "250ms",
          delay: "150ms",
          easing: theme.transitions.easing.easeInOut,
        }),
        // color: "red",
      },
    },
  },
}));

export default function PersistentDrawerLeft({ children }) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const listMenuitems = useMemo(() => {
    return [
      {
        title: "Dashboard",
        url: "/",
        icon: <Home />,
        divided: true,
      },
      {
        title: "Admin Management",
        url: "/admin",
        icon: <AccountCircleIcon />,
      },
      {
        title: "User Management",
        url: "/users",
        icon: <AccountCircleIcon />,
      },
      {
        title: "TD Management",
        url: "/tricycledrivers",
        icon: <Motorcycle />,
      },
      {
        title: "TD Queueing System",
        url: "/tdqueueingsystem",
        icon: <QueueIcon />,
      },
      {
        title: "Fare Rate",
        url: "/farerate",
        icon: <RateReview />,
      },
      {
        title: "Transportation Logs",
        url: "/transportationlogs",
        icon: <RateReview />,
      },
      {
        title: "Configurations",
        url: "/configurations",
        icon: <Settings />,
      },
      {
        title: "Logout",
        url: "/logout",
        icon: <ExitToAppIcon />,
      },
    ];
  }, []);

  const location = useLocation();
  const currentPath = useMemo(() => {
    return (
      listMenuitems.find((fi) => fi.url === location.pathname)?.title ||
      "E-Tulod Admin"
    );
  }, [listMenuitems, location.pathname]);
  useEffect(() => {
    console.log(location);
  }, [location]);

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar variant="regular">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {currentPath}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </div>
        <Box p={2}>
          <div
            style={{
              height: 128,
              width: "100%",
              background: theme.palette.secondary.main,
              textAlign: "center",
              borderRadius: 8,
            }}
          >
            <Typography
              style={{
                position: "relative",
                top: "50%",
                transform: "translateY(-50%)",
                fontWeight: 700,
              }}
              variant="h6"
            >
              <span
                style={{
                  display: "block",
                }}
              >
              </span>
              <span
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  padding: `2px 16px`,
                  border: `2px solid currentColor`,
                  borderRadius: 4,
                }}
              >
              </span>
            </Typography>
          </div>
        </Box>
        <div>
          <Divider />
          {listMenuitems.map((each, index) => (
            <ListItem
              dense={false}
              className={classes.listItem}
              button
              key={each.title}
              component="a"
              href={each.url}
              onClick={(e) => {
                e.preventDefault();
                history.push(each.url);
                // history?.push(each.url);
              }}
            >
              <ListItemIcon>{each.icon}</ListItemIcon>
              <ListItemText>
                <Typography variant="body1">{each.title}</Typography>
              </ListItemText>
            </ListItem>
          ))}

          <Divider />
        </div>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {children}
      </main>
    </div>
  );
}
