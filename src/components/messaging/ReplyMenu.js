import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import ReplyIcon from "@mui/icons-material/Reply";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTheme } from "@emotion/react";
import { Box, Tooltip, alpha } from "@mui/material";

export default function ReplyMenu({
  msg,
  senderId,
  onReply,
  msgRef,
  showReplyBtn,
}) {
  const theme = useTheme();
  const isOwn = msg?.senderId === senderId;
  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msg.content);
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

  function ActionButton({ onClick, icon, name }) {
    return (
      <Tooltip
        title={
          name === "copy" && copied ? "Copied!" : "Click to copy room code"
        }
        arrow
        placement="top"
        open={name === "copy" && tooltipOpen}
        disableHoverListener={name === "copy" && copied} // keep tooltip visible briefly after copy
        disableFocusListener={name === "copy" && false}
        disableTouchListener={name === "copy" && false}
      >
        <Box
          sx={{
            opacity: 0.9,
            visibility: "visible",
            color: isOwn
              ? theme.palette.primary.contrastText
              : theme.palette.text.secondary,
            bgcolor: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: "blur(6px)",
            boxShadow: theme.shadows[1],
            borderRadius: "50%",
            transition: "opacity 0.2s ease, transform 0.15s ease",
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.15),
              color: theme.palette.primary.main,
              transform: "scale(1.15)",
            },
            "&:active": {
              transform: "scale(0.92)",
            },
          }}
        >
          <IconButton
            sx={
              name === "copy" && {
                opacity: copied ? 1 : 0.65,
                color: copied ? "success.main" : "",
                transition: "color 0.2s, opacity 0.2s",
              }
            }
            onClick={onClick}
          >
            {icon}
          </IconButton>
        </Box>
      </Tooltip>
    );
  }
  return (
    <Box display="flex" justifyContent="flex-end" width="100%" gap={1}>
      <ActionButton
        onClick={() => onReply(msgRef.current)}
        icon={<ReplyIcon fontSize="small" />}
        name={"reply"}
      />
      <ActionButton
        onClick={handleCopy}
        icon={<ContentCopyIcon fontSize="small" />}
        name={"copy"}
      />
    </Box>
  );
}
