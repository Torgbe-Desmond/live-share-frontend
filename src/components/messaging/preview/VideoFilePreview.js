import { Box, IconButton, Tooltip } from "@mui/material";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import CloseIcon from "@mui/icons-material/Close";

export default function VideoFilePreview({
  file,
  onRemove,
  isViewOnce = false,
  onToggleViewOnce,
}) {
  return (
    <Box sx={{ position: "relative", flexShrink: 0 }}>
      <Box
        component="video"
        src={URL.createObjectURL(file.file || file)}
        controls
        muted
        sx={{
          width: 180,
          height: 120,
          objectFit: "cover",
          borderRadius: 2,
          display: "block",
          bgcolor: "black",
        }}
      />

      {/* View Once toggle */}
      {/* <Tooltip
        title={
          isViewOnce
            ? "View once – disappears after being seen"
            : "Normal – can be replayed"
        }
      >
        <IconButton
          size="small"
          onClick={() => onToggleViewOnce?.(file)}
          sx={{
            position: "absolute",
            top: 6,
            right: 44,
            bgcolor: isViewOnce ? "#1976d2" : "rgba(255,255,255,0.9)",
            color: isViewOnce ? "white" : "inherit",
            boxShadow: 1,
            "&:hover": { bgcolor: isViewOnce ? "#1565c0" : "white" },
          }}
        >
          {isViewOnce ? (
            <VisibilityOffIcon fontSize="small" />
          ) : (
            <VisibilityIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip> */}

      {/* Remove button */}
      <Tooltip title="Remove">
        <IconButton
          size="small"
          onClick={() => onRemove?.(file)}
          sx={{
            position: "absolute",
            top: 6,
            right: 6,
            bgcolor: "rgba(255,255,255,0.9)",
            color: "error.main",
            boxShadow: 1,
            "&:hover": { bgcolor: "#ffebee" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Optional: small badge when view-once is active */}
      {isViewOnce && (
        <Box
          sx={{
            position: "absolute",
            bottom: 6,
            left: 6,
            bgcolor: "#d32f2f",
            color: "white",
            fontSize: "0.65rem",
            fontWeight: "bold",
            px: 0.8,
            py: 0.3,
            borderRadius: 6,
            lineHeight: 1,
          }}
        >
          1× VIEW
        </Box>
      )}
    </Box>
  );
}