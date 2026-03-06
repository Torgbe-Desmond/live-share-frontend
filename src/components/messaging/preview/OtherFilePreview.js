import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import CloseIcon from "@mui/icons-material/Close";

export default function OtherFilePreview({ file, onRemove, isViewOnce = false }) {
  // Extract filename safely
  const fileName = file.name || file.file?.name || "Unknown file";

  return (
    <Box
      sx={{
        position: "relative",
        flexShrink: 0,
        width: 180,
        height: 120,
        bgcolor: "#e0e0e0",
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        p: 1,
      }}
    >
      {/* File Icon */}
      <DescriptionIcon sx={{ fontSize: 40, color: "#616161" }} />

      {/* File Name */}
      <Typography
        variant="caption"
        sx={{
          mt: 0.5,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          width: "100%",
        }}
      >
        {fileName}
      </Typography>

      {/* Remove Button */}
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

      {/* View Once Label */}
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
          }}
        >
          1× VIEW
        </Box>
      )}
    </Box>
  );
}