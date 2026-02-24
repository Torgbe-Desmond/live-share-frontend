import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { Box, Tooltip } from "@mui/material";
import { useState } from "react";

function RoomClipboard({ roomName }) {
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  if (!roomName) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(roomName);
      setCopied(true);
      setTooltipOpen(true);
      // Reset after 2 seconds
      setTimeout(() => {
        setCopied(false);
        setTooltipOpen(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy room name:", err);
      // Optional: you could show a fallback message here
      // e.g. alert("Copy failed – please copy manually")
    }
  };

  const displayText =
    roomName.length > 16 ? `${roomName.slice(0, 13)}...` : roomName;

  return (
    <Tooltip
      title={copied ? "Copied!" : "Click to copy room code"}
      arrow
      placement="top"
      open={tooltipOpen}
      disableHoverListener={copied} // keep tooltip visible briefly after copy
      disableFocusListener={false}
      disableTouchListener={false}
    >
      <Box
        component="button"
        type="button"
        onClick={handleCopy}
        aria-label={`Copy room code: ${roomName}`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCopy();
          }
        }}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 0.75,
          p: 1,
          m: 2,
          borderRadius: 2,
          bgcolor: "action.hover",
          fontSize: "0.875rem",
          fontWeight: 500,
          color: "text.secondary",
          border: "1px solid",
          borderColor: "divider",
          cursor: "pointer",
          transition: "all 0.2s ease",
          userSelect: "none",
          "&:hover": {
            bgcolor: "action.selected",
            borderColor: "primary.light",
          },
          "&:active": {
            transform: "scale(0.97)",
            bgcolor: "action.focus",
          },
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
            outlineOffset: 2,
          },
        }}
      >
        <Box
          component="span"
          sx={{ maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {displayText}
        </Box>

        <ContentCopyIcon
          fontSize="small"
          sx={{
            opacity: copied ? 1 : 0.65,
            color: copied ? "success.main" : "inherit",
            transition: "color 0.2s, opacity 0.2s",
          }}
        />
      </Box>
    </Tooltip>
  );
}

export default RoomClipboard;
