import { Box } from "@mui/material";
import OnlineUsersList from "./OnlineUsersList";
import LeaveRoomButton from "./LeaveRoomButton";
import useDeviceOS from "./useDeviceOS";

export default function SidebarContent({ users, username, onLeaveRoom }) {


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
        flexDirection: "column",
        pb: os === "iOS" ? 3 : 1.5,
      }}
    >
      <OnlineUsersList users={users} currentUsername={username} />
      
      <LeaveRoomButton onLeave={onLeaveRoom} />
    </Box>
  );
}
