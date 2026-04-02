import { Typography, Button, Card, CardMedia, CardContent } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const MediaPreview = ({ media }) => {
  if (!media) return null;

  const { video } = media;
  const downloadUrls = Array.isArray(media?.urls) ? media.urls : [];

  return (
    <Card sx={{ maxWidth: 300, mt: 1, borderRadius: 2 }}>
      <CardMedia
        component="img"
        height="160"
        image={video?.thumbnail}
        alt={video?.title || "Media"}
        sx={{ objectFit: "cover" }}
      />

      <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Typography variant="subtitle2" noWrap>
          {video?.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block">
          @{video?.username}
        </Typography>

        {downloadUrls.map((url, index) => (
          <Button
            key={`${url}-${index}`}
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<DownloadIcon />}
            href={url}
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
