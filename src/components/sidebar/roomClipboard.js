import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, Tooltip, useTheme } from "@mui/material";
import { useState } from "react";

function RoomClipboard({ roomName }) {
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  if (!roomName) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomName);
      setCopied(true);
      setTooltipOpen(true);
      setTimeout(() => {
        setCopied(false);
        setTooltipOpen(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy room name:", err);
    }
  };

  const displayText = roomName.length > 16 ? `${roomName.slice(0, 13)}...` : roomName;

  return (
    <Tooltip
      title={copied ? "Copied!" : "Click to copy room code"}
      arrow
      placement="top"
      open={tooltipOpen}
      disableHoverListener={copied}
    >
      <Box
        component="button"
        type="button"
        onClick={handleCopy}
        aria-label={`Copy room code: ${roomName}`}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          px: 2,
          py: 0.5,
          // Twitter Dark Theme: Pill shape, transparent background
          borderRadius: "9999px",
          bgcolor: "transparent",
          border: `1px solid ${theme.palette.divider}`,
          color: "text.secondary",
          fontSize: "0.85rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "all 0.2s ease",
          
          // Hover state: Subtle light gray background
          "&:hover": {
            bgcolor: "rgba(255, 255, 255, 0.08)",
            color: "text.primary",
            borderColor: "rgba(255, 255, 255, 0.2)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
          "&:focus-visible": {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        }}
      >
        <ContentCopyIcon
          fontSize="small"
          sx={{
            fontSize: "14px",
            // If copied, turn success green, otherwise follow text color
            color: copied ? theme.palette.success.main : "inherit",
            transition: "color 0.2s",
          }}
        />
        <Box component="span" sx={{ whiteSpace: "nowrap" }}>
          {displayText}
        </Box>
      </Box>
    </Tooltip>
  );
}

export default RoomClipboard;