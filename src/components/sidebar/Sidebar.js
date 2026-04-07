import {
  Avatar,
  Box,
  Drawer,
  IconButton,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";

const EXPANDED_WIDTH = 240;
const COLLAPSED_WIDTH = 64;

// ─── Avatar with online dot ───────────────────────────────────────────────────
function UserAvatar({ username, size = 36, isCurrentUser = false, theme }) {
  return (
    <Box sx={{ position: "relative", flexShrink: 0 }}>
      <Avatar
        src={`https://robohash.org/${username}?set=set4`}
        sx={{
          width: size,
          height: size,
          border: `2px solid ${isCurrentUser
              ? theme.palette.primary.main
              : alpha(theme.palette.divider, 0.6)
            }`,
          transition: "border-color 0.2s",
        }}
      />
      {/* Online indicator dot */}
      <Box
        sx={{
          position: "absolute",
          bottom: 1,
          right: 1,
          width: 9,
          height: 9,
          borderRadius: "50%",
          bgcolor: "#22c55e",
          border: `2px solid ${theme.palette.background.paper}`,
        }}
      />
    </Box>
  );
}

// ─── Room code copy chip ──────────────────────────────────────────────────────
function RoomChip({ roomName, open }) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);

  if (!roomName) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomName);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const label =
    roomName.length > 14 ? `${roomName.slice(0, 11)}…` : roomName;

  return (
    <Tooltip
      title={copied ? "Copied!" : "Copy room code"}
      placement={open ? "top" : "right"}
      arrow
    >
      <Box
        component="button"
        onClick={handleCopy}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          px: open ? 1.5 : 1,
          py: 0.5,
          borderRadius: "9999px",
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          bgcolor: "transparent",
          color: copied ? theme.palette.success.main : "text.secondary",
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.04em",
          cursor: "pointer",
          transition: "all 0.18s ease",
          whiteSpace: "nowrap",
          overflow: "hidden",
          justifyContent:"center",
          width: "100%",
          "&:hover": {
            bgcolor: alpha(theme.palette.primary.main, 0.06),
            borderColor: alpha(theme.palette.primary.main, 0.3),
            color: "text.primary",
          },
          "&:active": { transform: "scale(0.96)" },
        }}
      >
        <ContentCopyIcon
          sx={{
            fontSize: 13,
            color: copied ? "success.main" : "inherit",
            transition: "color 0.2s",
            flexShrink: 0,
          }}
        />
        {open && <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>}
      </Box>
    </Tooltip>
  );
}

// ─── Single user row ──────────────────────────────────────────────────────────
function UserRow({ username, label, isCurrentUser = false, open, theme }) {
  return (
    <Tooltip
      title={!open ? (isCurrentUser ? `${username} (you)` : username) : ""}
      placement="right"
      arrow
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: open ? 1.5 : 0,
          py: 0.75,
          borderRadius: 2,
          justifyContent: open ? "flex-start" : "center",
          bgcolor: isCurrentUser
            ? alpha(theme.palette.primary.main, 0.07)
            : "transparent",
          transition: "background 0.15s",
          "&:hover": {
            bgcolor: isCurrentUser
              ? alpha(theme.palette.primary.main, 0.12)
              : alpha(theme.palette.action.hover, 0.5),
          },
        }}
      >
        <UserAvatar
          username={username}
          isCurrentUser={isCurrentUser}
          theme={theme}
        />
        {open && (
          <Box sx={{ minWidth: 0 }}>
            <Typography
              noWrap
              sx={{
                fontSize: "0.875rem",
                fontWeight: isCurrentUser ? 700 : 500,
                color: "text.primary",
                lineHeight: 1.3,
              }}
            >
              {username}
            </Typography>
            {label && (
              <Typography
                noWrap
                sx={{ fontSize: "0.72rem", color: "text.disabled", lineHeight: 1.2 }}
              >
                {label}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Tooltip>
  );
}

// ─── Main Sidebar ─────────────────────────────────────────────────────────────
export default function Sidebar({
  open,
  onToggle,
  users = [],
  username,
  roomName,
  onLeave,
}) {
  const theme = useTheme();
  const userArray = users instanceof Set ? [...users] : Array.isArray(users) ? users : [];
  const others = userArray.filter((u) => u !== username);

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
        flexShrink: 0,
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: open
            ? theme.transitions.duration.enteringScreen
            : theme.transitions.duration.leavingScreen,
        }),
        "& .MuiDrawer-paper": {
          width: open ? EXPANDED_WIDTH : COLLAPSED_WIDTH,
          overflowX: "hidden",
          borderRight: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.paper",
          transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: open
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: open ? "space-between" : "center",
          px: open ? 2 : 1,
          py: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
          minHeight: 56,
          gap: 1,
        }}
      >
        {open && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
            {/* Online count badge */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 1,
                py: 0.25,
                borderRadius: "9999px",
                bgcolor: alpha("#22c55e", 0.1),
                border: `1px solid ${alpha("#22c55e", 0.25)}`,
              }}
            >
              <Box
                sx={{ width: 7, height: 7, borderRadius: "50%", bgcolor: "#22c55e" }}
              />
              <Typography
                sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#22c55e" }}
              >
                {userArray.length} online
              </Typography>
            </Box>
          </Box>
        )}

        {/* Collapse/expand toggle */}
        <Tooltip title={open ? "Collapse" : "Expand"} placement="right" arrow>
          <IconButton
            size="small"
            onClick={onToggle}
            sx={{
              color: "text.secondary",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 1.5,
              p: 0.5,
              "&:hover": {
                bgcolor: alpha(theme.palette.primary.main, 0.06),
                borderColor: alpha(theme.palette.primary.main, 0.3),
                color: "text.primary",
              },
            }}
          >
            {open ? (
              <ChevronLeftIcon fontSize="small" />
            ) : (
              <ChevronRightIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* ── User list ── */}
      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden", px: 1, py: 1.5 }}>
        {/* Section label */}
        {open && others.length > 0 && (
          <Typography
            sx={{
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "text.disabled",
              px: 0.5,
              mb: 0.75,
            }}
          >
            Members
          </Typography>
        )}

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
          {others.map((user) => (
            <UserRow
              key={user}
              username={user}
              open={open}
              theme={theme}
            />
          ))}
        </Box>
      </Box>

      {/* ── Footer: current user + actions ── */}
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          px: 1,
          py: 1.5,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {/* Room chip */}
        <Box
          sx={{
            display: "flex",
            width:"100%",
            justifyContent: open ? "flex-start" : "center",
            px: open ? 0.5 : 0,
          }}
        >
          <RoomChip roomName={roomName} open={open} />
        </Box>

        {/* Current user row */}
        {username && (
          <UserRow
            username={username}
            label="you"
            isCurrentUser
            open={open}
            theme={theme}
          />
        )}

        {/* Leave button */}
        <Tooltip
          title={!open ? "Leave room" : ""}
          placement="right"
          arrow
        >
          <Box
            component="button"
            onClick={onLeave}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: open ? "flex-start" : "center",
              gap: 1,
              px: open ? 1.5 : 0,
              py: 0.875,
              borderRadius: 2,
              border: "none",
              bgcolor: "transparent",
              color: theme.palette.error.main,
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              width: "100%",
              transition: "background 0.15s",
              "&:hover": {
                bgcolor: alpha(theme.palette.error.main, 0.08),
              },
              "&:active": { transform: "scale(0.98)" },
            }}
          >
            <LogoutIcon sx={{ fontSize: 18, flexShrink: 0 }} />
            {open && <span>Leave room</span>}
          </Box>
        </Tooltip>
      </Box>
    </Drawer>
  );
}