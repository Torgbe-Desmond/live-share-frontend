import {
  Box,
  Fade,
  IconButton,
  Typography,
  alpha,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";
import ReplyIcon from "@mui/icons-material/Reply";

function FileThumb({ file }) {
  const commonSx = {
    width: 40,
    height: 40,
    borderRadius: 1.5,
    objectFit: "cover",
    flexShrink: 0,
    border: "1px solid rgba(0,0,0,0.06)",
  };

  if (file.type?.startsWith("image/")) {
    return <Box component="img" src={file.path} sx={commonSx} />;
  }
  if (file.type?.startsWith("video/")) {
    return <Box component="video" src={file.path} muted sx={commonSx} />;
  }
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: 1.5,
        bgcolor: "action.hover",
        flexShrink: 0,
      }}
    >
      <DescriptionIcon sx={{ fontSize: 20, color: "text.disabled" }} />
    </Box>
  );
}

function truncate(text, max) {
  if (!text) return null;
  const firstLine = text.split("\n")[0];
  return firstLine.length > max ? `${firstLine.slice(0, max)}…` : firstLine;
}

export default function ReplyPreview({ replyingTo, setReplyingTo }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!replyingTo) return null;

  const previewFile = replyingTo.files?.filter((f) => !f.local)?.[0];
  const maxLen = isMobile ? 80 : 150;

  return (
    <Fade in={!!replyingTo}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 1.5,
          py: 1,
          borderRadius: "12px 12px 0 0",
          bgcolor: alpha(theme.palette.primary.main, 0.05),
          borderLeft: `3px solid ${theme.palette.primary.main}`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.15)}`,
          borderLeftWidth: 3,
          mb: "-1px",
        }}
      >
        {/* Icon */}
        <ReplyIcon
          sx={{ fontSize: 16, color: "primary.main", flexShrink: 0, opacity: 0.7 }}
        />

        {/* File thumbnail */}
        {previewFile && <FileThumb file={previewFile} />}

        {/* Text */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 700,
              color: "primary.main",
              lineHeight: 1.3,
              mb: 0.2,
            }}
          >
            Replying to {replyingTo.username}
          </Typography>
          <Typography
            noWrap
            sx={{ fontSize: "0.82rem", color: "text.secondary" }}
          >
            {truncate(replyingTo.content, maxLen) ||
              (previewFile ? "Attachment" : "")}
          </Typography>
        </Box>

        {/* Close */}
        <IconButton
          size="small"
          onClick={() => setReplyingTo(null)}
          sx={{
            flexShrink: 0,
            color: "text.disabled",
            borderRadius: "8px",
            p: 0.4,
            "&:hover": { color: "text.primary", bgcolor: alpha(theme.palette.action.hover, 0.6) },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Fade>
  );
}
