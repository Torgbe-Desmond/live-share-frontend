import { useRef } from "react";
import ReplyPreview from "./preview/ReplyPreview";
import UploadedFilesPreview from "./preview/UploadedFilesPreview";
import MessageControls from "./MessageControls";

export default function MessageInput(props) {
  const { replyingTo, setReplyingTo, setSelectedFiles, selectedFiles } = props;

  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  return (
    <div style={{ background: "transparent" }}>
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
    </div>
  );
}
