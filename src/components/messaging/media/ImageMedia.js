import FilePreview from "../preview/FilePreview";

const ImageMedia = ({ file, isViewOnce, onMediaViewed }) => {
  return (
    <FilePreview
      file={file}
      restrictedViewOnce={false}
      onViewed={() => isViewOnce && onMediaViewed?.(file.publicId)}
    />
  );
};

export default ImageMedia;