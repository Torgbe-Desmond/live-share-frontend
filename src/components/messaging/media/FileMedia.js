import GenericFilePreview from "../preview/GenericFilePreview";

const FileMedia = ({ file, isViewOnce, onMediaViewed }) => {
  return (
    <GenericFilePreview
      file={file}
      restrictedViewOnce={isViewOnce}
      onViewed={() => isViewOnce && onMediaViewed?.(file.publicId)}
    />
  );
};

export default FileMedia;