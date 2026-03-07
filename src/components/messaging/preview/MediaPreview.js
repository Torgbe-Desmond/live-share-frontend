import {
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const MediaPreview = ({ media }) => {
  if (!media) return null;

  const { video } = media;
  const downloadUrls = media?.urls;

  function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

  return (
    <Card sx={{ maxWidth: 300, mt: 1, borderRadius: 2 }}>
      {/* Video Thumbnail */}
      <CardMedia
        component="img"
        height="160"
        image={video?.thumbnail}
        alt={video?.title}
        sx={{ objectFit: "cover" }}
      />

      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Typography variant="subtitle2" noWrap>
          {video?.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          @{video?.username}
        </Typography>

        {/* Download Button */}
       {downloadUrls.map((downloadUrl, index) => (
          <Button
            key={`${downloadUrl}-${generateRandomString(10)}`} 
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mt: 1.5 }}
          >
            Download {index + 1}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default MediaPreview;
