import { Box, Typography, alpha, useTheme } from "@mui/material";

const MessageReplyPreview = ({ msg, isOwn, onClicReply }) => {
  const theme = useTheme();

  if (!msg?.replyTo) return null;

  return (
    <Box
      sx={{
        borderLeft: isOwn
          ? "3px solid rgba(255,255,255,0.4)"
          : `3px solid ${theme.palette.primary.main}`,
        pl: 1.5,
        py: 0.5,
        mb: 1,
        pr: 1.5,
        opacity: 0.9,
        bgcolor: isOwn
          ? alpha("#000", 0.15)
          : alpha(theme.palette.grey[200], 0.2),
        borderRadius: 1.5,
      }}
      onClick={() => onClicReply(msg)}
    >
      {msg?.replyTo?.files?.length > 0 &&
        msg.replyTo.files.map((file, i) =>
          !file.local ? (
            <Box
              key={i}
              component="img"
              src={file.path}
              sx={{
                width: 50,
                height: 50,
                borderRadius: 2,
                display: "block",
                bgcolor: "black",
                mr: 1,
                mb: 0.5,
              }}
            />
          ) : null
        )}

      <Typography variant="caption" fontWeight={600}>
        {msg.replyTo.username}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >
        {msg.replyTo.content}
      </Typography>
    </Box>
  );
};

export default MessageReplyPreview;