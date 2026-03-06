import { Box } from "@mui/material";
import Video from "../../../../viewOnce/Video";

const ViewOnceVideo = ({ file, duration, setDuration }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1300,
        bgcolor: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Video
        url={file.path}
        fullscreen={true}
        setDuration={setDuration}
        duration={duration}
      />
    </Box>
  );
};

export default ViewOnceVideo;