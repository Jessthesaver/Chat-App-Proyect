import * as React from "react";
import PropTypes from "prop-types";
import MenuIcon from "@mui/icons-material/Menu";
import BasicTabs from "./consts/BasicTabs";
import FriendRequests from "./FriendRequests";
import Settings from "./Settings";
import { navbarStyles } from "./styles";
import {
  Avatar,
  Badge,
  Chip,
  Grid,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "./consts/avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Outlet, useParams } from "react-router-dom";
import { useSubscription } from "@apollo/client";
import FRIEND_REQUEST from "../../graphql/subscriptions/friendRequestgql.js";
import GROUP_CHANGED from "../../graphql/subscriptions/groupChangeGql.js";

const drawerWidth = 275;
function ResponsiveDrawer(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const { chatId } = useParams();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const { username, requests, rooms } = useSelector(
    (state) => state.user.value
  );

  const current = rooms?.find((room) => room._id === chatId);

  const open = Boolean(anchorEl);

  const newNotifications = "pending Requests";

  const handleClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    event.preventDefault();
    setAnchorEl(null);
  };

  const handleLogout = (event) => {
    event.preventDefault();

    const cookieInput = {
      name: "JWT",
    };

    dispatch({
      type: "logout",
      payload: { cookieInput },
    });
  };

  useSubscription(FRIEND_REQUEST, {
    onData: ({ data }) => {
      dispatch({
        type: "addNewRequest",
        payload: data?.data.addFriend,
      });
    },
  });

  useSubscription(GROUP_CHANGED, {
    onData: ({ data }) => {
      const { groupChanged } = data?.data;
      const user = groupChanged.members.find(
        (user) => user.username === username
      );
      if (user) {
        dispatch({
          type: "groupChanges",
        });

        if (
          groupChanged.isDeleted &&
          groupChanged.groupalChat &&
          chatId === groupChanged._id
        ) {
          navigate("/");
        }
      }
    },
  });

  const drawer = (
    <Grid
      container
      sx={{
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}>
      <Grid container sx={navbarStyles.avatar}>
        <Grid item xs={2}>
          <Tooltip title={requests.length ? newNotifications : null}>
            <IconButton onClick={handleClick}>
              <Badge badgeContent={requests.length} color="secondary">
                <MoreVertIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}>
            <MenuItem onClick={handleLogout}>
              <Typography>{"Log out"}</Typography>
            </MenuItem>
            <Settings />
            <FriendRequests />
          </Menu>
        </Grid>
        <Grid item xs={7}>
          <Typography
            variant="h5"
            component="div"
            sx={{
              width: "100%",
            }}>
            {username}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Image />
        </Grid>
      </Grid>
      <Divider />
      <Box
        sx={{
          width: "100%",
          overflow: "hidden",
          height: { xs: "100%", sm: "93%", md: "90%" },
        }}>
        <BasicTabs />
      </Box>
      <Divider />
    </Grid>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: {
          xs: "100vh",
          md: "100vh",
          lg: "100vh",
        },
        zIndex: 0,
      }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          height: { xs: "70px" },
          ml: { md: `${drawerWidth}px` },
        }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}>
            <MenuIcon />
          </IconButton>

          <Box component="div">
            <Typography variant="h6" noWrap component="div">
              {current?.name}
            </Typography>
            {current?.name ? (
              <Stack direction="row" spacing={1} sx={{}}>
                <Typography variant="body1">{`${"members"}:`}</Typography>
                {current?.members.map((user) => {
                  return (
                    <Chip
                      key={user.username}
                      avatar={<Avatar src={user.avatar} />}
                      label={user.username}
                      sx={{
                        backgroundColor: "rgba(175, 205, 175, 0.8)",
                        fontWeight: "bold",
                        boxShadow: "5px 2px 2px rgba(74, 76, 74, 0.8)",
                        color: "whitesmoke",
                      }}
                    />
                  );
                })}
              </Stack>
            ) : (
              ""
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
        aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}

        <Drawer
          variant="permanent"
          sx={{
            display: {
              xs: "none",
              sm: "none",
              md: "block",
            },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open>
          {drawer}
        </Drawer>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: {
              xs: "block",
              sm: "block",
              md: "none",
            },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}>
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          height: {
            xs: "130vh",
            sm: "130vh",
            md: "77vh",
          },
        }}>
        <Toolbar />

        <Outlet />
      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;
