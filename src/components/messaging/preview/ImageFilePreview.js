import { Box, IconButton, Tooltip, alpha } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ImageFilePreview({ file, onRemove, isViewOnce = false }) {
  const src = file.file instanceof File
    ? URL.createObjectURL(file.file)
    : file.path;

  return (
    <Box
      sx={{
        position: "relative",
        flexShrink: 0,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: `0 2px 8px ${alpha("#000", 0.12)}`,
      }}
    >
      <Box
        component="img"
        src={src}
        alt="preview"
        sx={{
          width: 100,
          height: 80,
          objectFit: "cover",
          display: "block",
        }}
      />

      {/* Gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 50%)",
          pointerEvents: "none",
        }}
      />

      {/* Remove button */}
      <Tooltip title="Remove">
        <IconButton
          size="small"
          onClick={() => onRemove?.(file)}
          sx={{
            position: "absolute",
            top: 4,
            right: 4,
            p: 0.3,
            bgcolor: "rgba(0,0,0,0.55)",
            color: "#fff",
            "&:hover": { bgcolor: "rgba(0,0,0,0.75)" },
          }}
        >
          <CloseIcon sx={{ fontSize: 13 }} />
        </IconButton>
      </Tooltip>

      {isViewOnce && (
        <Box
          sx={{
            position: "absolute",
            bottom: 4,
            left: 4,
            bgcolor: "error.main",
            color: "#fff",
            fontSize: "0.6rem",
            fontWeight: 800,
            px: 0.7,
            py: 0.2,
            borderRadius: 1,
            letterSpacing: "0.05em",
          }}
        >
          1×
        </Box>
      )}
    </Box>
  );
}
