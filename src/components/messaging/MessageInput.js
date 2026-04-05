import { useRef } from "react";
import { Box } from "@mui/material";
import ReplyPreview from "./preview/ReplyPreview";
import UploadedFilesPreview from "./preview/UploadedFilesPreview";
import MessageControls from "./MessageControls";

export default function MessageInput(props) {
  const { replyingTo, setReplyingTo, setSelectedFiles, selectedFiles } = props;

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 800,
        mx: "auto",
        px: 2,
        pb: 2,
        pt: 1,
        gap: 0.75,
        "& .css-k552tf ": {
          background: " transparent !important"
        }
      }}
    >
      <ReplyPreview replyingTo={replyingTo} setReplyingTo={setReplyingTo} />
      <UploadedFilesPreview
        setSelectedFiles={setSelectedFiles}
        selectedFiles={selectedFiles}
      />
      <MessageControls
        {...props}
        fileInputRef={fileInputRef}
        imageInputRef={imageInputRef}
      />
    </Box>
  );
}
