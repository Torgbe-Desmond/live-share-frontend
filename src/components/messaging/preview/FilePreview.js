import { useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DownloadIcon from "@mui/icons-material/Download";

export default function FilePreview({
  file,
  onRetry,
  showViewOnceToggle = false,
  onToggleViewOnce,
  restrictedViewOnce = false,
  onViewed,
}) {
  const [fileSrc, setFileSrc] = useState("");
  const hasTriggeredView = useRef(false);

  useEffect(() => {
    let objectUrl;
    if (file.local && file.file instanceof File) {
      objectUrl = URL.createObjectURL(file.file);
      setFileSrc(objectUrl);
    } else {
      setFileSrc(file.path || "");
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  // Receiver: mark as viewed shortly after render (or on click)
  useEffect(() => {
    if (!restrictedViewOnce || hasTriggeredView.current) return;

    const timer = setTimeout(() => {
      hasTriggeredView.current = true;
      onViewed?.();
    }, 1200); // give time to see it – adjust or use onClick instead

    return () => clearTimeout(timer);
  }, [restrictedViewOnce, onViewed]);

  const isViewOnce = !!file?.viewOnce;

  const fileName = file?.originalname || file?.name || "attachment";

  const handleDownload = async () => {
    if (!fileSrc) return;

    try {
      // 1. Fetch the file data
      const response = await fetch(fileSrc);
      const blob = await response.blob();

      // 2. Create a local URL for the blob data
      const url = window.URL.createObjectURL(blob);

      // 3. Create the temporary link
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName; // Now the browser WILL respect this

      document.body.appendChild(link);
      link.click();

      // 4. Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: try opening in new tab if fetch fails (CORS issue)
      window.open(fileSrc, "_blank");
    }
  };
  
  return (
    <Box
      id={file?.publicId}
      mt={1.2}
      borderRadius={2}
      overflow="hidden"
      position="relative"
    >

      <IconButton
        size="small"
        onClick={handleDownload}
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          bgcolor: isViewOnce ? "primary.main" : "rgba(255,255,255,0.9)",
          color: isViewOnce ? "white" : "text.primary",
          boxShadow: 1,
          "&:hover": { bgcolor: isViewOnce ? "primary.dark" : "white" },
        }}

      >
        <DownloadIcon sx={{ fontSize: 18 }} />
      </IconButton>

      {fileSrc && file.type?.startsWith("image/") ? (
        <Box
          component="img"
          src={fileSrc}
          alt={file.originalname || "attachment"}
          sx={{
            display: "block",
            maxWidth: 400,
            maxHeight: 300,
            borderRadius: 2,
            filter: isViewOnce || restrictedViewOnce ? "brightness(0.82) contrast(0.92)" : "none",
          }}
        />
      ) : (
        <Box
          sx={{
            width: "100%",
            p: 2,
            bgcolor: "#e0e0e0",
            borderRadius: 2,
            textAlign: "center",
            fontSize: 13,
            wordBreak: "break-word",
            color: "text.secondary",
          }}
        >
          {file.originalname || file.name || "File"}
          <br />
          <small>{(file.size / 1024 / 1024).toFixed(1)} MB</small>
        </Box>
      )}

      {/* Sender toggle */}
      {showViewOnceToggle && (
        <Tooltip
          title={isViewOnce ? "View once – can only be viewed once" : "Normal – multiple views"}
        >
          <IconButton
            size="small"
            onClick={() => onToggleViewOnce?.(file)}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: isViewOnce ? "primary.main" : "rgba(255,255,255,0.9)",
              color: isViewOnce ? "white" : "text.primary",
              boxShadow: 1,
              "&:hover": { bgcolor: isViewOnce ? "primary.dark" : "white" },
            }}
          >
            <VisibilityOffIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* View once badge */}
      {isViewOnce && (
        <Box
          sx={{
            position: "absolute",
            bottom: 8,
            left: 8,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            bgcolor: "rgba(0,0,0,0.7)",
            color: "white",
            borderRadius: 10,
            px: 1,
            py: 0.4,
            fontSize: "0.78rem",
          }}
        >
          <VisibilityOffIcon fontSize="inherit" />
          <Typography variant="inherit">View once</Typography>
        </Box>
      )}

      {/* Upload overlay — only for our own locally-sent files awaiting confirmation */}
      {file.local && !file.isSuccess && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 2,
            zIndex: 5,
          }}
        >
          {file.isFailed ? (
            <IconButton
              onClick={() => onRetry?.(file)}
              sx={{ color: "white", bgcolor: "rgba(0,0,0,0.4)" }}
              title="Retry"
            >
              <ReplayIcon />
            </IconButton>
          ) : (
            <CircularProgress size={36} sx={{ color: "white" }} />
          )}
        </Box>
      )}
    </Box>
  );
}