import { Slide, Paper, Typography, CircularProgress } from "@mui/material";

export default function DownloadSlider({ isDownloading }) {
  return (
    <Slide direction="down" in={isDownloading} mountOnEnter unmountOnExit>
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          p: 1,
          bgcolor: "primary.main",
          color: "white",
        }}
      >
        <CircularProgress size={16} color="inherit" />
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          Processing media download...
        </Typography>
      </Paper>
    </Slide>
  );
}