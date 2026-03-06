import FilePreview from "../../preview/FilePreview";

const ViewOnceImage = ({ file }) => {
  return <FilePreview file={file} restrictedViewOnce={false} />;
};

export default ViewOnceImage;