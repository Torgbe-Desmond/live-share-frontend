import React, { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Box, Divider, IconButton, CssBaseline, styled } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import socket from "../socket";
import SidebarContent from "../components/sidebar/SidebarContent";
import RoomClipboard from "../components/sidebar/roomClipboard";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    height: "100dvh",
    width: "100%",
    overflowX: "hidden", // Crucial: prevents scrollbars when chat slides
    transition: theme.transitions.create(["margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      marginLeft: `calc(${theme.spacing(8)} + 1px)`,
    },
    ...(open && {
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(["margin"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    zIndex: theme.zIndex.drawer + 1, // Stay above the sliding main content
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      backgroundColor: theme.palette.background.paper,
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: open ? theme.transitions.duration.enteringScreen : theme.transitions.duration.leavingScreen,
      }),
      ...(!open && {
        width: `calc(${theme.spacing(7)} + 1px)`,
        [theme.breakpoints.up("sm")]: {
          width: `calc(${theme.spacing(8)} + 1px)`,
        },
      }),
    },
  })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function PlaygroundLayout() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState(new Set());
  const roomName = localStorage.getItem("roomName");
  const username = localStorage.getItem("username");
  const senderId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleLeaveRoom = () => {
    if (roomName && senderId) {
      socket.emit("leaveRoom", { roomName, userId: senderId, username });
    }
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100dvh", overflow: "hidden" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <SidebarContent 
          open={open} 
          users={users} 
          username={username} 
          roomName={roomName} 
          onLeave={handleLeaveRoom} 
        />
        <Divider sx={{ mb: 1 }} />
        <DrawerHeader sx={{ justifyContent: open ? "space-between" : "center", width: "100%" }}>
          {open && <RoomClipboard roomName={roomName} />}
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
      </Drawer>
      <Main open={open}>
        {/* Pass state to children via context */}
        <Outlet context={{ open, setUsers, users, senderId, roomName, username }} />
      </Main>
    </Box>
  );
}