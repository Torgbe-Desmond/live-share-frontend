import { useEffect, useState } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import { useTheme, useMediaQuery } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DownloadIcon from "@mui/icons-material/Download";

export default function GenericFilePreview({
  file,
  restrictedViewOnce = false,
  onViewed,
}) {
  const [revealed, setRevealed] = useState(!restrictedViewOnce);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (restrictedViewOnce && !revealed) {
      const timer = setTimeout(() => {
        setRevealed(true);
        onViewed?.();
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [restrictedViewOnce, revealed, onViewed]);

  const fileName = file.originalname || file.name || "attachment";

  const handleDownload = async () => {
    const url = file.path || (file.file && URL.createObjectURL(file.file));
    if (!url) return;

    try {
      const response = await fetch(url);
      const blob = await response.blob();

      const file_url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = file_url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(file_url);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank");
    }
  };

  // 🔒 View-once placeholder
  if (restrictedViewOnce && !revealed) {
    return (
      <Box
        onClick={() => setRevealed(true)}
        sx={{
          mt: 1.5,
          p: 2,
          width: "100%",
          maxWidth: 420,
          bgcolor: "rgba(0,0,0,0.08)",
          borderRadius: 2.5,
          textAlign: "center",
          cursor: "pointer",
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          "&:hover": { bgcolor: "rgba(0,0,0,0.15)" },
        }}
      >
        <DescriptionIcon />
        <Typography variant="body2">Tap to view file</Typography>
      </Box>
    );
  }

  return (
    <Box
      mt={1.2}
      sx={{
        width: "100%",
        maxWidth: 420,
        borderRadius: 2,
        overflow: "hidden",
        border: restrictedViewOnce ? "2px dashed #d32f2f" : "",
        p: isMobile ? 1.2 : 1.5,
        display: "flex",
        alignItems: "center",
        gap: 1,
        position: "relative",
      }}
    >
      <DescriptionIcon
        sx={{
          fontSize: isMobile ? 28 : 36,
          color: "#616161",
          flexShrink: 0,
        }}
      />

      <Typography
        variant="body2"
        sx={{
          flex: 1,
          fontSize: isMobile ? "0.85rem" : "0.9rem",
          wordBreak: "break-word", // ✅ important for mobile
        }}
      >
        {fileName}
      </Typography>

      <Tooltip title="Download">
        <IconButton
          size={isMobile ? "medium" : "small"} // ✅ better tap target
          onClick={handleDownload}
          sx={{
            bgcolor: "rgba(0,0,0,0.6)",
            color: "#fff",
            "&:hover": { bgcolor: "rgba(0,0,0,0.85)" },
          }}
        >
          <DownloadIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {restrictedViewOnce && (
        <Box
          sx={{
            position: "absolute",
            top: 6,
            left: 6,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            borderRadius: 10,
            px: 1,
            py: 0.4,
            fontSize: "0.7rem",
          }}
        >
          <VisibilityOffIcon fontSize="inherit" />
          <Typography variant="inherit">1×</Typography>
        </Box>
      )}
    </Box>
  );
}