import FileMedia from "./FileMedia";
import ImageMedia from "./ImageMedia";
import VideoMedia from "./VideoMedia";
import ViewOnceMedia from "./viewOnce/ViewOnceMedia";

const MessageMediaItem = ({
  file,
  isOwn,
  revealedFiles,
  viewedFiles,
  handleReveal,
  onMediaViewed,
  duration,
  setDuration,
}) => {
  const isViewOnce = !!file.viewOnce;
  const isVideo = file.type?.startsWith("video/");
  const isImage = file.type?.startsWith("image/");

  if (!isOwn && isViewOnce) {
    return (
      <ViewOnceMedia
        file={file}
        isVideo={isVideo}
        revealedFiles={revealedFiles}
        viewedFiles={viewedFiles}
        handleReveal={handleReveal}
        duration={duration}
        setDuration={setDuration}
      />
    );
  }

  if (isVideo) {
    return (
      <VideoMedia
        file={file}
        isViewOnce={isViewOnce}
        onMediaViewed={onMediaViewed}
      />
    );
  }

  if (isImage) {
    return (
      <ImageMedia
        file={file}
        isViewOnce={isViewOnce}
        onMediaViewed={onMediaViewed}
      />
    );
  }

  return (
    <FileMedia
      file={file}
      isViewOnce={isViewOnce}
      onMediaViewed={onMediaViewed}
    />
  );
};

export default MessageMediaItem;