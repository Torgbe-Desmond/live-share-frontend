import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  ClickAwayListener,
  Grow,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  TextField,
  Tooltip,
  alpha,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ImageIcon from "@mui/icons-material/Image";
import { buildSelectedFile } from "../../utils/buildSelectedFile";
import { addFileToSelection } from "../../utils/addFileToSelection";

const ACTIONS = [
  { key: "image", label: "Image", icon: <ImageIcon sx={{ fontSize: 16 }} /> },
  { key: "file", label: "File", icon: <AttachFileIcon sx={{ fontSize: 16 }} /> },
];

const MAX_ALLOWED_MB = 50;

export default function MessageControls({
  message,
  setMessage,
  onSend,
  selectedFiles,
  selectedFilesCount,
  setSelectedFiles,
  fileInputRef,
  imageInputRef,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [menuOpen, setMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canSend = message?.trim() || selectedFilesCount > 0;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend();
    }
  };

  const checkFileSize = (file) => file?.size <= MAX_ALLOWED_MB * 1024 * 1024;

  useEffect(() => {
    if (selectedFilesCount > 1) {
      setSelectedFiles((prev) => {
        const arr = [...prev];
        return new Set([arr[0]]);
      });
      setErrorMessage("Only one file can be attached at a time.");
    }
  }, [selectedFilesCount, setSelectedFiles]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const rawFile of files) {
      if (selectedFilesCount >= 1) {
        setErrorMessage("Only one file can be attached at a time.");
        break;
      }
      if (!checkFileSize(rawFile)) {
        setErrorMessage(`File must be under ${MAX_ALLOWED_MB}MB.`);
        break;
      }
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
    <>
      {/* Hidden file inputs */}
      <input type="file" accept="image/*" hidden ref={imageInputRef} onChange={handleFileChange} />
      <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />

      <TextField
        fullWidth
        placeholder="Type a message…"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        multiline
        maxRows={5}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ alignSelf: "flex-end", mb: 0.5 }}>
              <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
                <Box sx={{ position: "relative" }}>
                  <Tooltip title="Attach" placement="top" arrow>
                    <IconButton
                      size="small"
                      onClick={() => setMenuOpen((p) => !p)}
                      sx={{
                        width: 30,
                        height: 30,
                        color: menuOpen ? "primary.main" : "text.disabled",
                        bgcolor: menuOpen
                          ? alpha(theme.palette.primary.main, 0.1)
                          : "transparent",
                        borderRadius: "8px",
                        border: `1px solid ${menuOpen ? alpha(theme.palette.primary.main, 0.3) : "transparent"}`,
                        transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          color: "primary.main",
                          bgcolor: alpha(theme.palette.primary.main, 0.07),
                        },
                      }}
                    >
                      <AddIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Tooltip>

                  {/* Attachment popover */}
                  <Grow in={menuOpen} style={{ transformOrigin: "bottom left" }}>
                    <Paper
                      elevation={8}
                      sx={{
                        position: "absolute",
                        bottom: "calc(100% + 10px)",
                        left: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.25,
                        p: 0.5,
                        borderRadius: "12px",
                        minWidth: 130,
                        bgcolor: isDark
                          ? alpha(theme.palette.background.paper, 0.97)
                          : "#fff",
                        border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                        backdropFilter: "blur(12px)",
                        boxShadow: `0 8px 24px ${alpha("#000", isDark ? 0.5 : 0.12)}`,
                        zIndex: 20,
                      }}
                    >
                      {ACTIONS.map(({ key, label, icon }) => (
                        <Box
                          key={key}
                          component="button"
                          onClick={() => handleActionClick(key)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            px: 1.5,
                            py: 0.875,
                            borderRadius: "8px",
                            border: "none",
                            bgcolor: "transparent",
                            color: "text.secondary",
                            fontSize: "0.82rem",
                            fontWeight: 500,
                            cursor: "pointer",
                            transition: "all 0.15s",
                            "&:hover": {
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              color: "primary.main",
                            },
                          }}
                        >
                          {icon}
                          {label}
                        </Box>
                      ))}
                    </Paper>
                  </Grow>
                </Box>
              </ClickAwayListener>
            </InputAdornment>
          ),

          endAdornment: (
            <InputAdornment position="end" sx={{ alignSelf: "flex-end", mb: 0.5 }}>
              <Tooltip title={canSend ? "Send" : ""} placement="top" arrow>
                <span>
                  <IconButton
                    onClick={onSend}
                    disabled={!canSend}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "9px",
                      bgcolor: canSend ? "primary.main" : "transparent",
                      border: `1px solid ${canSend ? "transparent" : alpha(theme.palette.divider, 0.5)}`,
                      color: canSend ? "#fff" : "text.disabled",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: canSend ? "primary.dark" : alpha(theme.palette.action.hover, 0.4),
                      },
                      "&:active": { transform: "scale(0.92)" },
                      "&.Mui-disabled": { bgcolor: "transparent", color: "text.disabled" },
                    }}
                  >
                    <SendIcon sx={{ fontSize: 15 }} />
                  </IconButton>
                </span>
              </Tooltip>
            </InputAdornment>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",
            bgcolor: isDark ? alpha("#fff", 0.04) : "#fff",
            fontSize: "0.9rem",
            alignItems: "flex-end",
            "& fieldset": {
              borderColor: alpha(theme.palette.divider, isDark ? 0.5 : 0.8),
              transition: "border-color 0.2s, box-shadow 0.2s",
            },
            "&:hover fieldset": {
              borderColor: alpha(theme.palette.primary.main, 0.4),
            },
            "&.Mui-focused fieldset": {
              borderColor: theme.palette.primary.main,
              borderWidth: "1px",
              boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
            },
          },
          "& .MuiInputBase-input": {
            py: 1.1,
            "&::placeholder": { color: "text.disabled", opacity: 1 },
          },
        }}
      />

      {/* Error snackbar */}
      <Snackbar
        open={Boolean(errorMessage)}
        autoHideDuration={4000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setErrorMessage("")}
          severity="warning"
          variant="filled"
          sx={{ borderRadius: 3, fontSize: "0.82rem" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
