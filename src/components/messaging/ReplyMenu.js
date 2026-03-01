import { useState } from "react";
import IconButton from "@mui/material/IconButton";
import ReplyIcon from "@mui/icons-material/Reply";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTheme } from "@mui/material/styles";
import { Box, Tooltip } from "@mui/material";

export default function ReplyMenu({
  msg,
  senderId,
  onReply,
  msgRef,
}) {
  const theme = useTheme();
  const isOwn = msg?.senderId === senderId;

  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msg?.content || "");
      setCopied(true);
      setTooltipOpen(true);

      setTimeout(() => {
        setCopied(false);
        setTooltipOpen(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  };

  function ActionButton({ onClick, icon, name }) {
    const isCopy = name === "copy";

    return (
      <Tooltip
        title={
          isCopy
            ? copied
              ? "Copied!"
              : "Copy message"
            : "Reply"
        }
        arrow
        placement="top"
        open={isCopy ? tooltipOpen : undefined}
      >
        <Box
          sx={{
            display: "flex",
            backdropFilter: "blur(6px)",
            borderRadius: "50%",
            transition: "all 0.2s ease",
            color: isOwn
              ? theme.palette.primary.contrastText
              : theme.palette.text.secondary,
            "&:hover": {
              color: theme.palette.primary.contrastText,
              transform: "scale(1.15)",
            },
            "&:active": {
              transform: "scale(0.92)",
            },
          }}
        >
          <IconButton
            size="small"
            onClick={onClick}
            sx={{
              opacity: isCopy ? (copied ? 1 : 0.65) : 0.9,
              color: isCopy && copied ? "success.main" : "inherit",
              transition: "color 0.2s, opacity 0.2s",
            }}
          >
            {icon}
          </IconButton>
        </Box>
      </Tooltip>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      width="100%"
      gap={1}
    >
      <ActionButton
        onClick={() => onReply(msgRef?.current)}
        icon={<ReplyIcon fontSize="small" />}
        name="reply"
      />
      <ActionButton
        onClick={handleCopy}
        icon={<ContentCopyIcon fontSize="small" />}
        name="copy"
      />
    </Box>
  );
}