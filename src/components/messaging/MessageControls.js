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
        // borderTop: "1px solid",
        // borderColor: "divider",
        // bgcolor: "background.paper",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      {/* <ActionMenu setSelectedFiles={setSelectedFiles} /> */}

      <TextField
        fullWidth
        size="medium"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        multiline
        elevation={10}
        maxRows={4}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "20px 20px 20px 20px",
            bgcolor: "background.default",
            mb: os === "iOS" ? 3 : 1.5,
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
  );
}
