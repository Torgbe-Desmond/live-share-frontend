import { Box, IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function ChatHeader({ isMobile, onMenuClick, isActive }) {
  return (
    <Box
      sx={{
        position: "relative", // behaves like static AppBar
        width: "100%",
        minHeight: 56,
        px: { xs: 1.5, sm: 3 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        // bgcolor: "background.paper"
      }}
    >
      {/* Mobile menu button */}
      {isMobile && (
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{
            color: "text.secondary",
            bgcolor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            borderRadius: 3,
            px: 2,
            py: 0.6,
            ml: 0.5,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            "&:hover": {
              bgcolor: "rgba(255, 255, 255, 0.15)",
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {!isMobile && <Box sx={{ flex: 1 }} />}

      {/* Status indicator */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.2,
          color: "text.secondary",
          bgcolor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderRadius: 3,
          px: 2,
          py: 0.6,
          boxShadow: "0 4px 20px rgba(32, 24, 24, 0.1)",
        }}
      >
        <Box
          sx={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            bgcolor: isActive ? "success.main" : "error.main",
            boxShadow: isActive
              ? "0 0 0 3px rgba(76, 175, 80, 0.3)"
              : "0 0 0 3px rgba(244, 67, 54, 0.25)",
            transition: "all 0.3s ease",
          }}
        />
        <Typography
          variant="body2"
          fontWeight={500}
          sx={{ userSelect: "none" }}
        >
          {isActive ? "Online" : "Offline"}
        </Typography>
      </Box>
    </Box>
  );
}
