import React, { useState } from "react";
import { Box, Drawer, useMediaQuery, useTheme } from "@mui/material";

import { useChat } from "../context/chatContext";
import SidebarContent from "../components/sidebar/SidebarContent";
import { Outlet } from "react-router-dom";
import { styled } from "@mui/material/styles";
import ChatHeader from "../components/header/ChatHeader";

const drawerWidth = 280;
const collapsedWidth = 72;

const StyledDrawer = styled(Drawer)(({ theme, open }) => ({
  width: open ? drawerWidth : collapsedWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  "& .MuiDrawer-paper": {
    width: open ? drawerWidth : collapsedWidth,
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      duration: theme.transitions.duration.standard,
    }),
  },
}));

function GroupChatLayout() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    isActive,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    users,
    roomName,
    username,
    handleLeaveRoom,
  } = useChat();

  return (
    <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <ChatHeader
        isMobile={isMobile}
        onMenuClick={() => setMobileDrawerOpen(true)}
        isActive={isActive}
      />

      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Sidebar */}
        {/* {isMobile ? (
          <Drawer
            anchor="left"
            open={mobileDrawerOpen}
            onClose={() => setMobileDrawerOpen(false)}
            sx={{ "& .MuiDrawer-paper": { width: 280 } }}
          >
            <SidebarContent
              users={users}
              roomName={roomName}
              username={username}
              onLeaveRoom={handleLeaveRoom}
            />
          </Drawer>
        ) : (
          <Box
            sx={{
              width: 280,
              borderRight: "1px solid #eee",
              display: { xs: "none", md: "block" },
            }}
          >
            <SidebarContent
              users={users}
              roomName={roomName}
              username={username}
              onLeaveRoom={handleLeaveRoom}
            />
          </Box>
        )} */}

        <StyledDrawer variant="permanent" open={open}>
          <SidebarContent
            collapsed={!open}
            users={users}
            roomName={roomName}
            username={username}
            onLeaveRoom={handleLeaveRoom}
          />
        </StyledDrawer>

        {/* Page Content */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default GroupChatLayout;
