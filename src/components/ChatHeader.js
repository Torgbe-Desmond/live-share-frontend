import { Box, IconButton, AppBar, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";

export default function ChatHeader({
  roomName,
  usersCount,
  isMobile,
  onMenuClick,
  isActive,
}) {
  const [copied, setCopied] = useState("");
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Toolbar
        variant="dense"
        sx={{ minHeight: 56, px: { xs: 2, sm: 3 }, gap: 2 }}
      >
        {isMobile && (
          <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}

        {/* <Typography
          variant="h6"
          color="text.secondary"
          fontWeight={700}
          noWrap
          sx={{ letterSpacing: "-0.02em" }}
        >
          Playground
        </Typography> */}
        {roomName && (
          <Tooltip
            title={copied ? "Copied!" : "Click to copy room code"}
            arrow
            placement="top"
          >
            <Box
              component="span"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(roomName);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800); // feedback ~2 seconds
                } catch (err) {
                  console.error("Failed to copy:", err);
                  // Optional: alert("Copy failed – try manually") or use a Snackbar
                }
              }}
              sx={{
                px: 1.5,
                py: 0.4,
                borderRadius: 10,
                bgcolor: "action.hover",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "text.secondary",
                border: "1px solid",
                borderColor: "divider",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                "&:hover": {
                  bgcolor: "action.selected",
                },
                "&:active": {
                  transform: "scale(0.98)",
                },
              }}
            >
              {roomName}
              <ContentCopyIcon
                fontSize="inherit"
                sx={{
                  opacity: copied ? 1 : 0.6,
                  color: copied ? "success.main" : "inherit",
                  fontSize: "1.1em",
                }}
              />
            </Box>
          </Tooltip>
        )}
        <Box sx={{ flex: 1 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "text.secondary",
          }}
        >
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: isActive ? "success.main" : "error.light",
              boxShadow: isActive
                ? "0 0 0 4px alpha('success.main', 0.24)"
                : "0 0 0 4px alpha('error.main', 0.16)",
            }}
          />
          <Typography variant="body2" fontWeight={500}>
          { isActive ? "online" : "offline"}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
