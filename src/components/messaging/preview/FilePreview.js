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
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

export default function FilePreview({
  file,
  onRetry,
  showViewOnceToggle = false,
  onToggleViewOnce,
  restrictedViewOnce = false,
  onViewed,
}) {
  const [fileSrc, setFileSrc] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const hasTriggeredView = useRef(false);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  // Create object URL for local files
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

  // Mark as viewed for "View Once" files
  useEffect(() => {
    if (!restrictedViewOnce || hasTriggeredView.current) return;

    const timer = setTimeout(() => {
      hasTriggeredView.current = true;
      onViewed?.();
    }, 1200);

    return () => clearTimeout(timer);
  }, [restrictedViewOnce, onViewed]);

  // Listen for fullscreen change (Esc key, etc.)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const isViewOnce = !!file?.viewOnce;
  const fileName = file?.originalname || file?.name || "attachment";
  const isImage = fileSrc && file.type?.startsWith("image/");

  const handleDownload = async () => {
    if (!fileSrc) return;
    try {
      const response = await fetch(fileSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(fileSrc, "_blank");
    }
  };

  const handleToggleFullscreen = async () => {
    if (!containerRef.current || !isImage) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen error:", err);
    }
  };

  return (
    <Box
      ref={containerRef}
      id={file?.publicId}
      mt={1.2}
      borderRadius={2}
      overflow="hidden"
      position="relative"
      sx={{
        bgcolor: "#000",
        maxWidth: isFullscreen ? "100%" : 400,
        mx: "auto",
      }}
    >
      {/* Fullscreen Button - only show for images */}
      {isImage && (
        <IconButton
          size="small"
          onClick={handleToggleFullscreen}
          sx={{
            position: "absolute",
            top: 8,
            right: isViewOnce || showViewOnceToggle ? 52 : 8, // shift if other buttons exist
            bgcolor: "rgba(0,0,0,0.6)",
            color: "#fff",
            boxShadow: 1,
            zIndex: 20,
            "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
          }}
        >
          {isFullscreen ? (
            <FullscreenExitIcon sx={{ fontSize: 18 }} />
          ) : (
            <FullscreenIcon sx={{ fontSize: 18 }} />
          )}
        </IconButton>
      )}

      {/* Download Button */}
      <IconButton
        size="small"
        onClick={handleDownload}
        sx={{
          position: "absolute",
          bottom: 8,
          right: 8,
          bgcolor: isViewOnce ? "primary.main" : "rgba(255,255,255,0.9)",
          color: isViewOnce ? "white" : "text.primary",
          boxShadow: 1,
          zIndex: 20,
          "&:hover": { bgcolor: isViewOnce ? "primary.dark" : "white" },
        }}
      >
        <DownloadIcon sx={{ fontSize: 18 }} />
      </IconButton>

      {/* View Once Toggle (Sender side) */}
      {showViewOnceToggle && (
        <Tooltip title={isViewOnce ? "View once – can only be viewed once" : "Normal – multiple views"}>
          <IconButton
            size="small"
            onClick={() => onToggleViewOnce?.(file)}
            sx={{
              position: "absolute",
              top: 8,
              right: 52,
              bgcolor: isViewOnce ? "primary.main" : "rgba(255,255,255,0.9)",
              color: isViewOnce ? "white" : "text.primary",
              boxShadow: 1,
              zIndex: 20,
              "&:hover": { bgcolor: isViewOnce ? "primary.dark" : "white" },
            }}
          >
            <VisibilityOffIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}

      {/* Image Preview */}
      {isImage ? (
        <Box
          component="img"
          ref={imageRef}
          src={fileSrc}
          alt={file.originalname || "attachment"}
          sx={{
            display: "block",
            width: "100%",
            maxHeight: isFullscreen ? "100vh" : 300,
            objectFit: isFullscreen ? "contain" : "cover",
            borderRadius: isFullscreen ? 0 : 2,
            filter: isViewOnce || restrictedViewOnce ? "brightness(0.82) contrast(0.92)" : "none",
          }}
        />
      ) : (
        /* Non-image fallback */
        <Box
          sx={{
            width: "100%",
            p: 3,
            bgcolor: "#f5f5f5",
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
            zIndex: 20,
          }}
        >
          <VisibilityOffIcon fontSize="inherit" />
          <Typography variant="inherit">View once</Typography>
        </Box>
      )}

      {/* Upload overlay for local files */}
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
            zIndex: 30,
          }}
        >
          {file.isFailed ? (
            <IconButton
              onClick={() => onRetry?.(file)}
              sx={{ color: "white", bgcolor: "rgba(0,0,0,0.4)" }}
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