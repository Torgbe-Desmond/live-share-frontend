import MessageMediaItem from "./MessageMediaItem";

const MessageMediaList = (props) => {
  const { files } = props;

  if (!files?.length) return null;

  return files.map((file, index) => (
    <MessageMediaItem
      key={file.publicId || index}
      file={file}
      index={index}
      {...props}
    />
  ));
};

export default MessageMediaList;