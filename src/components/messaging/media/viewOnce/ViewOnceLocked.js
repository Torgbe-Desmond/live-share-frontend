import { Box, Typography, alpha, useTheme } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

const ViewOnceLocked = ({ onClick }) => {
  const theme = useTheme();

  return (
    <Box
      onClick={onClick}
      sx={{
        mt: 1.5,
        p: 2.5,
        bgcolor: alpha(theme.palette.grey[500], 0.12),
        borderRadius: 2.5,
        textAlign: "center",
        cursor: "pointer",
        maxWidth: 420,
        "&:hover": {
          bgcolor: alpha(theme.palette.grey[500], 0.2),
        },
      }}
    >
      <LockIcon fontSize="small" />
      <Typography variant="body2" sx={{ ml: 1 }}>
        Tap to view once
      </Typography>
    </Box>
  );
};

export default ViewOnceLocked;