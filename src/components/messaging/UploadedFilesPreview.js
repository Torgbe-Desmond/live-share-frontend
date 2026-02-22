import { Box } from "@mui/material";
import { useState } from "react";
import ImageFilePreview from "./ImageFilePreview";
import VideoFilePreview from "./VideoFilePreview";

export default function UploadedFilesPreview({
  selectedFiles,
  setSelectedFiles,
}) {
  // Track view-once status per file (using publicId or name as key)
  const [viewOnceMap, setViewOnceMap] = useState({});

  const handleRemove = (file) => {
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      // Remove the file from the set
      [...newSet].forEach((f) => {
        if (f.publicId === file.publicId) newSet.delete(f);
      });
      return newSet;
    });

    // Also clean up view-once state
    setViewOnceMap((prev) => {
      const next = { ...prev };
      delete next[file.publicId];
      return next;
    });
  };

  const toggleViewOnce = (file) => {
    setViewOnceMap((prev) => ({
      ...prev,
      [file.publicId]: !prev[file.publicId],
    }));
  };

  if (!selectedFiles || selectedFiles.size === 0) return null;


  return (
    <Box
      sx={{
        display: "flex",
        gap: 1.5,
        p: 1.5,
        overflowX: "auto",
        bgcolor: "#f8f9fa",
        borderRadius: 2,
        borderLeft: "4px solid #4caf50",
        maxWidth: "100%",
      }}
    >
      {[...selectedFiles].map((file) =>
        file.type?.startsWith("video/") ? (
          <VideoFilePreview
            key={file.publicId}
            file={file}
            onRemove={handleRemove}
            isViewOnce={!!viewOnceMap[file.publicId]}
            onToggleViewOnce={toggleViewOnce}
          />
        ) : (
          <ImageFilePreview
            key={file.publicId}
            file={file}
            onRemove={handleRemove}
            isViewOnce={!!viewOnceMap[file.publicId]}
            onToggleViewOnce={toggleViewOnce}
          />
        )
      )}
    </Box>
  );
}