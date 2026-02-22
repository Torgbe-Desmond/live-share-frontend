import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import { uploadFile } from "../../api/fileApi";
import ImageFilePreview from "./ImageFilePreview";
import VideoFilePreview from "./VideoFilePreview";

export default function FileUploadModal({ open, setOpen, setUploadedFiles }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [_uploadedFile, set_UploadedFile] = useState(null);

  const handleClose = () => {
    setOpen(false);
    set_UploadedFile(null);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadSuccess(false);
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setUploadSuccess(false);
    setUploadError(null);

    if (file.type.startsWith("image/"))
      setPreviewUrl(URL.createObjectURL(file));
    else setPreviewUrl(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const roomId = localStorage.getItem("roomName");
    const { success, data, error } = await uploadFile(selectedFile, roomId);
    setUploading(false);

    if (success) {
      set_UploadedFile(data);
      setUploadSuccess(true);
    } else {
      setUploadError(error || "Upload failed");
    }
  };

  const handleAdd = () => {
    if (!uploadSuccess || !_uploadedFile) return;
    setUploadedFiles((prev) => {
      const newSet = new Set(prev);
      const exists = [...newSet].some(
        (f) => f.publicId === _uploadedFile.publicId,
      );
      if (!exists) newSet.add(_uploadedFile);
      return newSet;
    });
    handleClose();
  };

  const handleRemove = (file) => setSelectedFile(null);

  return (
    <Dialog open={open} onClose={() => {}} fullWidth maxWidth="sm">
      <DialogTitle>
        Add File to Chat
        {/* <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton> */}
      </DialogTitle>

      <DialogContent dividers>
        {!selectedFile ? (
          <Box
            component="label"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: "2px dashed",
              borderColor: "divider",
              borderRadius: 3,
              p: { xs: 6, sm: 8 },
              textAlign: "center",
              cursor: "pointer",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <input type="file" hidden onChange={handleFileChange} />
            <Typography variant="h6" gutterBottom>
              Click or drag file here
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supported: images, videos, PDFs, documents
            </Typography>
          </Box>
        ) : selectedFile.type.startsWith("video/") ? (
          <VideoFilePreview file={selectedFile} onRemove={handleRemove} />
        ) : (
          <ImageFilePreview file={selectedFile} onRemove={handleRemove} />
        )}

        {uploading && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              my: 3,
            }}
          >
            <CircularProgress size={28} />
            <Typography>Uploading...</Typography>
          </Box>
        )}
        {uploadSuccess && (
          <Box
            sx={{
              color: "success.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              my: 3,
            }}
          >
            <CheckCircleIcon />
            <Typography>File uploaded successfully!</Typography>
          </Box>
        )}
        {uploadError && (
          <Typography color="error" sx={{ my: 2 }}>
            {uploadError}
          </Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={uploading}>
          Cancel
        </Button>
        {!selectedFile ? null : uploading ? (
          <Button variant="contained" disabled>
            Uploading...
          </Button>
        ) : uploadSuccess ? (
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Add
          </Button>
        ) : (
          <Button variant="contained" onClick={handleUpload}>
            Upload
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
