import {
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";

export default function ReplyPreview({ replyingTo, setReplyingTo }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!replyingTo) return null;

  function TruncatedText({ text, maxLength = 180 }) {
    if (!text) return null; 

    text = text.split("\n")[0]

    if (text.length > maxLength) {
      return <>{text}...</>;
    }

    return <>{text}</>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        p: 1,
        // bgcolor: "#f5f5f5",
        borderTop:1,
        borderBottom:1,
        borderColor:"divider",
        borderLeft: "3px solid #1976d2",
        width: "100%",
      }}
    >
      {replyingTo.files?.length > 0 &&
        replyingTo.files
          .filter((file) => !file.local) // only keep non-local files
          .map((file) => (
            <Box
              key={file.path} // ← add key (important when rendering lists)
              component="img"
              src={file.path}
              controls
              muted
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                display: "block",
                bgcolor: "black",
                mr: 1,
              }}
            />
          ))}

      <Box sx={{ flex: 1, mr: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Replying to {replyingTo.username}
        </Typography>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: isMobile ? 280 : 400,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            maxHeight: "4.8em", // approximate: line-height ~1.2em × 4
          }}
        >
          <TruncatedText text={replyingTo.content} maxLength={220} />
        </Typography>
      </Box>
      <IconButton onClick={() => setReplyingTo(null)}>✕</IconButton>
    </Box>
  );
}
