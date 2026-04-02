import { useState, useRef } from "react";
import {
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Tooltip,
  useTheme,
  Paper,
  Grow,
  ClickAwayListener,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ImageIcon from "@mui/icons-material/Image";
import { buildSelectedFile } from "../../utils/buildSelectedFile";
import { addFileToSelection } from "../../utils/addFileToSelection";

const ACTIONS = [
  { key: "image", label: "Image", icon: <ImageIcon fontSize="small" /> },
  { key: "file", label: "File", icon: <AttachFileIcon fontSize="small" /> },
];

export default function MessageControls({
  message,
  setMessage,
  onSend,
  selectedFilesCount,
  setSelectedFiles,
  fileInputRef,
  imageInputRef,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [menuOpen, setMenuOpen] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const rawFile of files) {
      const built = await buildSelectedFile(rawFile);
      addFileToSelection(built, setSelectedFiles);
    }
    e.target.value = "";
  };

  const handleActionClick = (key) => {
    setMenuOpen(false);
    if (key === "image") imageInputRef?.current?.click();
    if (key === "file") fileInputRef?.current?.click();
  };

  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        alignItems: "flex-end",
        gap: 0.5,
        width: "100%",
        maxWidth: 800,
        mx: "auto",
        borderTop: isDark ? `1px solid ${theme.palette.divider}` : "none",
        bgcolor: "background.default",
      }}
    >
      {/* Hidden inputs */}
      <input type="file" accept="image/*" multiple hidden ref={imageInputRef} onChange={handleFileChange} />
      <input type="file" multiple hidden ref={fileInputRef} onChange={handleFileChange} />

      <TextField
        fullWidth
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        multiline
        maxRows={4}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {/* Anchor wrapper — menu positions relative to this */}
              <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
                <Box sx={{ position: "relative" }}>
                  <Tooltip title="Add attachment" placement="top">
                    <IconButton
                      size="small"
                      onClick={() => setMenuOpen((prev) => !prev)}
                      sx={{
                        color: menuOpen ? "primary.main" : "text.secondary",
                        transition: "transform 0.25s ease, color 0.2s",
                        transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  {/* Menu grows upward from the + button */}
                  <Grow in={menuOpen} style={{ transformOrigin: "bottom left" }}>
                    <Paper
                      elevation={4}
                      sx={{
                        position: "absolute",
                        bottom: "calc(100% + 8px)",
                        left: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        p: 0.75,
                        borderRadius: 3,
                        minWidth: 44,
                        bgcolor: "background.paper",
                        border: `1px solid ${theme.palette.divider}`,
                        zIndex: 10,
                      }}
                    >
                      {ACTIONS.map(({ key, label, icon }) => (
                        <Tooltip key={key} title={label} placement="right" arrow>
                          <IconButton
                            size="small"
                            onClick={() => handleActionClick(key)}
                            sx={{
                              color: "text.secondary",
                              borderRadius: 2,
                              "&:hover": {
                                color: "primary.main",
                                bgcolor: isDark
                                  ? "rgba(255,255,255,0.06)"
                                  : "rgba(0,0,0,0.04)",
                              },
                            }}
                          >
                            {icon}
                          </IconButton>
                        </Tooltip>
                      ))}
                    </Paper>
                  </Grow>
                </Box>
              </ClickAwayListener>
            </InputAdornment>
          ),
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