import VideoPreview from "../preview/VideoPreview";

const VideoMedia = ({ file, isViewOnce, onMediaViewed }) => {
  return (
    <VideoPreview
      file={file}
      restrictedViewOnce={false}
      onViewed={() => isViewOnce && onMediaViewed?.(file.publicId)}
    />
  );
};

export default VideoMedia;