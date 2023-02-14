import React, { useState, useContext, useEffect } from "react";
import clsx from "clsx";

import {
  makeStyles,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  MenuItem,
  IconButton,
  Menu,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";

import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Brightness4Icon from '@material-ui/icons/Brightness4';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import MainListItems from "./MainListItems";
import NotificationsPopOver from "../components/NotificationsPopOver";
import UserModal from "../components/UserModal";
import { AuthContext } from "../context/Auth/AuthContext";
import BackdropLoading from "../components/BackdropLoading";
import { i18n } from "../translate/i18n";
import toastError from "../errors/toastError";
import AnnouncementsPopover from "../components/AnnouncementsPopover";
import useCompanies from "../hooks/useCompanies";
import logo from "../assets/zapsimples.png";
import { socketConnection } from "../services/socket";
import ChatPopover from "../pages/Chat/ChatPopover";
import ColorModeContext from "../layout/themeContext";
import moment from "moment";
const drawerWidth = 300;


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: "100vh",
    [theme.breakpoints.down("sm")]: {
      height: "calc(100vh - 56px)",
    },
    backgroundColor: theme.palette.fancyBackground,
		'& .MuiButton-outlinedPrimary': {
			color: theme.mode === 'light' ? '#007C66' : '#FFF',
			border: theme.mode === 'light' ? '1px solid rgba(0 124 102)' : '1px solid rgba(255, 255, 255, 0.5)',
		},
		'& .MuiTab-textColorPrimary.Mui-selected': {
			color: theme.mode === 'light' ? '#007C66' : '#FFF',
		}
  },

  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
    
/*     color: "#FFFFFF",
    background: "linear-gradient(to right, #0891B2, #FFC107)", */
},
  toolbarIcon: {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 8px",
  minHeight: "48px",
},
  appBar: {
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
},
  appBarShift: {
  marginLeft: drawerWidth,
  width: `calc(100% - ${drawerWidth}px)`,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
},
  menuButton: {
  marginRight: 36,
},
  menuButtonHidden: {
  display: "none",
},
  title: {
  flexGrow: 1,
  fontSize: 14,
},
  drawerPaper: {
  position: "relative",
  whiteSpace: "nowrap",
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
},
  drawerPaperClose: {
  overflowX: "hidden",
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: theme.spacing(7),
  [theme.breakpoints.up("sm")]: {
    width: theme.spacing(9),
  },
},
  appBarSpacer: {
  minHeight: "48px",
},
  content: {
  flex: 1,
  overflow: "auto",
  ...theme.scrollbarStyles,
},
  container: {
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
},
  paper: {
  padding: theme.spacing(2),
  display: "flex",
  overflow: "auto",
  flexDirection: "column",
},
  containerWithScroll: {
  flex: 1,
  padding: theme.spacing(1),
  overflowY: "scroll",
  ...theme.scrollbarStyles,
},
}));

const LoggedInLayout = ({ children }) => {
  const classes = useStyles();
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const { handleLogout, loading } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [companyDueDate, setCompanyDueDate] = useState();
  const [drawerVariant, setDrawerVariant] = useState("permanent");
  const { user } = useContext(AuthContext);
  const { finding } = useCompanies();
	const { colorMode } = useContext(ColorModeContext);

  const theme = useTheme();
  const greaterThenSm = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    if (document.body.offsetWidth > 600) {
      setDrawerOpen(true);
    }
  }, []);

  const companyId = localStorage.getItem("companyId");
  const loadCompanies = async () => {
    try {
      const companiesList = await finding(companyId);
      setCompanyDueDate(moment(companiesList.dueDate).format("DD/MM/yyyy"));
    } catch (e) {

      // toast.error("Não foi possível carregar a lista de registros");
    }
  };

  useEffect(() => {
    async function fetchData() {
      await loadCompanies();
    }
    fetchData();
    if (document.body.offsetWidth < 600) {
      setDrawerVariant("temporary");
    } else {
      setDrawerVariant("permanent");
    }
  }, [drawerOpen]);

  useEffect(() => {
    const companyId = localStorage.getItem("companyId");
    const userId = localStorage.getItem("userId");

    const socket = socketConnection({ companyId });

    socket.on(`company-${companyId}-auth`, (data) => {
      if (data.user.id === +userId) {
        toastError("Sua conta foi acessada em outro computador.");
        setTimeout(() => {
          localStorage.clear();
          window.location.reload();
        }, 1000);
      }
    });

    socket.emit("userStatus");
    const interval = setInterval(() => {
      socket.emit("userStatus");
    }, 1000 * 60 * 5);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  };

  const toggleColorMode = () => {
		colorMode.toggleColorMode();
	}

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleOpenUserModal = () => {
    setUserModalOpen(true);
    handleCloseMenu();
  };

  const handleClickLogout = () => {
    handleCloseMenu();
    handleLogout();
  };

  const drawerClose = () => {
    if (document.body.offsetWidth < 600) {
      setDrawerOpen(false);
    }
  };

  if (loading) {
    return <BackdropLoading />;
  }




  return (
    <div className={classes.root}>
      <Drawer
        variant={drawerVariant}
        className={drawerOpen ? classes.drawerPaper : classes.drawerPaperClose}
        classes={{
          paper: clsx(
            classes.drawerPaper,
            !drawerOpen && classes.drawerPaperClose
          ),
        }}
        open={drawerOpen}
      >
        <div className={classes.toolbarIcon}>
          <img src={logo} style={{ margin: "0 auto", height: "50px", width: "100%" }} alt="logo" />
          <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List className={classes.containerWithScroll}>
          <MainListItems drawerClose={drawerClose} />
        </List>
        <Divider />
      </Drawer>
      <UserModal
        open={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        userId={user?.id}
      />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}
        color={theme.mode === "light" ? "primary" : "inherit"}
        //color="primary"
      >
        <Toolbar variant="dense" className={classes.toolbar}>
          <IconButton
            edge="start"
            variant="contained"
            aria-label="open drawer"
            onClick={() => setDrawerOpen(!drawerOpen)}
            className={clsx(
              classes.menuButton,
              drawerOpen && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component="h1"
            variant="h6"
            style={{color: "white"}}
            noWrap
            className={classes.title}
          >
            {greaterThenSm ? (
              <>
                Olá <b>{user.name}</b>, Seja bem-vindo - Acesso válido até: {companyDueDate}.
              </>
            ) : (
              user.name
            )}
          </Typography>
          {user.id && <NotificationsPopOver />}

          <AnnouncementsPopover />

          <ChatPopover />

          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              variant="contained"

            >
              <AccountCircle style={{ color: "white" }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={menuOpen}
              onClose={handleCloseMenu}
            >
              <MenuItem onClick={handleOpenUserModal}>
                {i18n.t("mainDrawer.appBar.user.profile")}
              </MenuItem>
              <MenuItem onClick={handleClickLogout}>
                {i18n.t("mainDrawer.appBar.user.logout")}
              </MenuItem>
            </Menu>
          </div>
          <IconButton edge="start" onClick={toggleColorMode} color="inherit">
						{theme.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
					</IconButton>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />

        {children ? children : null}
      </main>
    </div>
  );
};

export default LoggedInLayout;