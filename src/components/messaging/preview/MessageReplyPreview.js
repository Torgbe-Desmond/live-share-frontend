import { Box, Typography, alpha, useMediaQuery, useTheme } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

const MessageReplyPreview = ({ msg, isOwn, onClickReply }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!msg?.replyTo) return null;

  function TruncatedText({ text, maxLength = 120 }) {
    if (!text) return null;
    const firstLine = text.split("\n")[0];
    if (firstLine.length > maxLength) {
      return <>{firstLine.substring(0, maxLength)}...</>;
    }
    return <>{firstLine}</>;
  }

  function FileThumb({ file }) {
    if (file.type?.startsWith("image/")) {
      return (
        <Box
          component="img"
          src={file.path}
          sx={{
            width: 44,
            height: 44,
            objectFit: "cover",
            mr: 1.5,
            bgcolor: "grey.200",
            flexShrink: 0,
          }}
        />
      );
    }

    if (file.type?.startsWith("video/")) {
      return (
        <Box
          component="video"
          src={file.path}
          muted
          sx={{
            width: 44,
            height: 44,
            borderRadius: 1.5,
            objectFit: "cover",
            mr: 1.5,
            border: "1px solid rgba(0,0,0,0.05)",
            bgcolor: "grey.200",
            flexShrink: 0,
          }}
        />
      );
    }

    // Generic file
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          mr: 1.5,
          flexShrink: 0,
        }}
      >
        <DescriptionIcon sx={{ fontSize: 28, color: "#616161" }} />
        <Typography
          variant="caption"
          sx={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 80,
            color: "text.secondary",
          }}
        >
          {file.originalname || file.name}
        </Typography>
      </Box>
    );
  }

  const previewFile = msg.replyTo.files?.filter((f) => !f.local)?.[0];

  console.log("msg", msg)


  return (
    <Box
      sx={{
        display: "flex",          // Added: Keeps thumb and text side-by-side
        alignItems: "center",     // Added: Vertically centers content
        borderLeft: isOwn
          ? "3px solid rgba(255,255,255,0.6)"
          : `3px solid ${theme.palette.primary.main}`,
        pl: 1,                    // Tightened padding
        py: 0.5,
        mb: 1,
        pr: 1.5,
        bgcolor: isOwn
          ? alpha("#000", 0.1)     // Subtle dark for own bubble
          : alpha(theme.palette.action.hover, 0.05),
        borderRadius: "4px 12px 12px 4px", // Chat-style radius
        cursor: "pointer",        // Added: Indicates it's clickable
        userSelect: "none",
        "&:hover": {
          bgcolor: alpha("#000", 0.15),
        }
      }}
      onClick={() => onClickReply(msg)}
    >
      {/* 1. File thumbnail stays on the left */}
      {previewFile && <FileThumb file={previewFile} />}

      {/* 2. Text takes the remaining space */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            // Color logic: If it's your own message, white might look better
            color: isOwn ? "#fff" : theme.palette.primary.main,
            display: "block",
            lineHeight: 1.2,
            fontSize: "0.75rem",
          }}
        >
          {msg.replyTo.username}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: isOwn ? alpha("#fff", 0.8) : "text.secondary",
            fontSize: "0.8rem",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {/* If there are files but no text content, show a label */}
          {msg.replyTo.content ? (
            <TruncatedText
              text={msg.replyTo.content}
              maxLength={isMobile ? 60 : 120}
            />
          ) : (
            previewFile && "Attachment"
          )}
        </Typography>
      </Box>
    </Box>
  )

}

export default MessageReplyPreview