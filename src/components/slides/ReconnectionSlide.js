import { Box, Slide, Button, CircularProgress } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

function ReconnectionSlide({
  showReconnect,
  isActive,
  isReconnecting,
  attemptReconnect,
  retryCount,
  roomName,
}) {
  return (
    <div>
      <Slide
        direction="up"
        in={showReconnect && !isActive}
        mountOnEnter
        unmountOnExit
      >
        <Box
          sx={{
            position: "fixed",
            bottom: { xs: 88, sm: 96 }, // slightly higher on larger screens
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            px: 2,
            pb: 2, // breathing room from bottom edge
            zIndex: 1250,
            pointerEvents: "none", // so clicks go through when not hovering button
          }}
        >
          <Box
            sx={{
              pointerEvents: "auto", // only button area receives clicks
              width: "100%",
              maxWidth: 420, // prevents it from becoming too wide on desktop
              borderRadius: 50,
              boxShadow: "0 8px 32px rgba(0,0,0,0.28)",
              overflow: "hidden", // for clean rounded corners
            }}
          >
            <Button
              fullWidth
              variant="contained"
              color="error"
              size="large"
              startIcon={
                isReconnecting ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  <RefreshIcon />
                )
              }
              disabled={isReconnecting}
              onClick={attemptReconnect}
              sx={{
                py: 1.8,
                px: 4,
                borderRadius: 50,
                fontSize: "1.05rem",
                fontWeight: 600,
                textTransform: "none",
                gap: 1.5,
                backgroundColor: isReconnecting ? "error.dark" : "error.main",
                "&:hover": {
                  backgroundColor: isReconnecting ? "error.dark" : "error.dark",
                },
                boxShadow: "none", // we moved shadow to container
              }}
            >
              {isReconnecting
                ? retryCount <= 1
                  ? "Reconnecting..."
                  : `Retrying (${retryCount})...`
                : retryCount === 0
                  ? `Reconnect${roomName ? ` to ${roomName}` : ""}`
                  : `Retry connection (${retryCount})`}
            </Button>
          </Box>
        </Box>
      </Slide>
    </div>
  );
}

export default ReconnectionSlide;
