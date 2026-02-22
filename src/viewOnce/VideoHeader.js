import { Box, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function VideoHeader({ title = "Video", onClose }) {
  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        zIndex: 20,
      }}
    >
      <Typography variant="h6" sx={{ color: "white" }}>
        {title}
      </Typography>

      <IconButton
        onClick={onClose}
        sx={{
          color: "white",
          p: 0.5,
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
}