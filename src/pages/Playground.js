import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import {
  Box,
  CssBaseline,
  Drawer as MuiDrawer,
  Divider,
  IconButton,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import SidebarContent from "../components/sidebar/SidebarContent";
import RoomClipboard from "../components/sidebar/roomClipboard";
import ReconnectionSlide from "../components/slides/ReconnectionSlide";
import socket from "../socket";

const drawerWidth = 240;


const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    height: "100dvh",
    minWidth: "80vw",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
      marginLeft: `calc(${theme.spacing(8)} + 1px)`,
    },
    ...(open && {
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);


const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    backgroundColor: theme.palette.background.default,
    // THEME BORDER: Crisp separation line
    borderRight: `1px solid ${theme.palette.divider}`, 
    ...(open
      ? {
          width: drawerWidth,
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: "hidden",
        }
      : {
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          overflowX: "hidden",
          width: `calc(${theme.spacing(7)} + 1px)`,
          [theme.breakpoints.up("sm")]: {
            width: `calc(${theme.spacing(8)} + 1px)`,
          },
        }),
  },
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function Playground() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [showReconnect, setShowReconnect] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [roomName, setRoomName] = useState(null);
  const [username, setUsername] = useState(null);
  const [senderId, setSenderId] = useState(null);
  const [users, setUsers] = useState(new Set());

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // Reconnection Logic
  const attemptReconnect = () => {
    if (isReconnecting) return;
    setIsReconnecting(true);
    setRetryCount((prev) => prev + 1);
    const storedUserId = localStorage.getItem("userId");
    const storedRoomName = localStorage.getItem("roomName");
    const storedUsername = localStorage.getItem("username");
    if (!storedUserId || !storedRoomName || !storedUsername) {
      setIsReconnecting(false);
      return;
    }
    if (!socket.connected) socket.connect();
    socket.emit("joinRoom", { roomName: storedRoomName, userId: storedUserId, username: storedUsername });
    setTimeout(() => { if (!isActive) setIsReconnecting(false); }, 8000);
  };

  useEffect(() => {
    const handleDisconnect = () => { setIsActive(false); setShowReconnect(true); setIsReconnecting(false); };
    const handleConnect = () => { setIsActive(true); setShowReconnect(false); setIsReconnecting(false); setRetryCount(0); };
    socket.on("disconnect", handleDisconnect);
    socket.on("connect", handleConnect);
    if (!socket.connected) { setShowReconnect(true); setIsActive(false); }
    return () => { socket.off("disconnect", handleDisconnect); socket.off("connect", handleConnect); };
  }, []);

  useEffect(() => {
    const sId = localStorage.getItem("userId");
    const sRoom = localStorage.getItem("roomName");
    const sUser = localStorage.getItem("username");
    if (sId && sRoom && sUser) {
      setSenderId(sId); setRoomName(sRoom); setUsername(sUser);
      if (socket.connected) socket.emit("joinRoom", { roomName: sRoom, userId: sId, username: sUser });
    }
  }, []);

  const handleLeaveRoom = () => {
    if (roomName && senderId) socket.emit("leaveRoom", { roomName, userId: senderId, username });
    localStorage.removeItem("roomName"); localStorage.removeItem("userId"); localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <Box sx={{ display: "flex", width: "100vw", height: "100dvh", overflow: "hidden", bgcolor: "background.default" }}>
      <CssBaseline />

      <Drawer variant="permanent" open={open}>
        <SidebarContent
          open={open}
          users={users}
          username={username}
          roomName={roomName}
          onLeave={handleLeaveRoom}
        />
        <Divider sx={{ borderColor: "divider" }} />

        <DrawerHeader sx={{ justifyContent: open ? "space-between" : "center" , mt:2.5, mb:2}}>
          {open && (
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-start" }}>
              <RoomClipboard roomName={roomName} />
            </Box>
          )}
          <IconButton onClick={open ? handleDrawerClose : handleDrawerOpen}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
      </Drawer>

      <Main open={open}>
        <Outlet
          context={{
            senderId, roomName, username, users, setUsers,
            showReconnect, setShowReconnect, isActive, setIsActive,
            isReconnecting, setIsReconnecting, retryCount, setRetryCount, attemptReconnect,
          }}
        />
        <ReconnectionSlide
          showReconnect={showReconnect}
          isActive={isActive}
          attemptReconnect={attemptReconnect}
          isReconnecting={isReconnecting}
          retryCount={retryCount}
          roomName={roomName}
        />
      </Main>
    </Box>
  );
}