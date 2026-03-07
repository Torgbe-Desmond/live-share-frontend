import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
// import MusicNoteIcon from "@mui/icons-material/MusicNote"; // TikTok-style icon

export default function MessageControls({
  message,
  setMessage,
  onSend,
  selectedFilesCount,
  setSelectedFiles,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        flexDirection: "column", 
        width: "100%",
        maxWidth: 800,
        mx: "auto",
        borderTop: isDark ? `1px solid ${theme.palette.divider}` : "none",
        bgcolor: "background.default",
      }}
    >
  

      <TextField
        fullWidth
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        multiline
        maxRows={4}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={onSend}
                disabled={!message?.trim() && selectedFilesCount === 0}
                sx={{
                  bgcolor:
                    message?.trim() || selectedFilesCount > 0
                      ? "primary.main"
                      : "action.disabledBackground",
                  color: "white",
                  width: 32,
                  height: 32,
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <SendIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          mt: 1,
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px",
            bgcolor: isDark ? "#202327" : "#f0f2f5",
            "& fieldset": { border: "none" },
          },
        }}
      />
    </Box>
  );
}
