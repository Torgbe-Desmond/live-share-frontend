import MessageInput from "./MessageInput";

export default function ChatInput({
  message,
  setMessage,
  onSend,
  fileInputRef,
  selectedFiles,
  setSelectedFiles,
  replyingTo,
  setReplyingTo,
}) {
  return (
    <MessageInput
      message={message}
      setMessage={setMessage}
      onSend={onSend}
      fileInputRef={fileInputRef}
      selectedFilesCount={selectedFiles instanceof Set ? selectedFiles.size : selectedFiles?.length ?? 0}
      replyingTo={replyingTo}
      setReplyingTo={setReplyingTo}
      selectedFiles={selectedFiles}
      setSelectedFiles={setSelectedFiles}
    />
  );
}
