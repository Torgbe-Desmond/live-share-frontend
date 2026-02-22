import { Box, Typography, IconButton } from "@mui/material";

export default function ReplyPreview({ replyingTo, setReplyingTo }) {
  if (!replyingTo) return null;

  return (
    <Box
      sx={{
        display: "flex",
        p: 1,
        bgcolor: "#f5f5f5",
        borderLeft: "3px solid #1976d2",
        width: "100%",
      }}
    >
      {replyingTo.files?.length > 0 &&
        replyingTo?.files.map((file) => {
          if (!file.local) {
            return (
              <Box
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
                  mr:1
                }}
              />
            );
          }
        })}

      <Box sx={{ flex: 1, mr: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Replying to {replyingTo.username}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            overflowWrap: "anywhere",
          }}
          color="text.primary"
          noWrap
        >
          {replyingTo.content}
        </Typography>
      </Box>
      <IconButton onClick={() => setReplyingTo(null)}>✕</IconButton>
    </Box>
  );
}
