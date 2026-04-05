import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  ClickAwayListener,
  Grow,
  IconButton,
  Paper,
  Snackbar,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ImageIcon from "@mui/icons-material/Image";
import CloseIcon from "@mui/icons-material/Close";
import MicIcon from "@mui/icons-material/Mic";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { buildSelectedFile } from "../../utils/buildSelectedFile";
import { addFileToSelection } from "../../utils/addFileToSelection";

const ACTIONS = [
  { key: "image", label: "Image", icon: <ImageIcon sx={{ fontSize: 16 }} /> },
  { key: "file", label: "File", icon: <AttachFileIcon sx={{ fontSize: 16 }} /> },
];

const MAX_ALLOWED_MB = 50;

// ─── Attachment pill ──────────────────────────────────────────────────────────
function AttachmentPill({ file, onRemove, theme }) {
  const isImage = file?.type?.startsWith("image/");
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.5,
        borderRadius: "9999px",
        bgcolor: alpha(theme.palette.primary.main, 0.1),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.25)}`,
        maxWidth: 200,
      }}
    >
      {isImage ? (
        <ImageIcon sx={{ fontSize: 13, color: "primary.main", flexShrink: 0 }} />
      ) : (
        <AttachFileIcon sx={{ fontSize: 13, color: "primary.main", flexShrink: 0 }} />
      )}
      <Typography noWrap sx={{ fontSize: "0.72rem", fontWeight: 600, color: "primary.main" }}>
        {file?.name ?? "Attachment"}
      </Typography>
      <IconButton size="small" onClick={onRemove} sx={{ p: 0, color: "primary.main", opacity: 0.7, "&:hover": { opacity: 1 } }}>
        <CloseIcon sx={{ fontSize: 12 }} />
      </IconButton>
    </Box>
  );
}

// ─── Animated recording waveform ─────────────────────────────────────────────
function RecordingWave() {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "3px", height: 18 }}>
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          sx={{
            width: 3,
            borderRadius: 2,
            bgcolor: "error.main",
            animation: "wave 0.8s ease-in-out infinite",
            animationDelay: `${i * 0.12}s`,
            "@keyframes wave": {
              "0%, 100%": { height: 3 },
              "50%": { height: 14 },
            },
          }}
        />
      ))}
    </Box>
  );
}

// ─── Format seconds → "0:00" ──────────────────────────────────────────────────
function formatDuration(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MessageControls({
  message,
  setMessage,
  onSend,
  onSendAudio,
  selectedFiles = [],
  selectedFilesCount,
  setSelectedFiles,
  fileInputRef,
  imageInputRef,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const textareaRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [fileSizeMessage, setFileSizeMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // ── Recording state ──
  const [recording, setRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [message]);

  // Cleanup recorder on unmount
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      mediaRecorderRef.current?.stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const canSend = message?.trim() || selectedFilesCount > 0;
  const showMic = !message?.trim() && selectedFilesCount === 0 && !recording;

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) onSend();
    }
  };

  const checkFileSize = (file) => file?.size <= MAX_ALLOWED_MB * 1024 * 1024;
  const checkFileCount = () => selectedFilesCount <= 1;

  useEffect(() => {
    if (selectedFilesCount > 1) {
      setSelectedFiles((prev) => [prev[0]]);
      setFileSizeMessage("Only one file can be attached at a time.");
    }
  }, [selectedFilesCount, setSelectedFiles]);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    for (const rawFile of files) {
      if (!checkFileCount()) { setFileSizeMessage("Only one file can be attached at a time."); break; }
      if (!checkFileSize(rawFile)) { setFileSizeMessage(`File must be under ${MAX_ALLOWED_MB}MB.`); break; }
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

  const handleRemoveFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Recording handlers ────────────────────────────────────────────────────
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setRecording(true);
      setRecordDuration(0);
      timerRef.current = setInterval(() => setRecordDuration((d) => d + 1), 1000);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const discardRecording = () => {
    clearInterval(timerRef.current);
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current?.stream?.getTracks().forEach((t) => t.stop());
    chunksRef.current = [];
    setRecording(false);
    setRecordDuration(0);
  };

  const sendRecording = () => {
    clearInterval(timerRef.current);
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const audioFile = new File([blob], `voice-${Date.now()}.webm`, { type: "audio/webm" });
      onSendAudio?.(audioFile);
      chunksRef.current = [];
    };

    mediaRecorder.stop();
    mediaRecorder.stream?.getTracks().forEach((t) => t.stop());
    setRecording(false);
    setRecordDuration(0);
  };

  // ── Border glow ───────────────────────────────────────────────────────────
  const borderColor = recording
    ? alpha(theme.palette.error.main, 0.4)
    : isFocused
    ? alpha(theme.palette.primary.main, 0.5)
    : alpha(theme.palette.divider, isDark ? 0.6 : 0.9);

  const glowShadow = recording
    ? `0 0 0 3px ${alpha(theme.palette.error.main, 0.1)}`
    : isFocused
    ? `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`
    : `0 2px 8px ${alpha("#000", isDark ? 0.3 : 0.06)}`;

  return (
    <Box sx={{ px: 2, pb: 2, pt: 1, display: "flex", flexDirection: "column", width: "100%", maxWidth: 800, mx: "auto" }}>
      {/* Hidden file inputs */}
      <input type="file" accept="image/*" hidden ref={imageInputRef} onChange={handleFileChange} />
      <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />

      {/* Attachment pills */}
      {selectedFiles?.length > 0 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 1, px: 0.5 }}>
          {selectedFiles.map((file, i) => (
            <AttachmentPill key={i} file={file} onRemove={() => handleRemoveFile(i)} theme={theme} />
          ))}
        </Box>
      )}

      {/* Input container */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: 1,
          borderRadius: "16px",
          border: `1px solid ${borderColor}`,
          boxShadow: glowShadow,
          bgcolor: isDark ? alpha("#fff", 0.04) : "#fff",
          px: 1,
          py: 0.75,
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
        }}
      >
        {/* Add button */}
        {!recording && (
          <ClickAwayListener onClickAway={() => setMenuOpen(false)}>
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Tooltip title="Attach" placement="top" arrow>
                <IconButton
                  size="small"
                  onClick={() => setMenuOpen((p) => !p)}
                  sx={{
                    width: 32,
                    height: 32,
                    color: menuOpen ? "primary.main" : "text.disabled",
                    bgcolor: menuOpen ? alpha(theme.palette.primary.main, 0.1) : "transparent",
                    border: `1px solid ${menuOpen ? alpha(theme.palette.primary.main, 0.3) : "transparent"}`,
                    borderRadius: "10px",
                    transition: "all 0.2s ease",
                    transform: menuOpen ? "rotate(45deg)" : "rotate(0deg)",
                    "&:hover": { color: "primary.main", bgcolor: alpha(theme.palette.primary.main, 0.08) },
                  }}
                >
                  <AddIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>

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
                    bgcolor: isDark ? alpha(theme.palette.background.paper, 0.96) : "#fff",
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    backdropFilter: "blur(12px)",
                    zIndex: 20,
                    minWidth: 120,
                    boxShadow: `0 8px 24px ${alpha("#000", isDark ? 0.5 : 0.12)}`,
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
                        px: 1.25,
                        py: 0.75,
                        borderRadius: "8px",
                        border: "none",
                        bgcolor: "transparent",
                        color: "text.secondary",
                        fontSize: "0.8rem",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.15s",
                        "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.08), color: "primary.main" },
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
        )}

        {/* Recording indicator OR textarea */}
        {recording ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flex: 1, p: 0.5 }}>
            {/* Pulsing dot */}
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: "error.main",
                flexShrink: 0,
                animation: "pulse 1.2s ease-in-out infinite",
                "@keyframes pulse": {
                  "0%, 100%": { opacity: 1, transform: "scale(1)" },
                  "50%": { opacity: 0.4, transform: "scale(0.75)" },
                },
              }}
            />
            <RecordingWave />
            <Typography
              sx={{
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "error.main",
                fontVariantNumeric: "tabular-nums",
                ml: 0.25,
              }}
            >
              {formatDuration(recordDuration)}
            </Typography>
          </Box>
        ) : (
          <Box
            component="textarea"
            ref={textareaRef}
            placeholder="Type a message…"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            rows={1}
            sx={{
              flex: 1,
              resize: "none",
              border: "none",
              outline: "none",
              bgcolor: "transparent",
              color: "text.primary",
              fontSize: "0.9rem",
              lineHeight: 1.6,
              fontFamily: "inherit",
              py: 0.5,
              px: 0.5,
              overflowY: "auto",
              maxHeight: 120,
              "&::placeholder": { color: "text.disabled" },
              "&::-webkit-scrollbar": { width: 4 },
              "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
              "&::-webkit-scrollbar-thumb": { borderRadius: 4, bgcolor: alpha(theme.palette.divider, 0.5) },
            }}
          />
        )}

        {/* Right side buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, flexShrink: 0 }}>
          {recording ? (
            <>
              {/* Discard */}
              <Tooltip title="Discard" placement="top" arrow>
                <IconButton
                  size="small"
                  onClick={discardRecording}
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "10px",
                    color: "text.disabled",
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    "&:hover": { color: "error.main", borderColor: alpha(theme.palette.error.main, 0.4), bgcolor: alpha(theme.palette.error.main, 0.06) },
                  }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                </IconButton>
              </Tooltip>

              {/* Send recording */}
              <Tooltip title="Send voice message" placement="top" arrow>
                <IconButton
                  size="small"
                  onClick={sendRecording}
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "10px",
                    bgcolor: "error.main",
                    color: "#fff",
                    "&:hover": { bgcolor: "error.dark" },
                    "&:active": { transform: "scale(0.93)" },
                  }}
                >
                  <SendIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </>
          ) : (
            <>
              {/* Mic — only when nothing to send */}
              {showMic && (
                <Tooltip title="Voice message" placement="top" arrow>
                  <IconButton
                    size="small"
                    onClick={startRecording}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "10px",
                      color: "text.disabled",
                      border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        color: "error.main",
                        borderColor: alpha(theme.palette.error.main, 0.4),
                        bgcolor: alpha(theme.palette.error.main, 0.06),
                      },
                    }}
                  >
                    <MicIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}

              {/* Send */}
              <Tooltip title={canSend ? "Send" : ""} placement="top" arrow>
                <span>
                  <IconButton
                    onClick={onSend}
                    disabled={!canSend}
                    sx={{
                      width: 34,
                      height: 34,
                      flexShrink: 0,
                      borderRadius: "10px",
                      bgcolor: canSend ? "primary.main" : "transparent",
                      border: `1px solid ${canSend ? "transparent" : alpha(theme.palette.divider, 0.5)}`,
                      color: canSend ? "#fff" : "text.disabled",
                      transition: "all 0.2s ease",
                      "&:hover": { bgcolor: canSend ? "primary.dark" : alpha(theme.palette.action.hover, 0.4) },
                      "&:active": { transform: "scale(0.93)" },
                      "&.Mui-disabled": { bgcolor: "transparent", color: "text.disabled" },
                    }}
                  >
                    <SendIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </span>
              </Tooltip>
            </>
          )}
        </Box>
      </Box>

      {/* Hint text */}
      <Typography sx={{ fontSize: "0.68rem", color: "text.disabled", mt: 0.75, px: 0.5, textAlign: "right", letterSpacing: "0.02em" }}>
        {recording ? "Recording… click send or discard" : "Enter to send · Shift+Enter for new line"}
      </Typography>

      {/* Error snackbar */}
      <Snackbar
        open={Boolean(fileSizeMessage)}
        autoHideDuration={4000}
        onClose={() => setFileSizeMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setFileSizeMessage("")} severity="warning" variant="filled" sx={{ borderRadius: 3, fontSize: "0.82rem" }}>
          {fileSizeMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}