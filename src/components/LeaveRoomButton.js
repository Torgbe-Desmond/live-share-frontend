import { Box, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export default function LeaveRoomButton({ onLeave }) {
  return (
    <Box sx={{ p: 2 }}>
      <Button
        fullWidth
        variant="outlined"
        color="error"
        startIcon={<LogoutIcon />}
        onClick={onLeave}
        sx={{ borderRadius: 2 }}
      >
        Leave Room
      </Button>
    </Box>
  );
}
