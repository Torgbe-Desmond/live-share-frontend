import { Box, Typography, alpha, useMediaQuery, useTheme } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

function FileThumb({ file }) {
  const sx = {
    width: 36,
    height: 36,
    borderRadius: 1,
    objectFit: "cover",
    flexShrink: 0,
  };

  if (file.type?.startsWith("image/")) {
    return <Box component="img" src={file.path} sx={sx} />;
  }
  if (file.type?.startsWith("video/")) {
    return <Box component="video" src={file.path} muted sx={sx} />;
  }
  return (
    <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
      <DescriptionIcon sx={{ fontSize: 22, color: "inherit", opacity: 0.5 }} />
    </Box>
  );
}

function truncate(text, max) {
  if (!text) return null;
  const line = text.split("\n")[0];
  return line.length > max ? `${line.slice(0, max)}…` : line;
}

const MessageReplyPreview = ({ msg, isOwn, onClickReply }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!msg?.replyTo) return null;

  const previewFile = msg.replyTo.files?.filter((f) => !f.local)?.[0];
  const maxLen = isMobile ? 55 : 110;

  return (
    <Box
      onClick={() => onClickReply?.(msg)}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        mb: 0.75,
        px: 1,
        py: 0.6,
        borderRadius: "6px 10px 10px 6px",
        borderLeft: `3px solid ${isOwn ? "rgba(255,255,255,0.55)" : theme.palette.primary.main}`,
        bgcolor: isOwn
          ? alpha("#000", 0.12)
          : alpha(theme.palette.primary.main, 0.06),
        cursor: "pointer",
        userSelect: "none",
        transition: "background 0.15s",
        "&:hover": {
          bgcolor: isOwn
            ? alpha("#000", 0.18)
            : alpha(theme.palette.primary.main, 0.1),
        },
      }}
    >
      {previewFile && <FileThumb file={previewFile} />}

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 700,
            color: isOwn ? "rgba(255,255,255,0.85)" : "primary.main",
            lineHeight: 1.3,
            display: "block",
          }}
        >
          {msg.replyTo.username}
        </Typography>
        <Typography
          noWrap
          sx={{
            fontSize: "0.76rem",
            color: isOwn ? "rgba(255,255,255,0.65)" : "text.secondary",
          }}
        >
          {msg.replyTo.content
            ? truncate(msg.replyTo.content, maxLen)
            : previewFile
            ? "Attachment"
            : null}
        </Typography>
      </Box>
    </Box>
  );
};

export default MessageReplyPreview;
