import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Fade
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DescriptionIcon from "@mui/icons-material/Description";


export default function ReplyPreview({ replyingTo, setReplyingTo }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!replyingTo) return null;

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

  const previewFile = replyingTo.files?.filter((f) => !f.local)?.[0];

  return (
    <Fade in={!!replyingTo}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: "8px 12px",
          bgcolor: "rgba(25, 118, 210, 0.04)",
          borderLeft: `4px solid ${theme.palette.primary.main}`,
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          width: "100%",
          maxWidth: 800,
          mx: "auto",
          position: "relative",
          mb: "-1px",
        }}
      >
        {/* File thumbnail */}
        {previewFile && <FileThumb file={previewFile} />}

        {/* Text */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              display: "block",
              lineHeight: 1.2,
              mb: 0.2,
            }}
          >
            Replying to {replyingTo.username}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontSize: "0.85rem",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <TruncatedText
              text={replyingTo.content}
              maxLength={isMobile ? 80 : 150}
            />
          </Typography>
        </Box>

        <IconButton
          size="small"
          onClick={() => setReplyingTo(null)}
          sx={{
            ml: 1,
            bgcolor: "rgba(0,0,0,0.03)",
            "&:hover": { bgcolor: "rgba(0,0,0,0.08)" },
          }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Fade>
  );
}