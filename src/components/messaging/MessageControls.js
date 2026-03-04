import { Box, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
// import ActionMenu from "./ActionMenu";
import useDeviceOS from "../useDeviceOS";

export default function MessageControls({
  message,
  setMessage,
  onSend,
  selectedFilesCount,
  setSelectedFiles,
}) {
  const os = useDeviceOS();
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Box
      sx={{
        p: 1.5,
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {/* <ActionMenu setSelectedFiles={setSelectedFiles} /> */}

      <TextField
        fullWidth
        size="small"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        multiline
        maxRows={4}
        InputProps={{
          endAdornment: (
            <IconButton
              color="primary"
              onClick={onSend}
              disabled={!message.trim() && selectedFilesCount === 0}
              size="small"
              sx={{
                bgcolor: "primary.main",
                color: "white",
                p: 0.8,
                "&:hover": { bgcolor: "primary.dark" },
                "&.Mui-disabled": { bgcolor: "action.disabledBackground" },
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: 5,
            bgcolor: "background.default",
            paddingTop: "4px",  
            paddingBottom: "4px",
          },
          "& textarea": {
            padding: "6px 8px", 
          },
          mb: os === "iOS" ? 2 : 0.5,
        }}
      />
    </Box>
  );
}
