import ReplyPreview from "./preview/ReplyPreview";
import UploadedFilesPreview from "./preview/UploadedFilesPreview";
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
    <div style={{ background: "transparent" }}>
      <input type="file" multiple hidden ref={fileInputRef} />

      <ReplyPreview replyingTo={replyingTo} setReplyingTo={setReplyingTo} />

      <UploadedFilesPreview
        setSelectedFiles={setSelectedFiles}
        selectedFiles={selectedFiles}
      />

      <MessageControls {...props} />
    </div>
  );
}
