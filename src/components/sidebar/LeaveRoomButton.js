import { Box, Button, useTheme } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

export default function LeaveRoomButton({ onLeave }) {
  const theme = useTheme();

  return (
    <Box sx={{ p: 1 }}>
      <Button
        fullWidth
        variant="outlined"
        color="error"
        startIcon={<LogoutIcon fontSize="small" />}
        onClick={onLeave}
        sx={{
          // X-style pill shape (9999px makes it fully rounded)
          borderRadius: "9999px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "15px",
          py: 1,
          // Border color matches the error color
          // borderColor: theme.palette.error.main,
          border:"none",
          color: theme.palette.error.main,
          "&:hover": {
            // Subtle transparent background on hover, standard X behavior
            backgroundColor: "rgba(244, 33, 46, 0.1)",
            borderColor: theme.palette.error.main,
          },
        }}
      >
        Leave Room
      </Button>
    </Box>
  );
}