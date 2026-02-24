import { Box } from "@mui/material";
import OnlineUsersList from "./OnlineUsersList";
import LeaveRoomButton from "./LeaveRoomButton";
import useDeviceOS from "./useDeviceOS";
import RoomClipboard from "./roomClipboard";

export default function SidebarContent({ users, username, onLeaveRoom, roomName }) {
  const os = useDeviceOS();
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
        pb: os === "iOS" ? 3 : 1.5,
      }}
    >
      <OnlineUsersList users={users} currentUsername={username} />


      <RoomClipboard roomName={roomName}/>
      <LeaveRoomButton onLeave={onLeaveRoom} />
    </Box>
  );
}
