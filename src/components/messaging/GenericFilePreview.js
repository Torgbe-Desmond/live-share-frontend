import { useEffect, useState } from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DownloadIcon from "@mui/icons-material/Download";

export default function GenericFilePreview({
  file,
  restrictedViewOnce = false,
  onViewed,
}) {
  const [revealed, setRevealed] = useState(!restrictedViewOnce);

  useEffect(() => {
    if (restrictedViewOnce && !revealed) {
      // mark as viewed after revealing
      const timer = setTimeout(() => {
        setRevealed(true);
        onViewed?.();
      }, 30000); // 30s view-once timer
      return () => clearTimeout(timer);
    }
  }, [restrictedViewOnce, revealed, onViewed]);

  const fileName = file.originalname || file.name || "attachment";

  const handleDownload = () => {
    const url = file.path || (file.file && URL.createObjectURL(file.file));
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // If it was a local object URL, revoke it after download
    if (file.file) URL.revokeObjectURL(url);
  };

  if (restrictedViewOnce && !revealed) {
    return (
      <Box
        onClick={() => setRevealed(true)}
        sx={{
          mt: 1.5,
          p: 2,
          bgcolor: "rgba(0,0,0,0.08)",
          borderRadius: 2.5,
          textAlign: "center",
          cursor: "pointer",
          maxWidth: 420,
          display: "flex",
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
      borderRadius={2}
      overflow="hidden"
      sx={{
        border: restrictedViewOnce ? "2px dashed #d32f2f" : "2px solid #ccc",
        p: 1.5,
        display: "flex",
        alignItems: "center",
        gap: 1,
        maxWidth: 420,
        position: "relative",
      }}
    >
      <DescriptionIcon sx={{ fontSize: 36, color: "#616161" }} />
      <Typography
        variant="body2"
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          flex: 1,
        }}
      >
        {fileName}
      </Typography>

      {/* Download button */}
      <Tooltip title="Download">
        <IconButton
          size="small"
          onClick={handleDownload}
          sx={{
            bgcolor: "rgba(255,255,255,0.9)",
            "&:hover": { bgcolor: "#f0f0f0" },
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
            fontSize: "0.75rem",
          }}
        >
          <VisibilityOffIcon fontSize="inherit" />
          <Typography variant="inherit">1×</Typography>
        </Box>
      )}
    </Box>
  );
}