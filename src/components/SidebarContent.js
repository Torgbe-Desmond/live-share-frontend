import { Box } from "@mui/material";
import OnlineUsersList from "./OnlineUsersList";
import LeaveRoomButton from "./LeaveRoomButton";
import useDeviceOS from "./useDeviceOS";
import RoomClipboard from "./roomClipboard";
// import ChatDrawerContent from "./messaging/ChatDrawerContent";
// import { useState } from "react";

export default function SidebarContent({
  users,
  username,
  onLeaveRoom,
  roomName,
}) {
  const os = useDeviceOS();
  // const [open, setOpen] = useState(false);

  // const onClose =()=>{
  //    setOpen(false)
  // }

  return (
    <Box
      sx={{
        width: 280,
        height: "100%",
        bgcolor: "background.paper",
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        zIndex: 1300,
        flexDirection: "column",
        pb: os === "iOS" ? 2 : 0.5,
      }}
    >
      <OnlineUsersList users={users} currentUsername={username} />

      {/* <Drawer
        anchor="right"
        open={true}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 380 },
            height: "100%",
          },
        }}
      >
        <ChatDrawerContent onClose={onClose} />
      </Drawer> */}
      <RoomClipboard roomName={roomName} />
      <LeaveRoomButton onLeave={onLeaveRoom} />
    </Box>
  );
}
