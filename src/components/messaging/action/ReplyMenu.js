import { useMemo, useState } from "react";
import IconButton from "@mui/material/IconButton";
import ReplyIcon from "@mui/icons-material/Reply";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useTheme } from "@mui/material/styles";
import { Box, Tooltip, useMediaQuery, Paper } from "@mui/material";

export default function ReplyMenu({
  msg,
  senderId,
  onReply,
  msgRef,
  handleCallMedia,
  roomName,
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isOwn = msg?.senderId === senderId;

  const [copied, setCopied] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  // Inside your component:
  const { url, mediaCategory } = useMemo(() => {
    const urlRegex = /https?:\/\/[^\s]+/;
    const tokens = (msg?.content || "").split(" ");
    const urlToken = tokens.find((token) => urlRegex.test(token));

    if (!urlToken) return { url: null, mediaCategory: "none" };

    const category =
      urlToken.includes("tiktok.com") || urlToken.includes("vm.tiktok.com")
        ? "tiktok"
        : "generic_link";

    return { url: urlToken, mediaCategory: category };
  }, [msg?.content]);

  console.log("url", url);

  const handleCopy = async (e) => {
    try {
      await navigator.clipboard.writeText(msg?.content || "");
      setCopied(true);
      if (!isMobile) setTooltipOpen(true);
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
        title={isCopy ? (copied ? "Copied!" : "Copy") : "Reply"}
        arrow
        placement="top"
        open={isMobile ? false : isCopy ? tooltipOpen : undefined}
      >
        <IconButton
          size={isMobile ? "medium" : "small"}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          sx={{
            p: isMobile ? 1 : 0.6,
            // Use primary color for icons to make them pop on white
            color:
              isCopy && copied
                ? "success.main"
                : isOwn
                  ? "primary.main"
                  : "text.secondary",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(0, 0, 0, 0.04)",
              transform: "translateY(-2px)",
            },
            "&:active": {
              transform: "scale(0.9)",
            },
            "& svg": {
              fontSize: isMobile ? "1.1rem" : "0.95rem",
            },
          }}
        >
          {icon}
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        alignItems: "center",
        // Soft border and light grey bg makes it visible against white
        bgcolor: "#fcfcfc",
        border: "1px solid",
        borderColor: "divider", // Uses the standard MUI divider color
        borderRadius: "20px",
        px: 0.5,
        py: 0.2,
        gap: 0.2,
        // Small shadow to give it physical depth
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        width: "fit-content",
        ml: isOwn ? "auto" : 0,
        mr: isOwn ? 0 : "auto",
      }}
    >
      <ActionButton
        onClick={() => onReply(msgRef?.current)}
        icon={<ReplyIcon />}
        name="reply"
      />

      {/* Small vertical divider between buttons */}
      <Box sx={{ width: "1px", height: "16px", bgcolor: "divider", mx: 0.3 }} />

      <ActionButton
        onClick={handleCopy}
        icon={<ContentCopyIcon />}
        name="copy"
      />

      {mediaCategory === "tiktok" && (
        <>
          <Box
            sx={{ width: "1px", height: "16px", bgcolor: "divider", mx: 0.3 }}
          />
        
        </>
      )}
    </Paper>
  );
}
