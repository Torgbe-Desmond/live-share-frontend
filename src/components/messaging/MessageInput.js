import { Box } from "@mui/material";
import ReplyPreview from "./ReplyPreview";
import UploadedFilesPreview from "./UploadedFilesPreview";
import MessageControls from "./MessageControls";
// import { ChatDemo } from "./DockedChatWindows";

export default function MessageInput(props) {
  const {
    fileInputRef,
    replyingTo,
    setReplyingTo,
    setSelectedFiles,
    selectedFiles,
  } = props;

  return (
    <Box>
      <input type="file" multiple hidden ref={fileInputRef} />

      <ReplyPreview replyingTo={replyingTo} setReplyingTo={setReplyingTo} />
      {/* <ChatDemo /> */}
      <UploadedFilesPreview
        setSelectedFiles={setSelectedFiles}
        selectedFiles={selectedFiles}
      />

      <MessageControls {...props} />
    </Box>
  );
}
