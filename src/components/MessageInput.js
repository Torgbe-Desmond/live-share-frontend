import { Box, TextField, IconButton, Typography } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import useDeviceOS from "./useDeviceOS";

export default function MessageInput({
  message,
  setMessage,
  onSend,
  fileInputRef,
  selectedFilesCount,
  replyingTo,
  setReplyingTo,
}) {
  const os = useDeviceOS();
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Box sx={{ pb: os === "iOS" ? 3 : 1.5 }}>
      <input
        type="file"
        multiple
        hidden
        ref={fileInputRef}
        onChange={(e) => {
          /* parent handles this */
        }}
      />

      {replyingTo && (
        <Box
          sx={{
            display: "flex",
            p: 1,
            bgcolor: "#f5f5f5",
            borderLeft: "3px solid #1976d2",
            width: "100%",
          }}
        >
          <Box sx={{ flex: 1, mr: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Replying to {replyingTo.username}
            </Typography>
            <Typography variant="body2" color="text.primary" noWrap>
              {replyingTo.content}
            </Typography>
          </Box>
          <IconButton onClick={() => setReplyingTo(null)}>✕</IconButton>
        </Box>
      )}

      <Box
        sx={{
          p: 1.5,
          borderTop: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          size="medium"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          multiline
          maxRows={4}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
              bgcolor: "background.default",
            },
          }}
        />

        <IconButton
          color="primary"
          onClick={onSend}
          disabled={!message.trim() && selectedFilesCount === 0}
          sx={{
            bgcolor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.dark" },
            "&.Mui-disabled": { bgcolor: "action.disabledBackground" },
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
