import React, { useState } from 'react';
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemSecondaryAction,
    Avatar,
    Typography,
    Tooltip,
    Divider,
    Box,
} from '@mui/material';
import {
    Close as CloseIcon,
    Download as DownloadIcon,
    Image as ImageIcon,
} from '@mui/icons-material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

const FileDrawer = ({ files = [], buttonText = "View Attachments" }) => {
    const [open, setOpen] = useState(false);

    const handleDownload = async (file) => {
        if (!file?.path) return;

        try {
            const response = await fetch(file.path);
            const blob = await response.blob();

            const file_url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = file_url;
            link.download = file.originalname || "download";

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            window.URL.revokeObjectURL(file_url);
        } catch (error) {
            console.error("Download failed:", error);
            window.open(file.path, "_blank"); // Fallback
        }
    };

    const getFileIcon = (file) => {
        if (file?.type && file.type.startsWith('image/')) {
            return <ImageIcon />;
        }
        return <InsertDriveFileIcon />;
    };

    const isImage = (type) => type && type.startsWith('image/');

    return (
        <>
            {/* Open Button - Only show if there are files */}
            {files.size > 0 && (
                <Box sx={{ pr: 1.5, display: 'flex', position: "fixed", top: 10, right: 10 }}>
                    <Tooltip title="View Attachments">
                        <IconButton
                            color="primary"
                            onClick={() => setOpen(true)}
                            sx={{
                                bgcolor: 'primary.main',
                                color: 'white',
                                '&:hover': { bgcolor: 'primary.dark' },
                                boxShadow: 2,
                            }}
                        >
                            <InsertDriveFileIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}

            {/* Right-side Drawer */}
            <Drawer
                anchor="right"
                open={open}
                onClose={() => setOpen(false)}
                PaperProps={{
                    sx: {
                        width: { xs: '100%', sm: 440 },
                        maxWidth: '100%'
                    },
                }}
            >
                {/* Header */}
                <Box sx={{
                    p: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    <Typography variant="h6" fontWeight={600}>
                        Attachments ({files.size})
                    </Typography>
                    <IconButton onClick={() => setOpen(false)} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>

                <List sx={{ p: 2, pt: 1, }}>
                    {files.size === 0 ? (
                        <ListItem>
                            <ListItemText primary="No files available" />
                        </ListItem>
                    ) : (
                        [...files].map((file, index) => (
                            <React.Fragment key={index}>
                                <ListItem
                                    alignItems="flex-start"
                                    sx={{
                                        px: 2,
                                        py: 2.5,
                                        borderRadius: 2,
                                        mb: 1,
                                        '&:hover': { bgcolor: 'primary.main' }
                                    }}
                                >
                                    {/* Avatar / Preview */}
                                    <ListItemAvatar>
                                        {isImage(file.type) ? (
                                            <Avatar
                                                variant="rounded"
                                                src={file.path}
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    borderRadius: 2,
                                                    border: '1px solid #eee'
                                                }}
                                            />
                                        ) : (
                                            <Avatar
                                                variant="rounded"
                                                sx={{ width: 64, height: 64, bgcolor: '#f0f0f0' }}
                                            >
                                                {getFileIcon(file)}
                                            </Avatar>
                                        )}
                                    </ListItemAvatar>

                                    {/* File Info with Truncated Name */}
                                    <ListItemText
                                        sx={{ ml: 2, mr: 1 }}
                                        primary={
                                            <Typography
                                                variant="body1"
                                                fontWeight={500}
                                                sx={{
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    display: 'block',
                                                    maxWidth: '240px'
                                                }}
                                            >
                                                {file.originalname}
                                            </Typography>
                                        }
                                        secondary={
                                            <Box sx={{ mt: 0.5 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {file.type}
                                                </Typography>
                                                {file.isFailed && (
                                                    <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                                        Upload Failed
                                                    </Typography>
                                                )}
                                            </Box>
                                        }
                                    />

                                    {/* Download Button */}
                                    <ListItemSecondaryAction>
                                        <Tooltip title="Download file">
                                            <IconButton
                                                edge="end"
                                                color="primary"
                                                onClick={() => handleDownload(file)}
                                                sx={{
                                                    bgcolor: 'primary.light',
                                                    color: 'white',
                                                    '&:hover': { bgcolor: 'primary.main' }
                                                }}
                                            >
                                                <DownloadIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </ListItemSecondaryAction>
                                </ListItem>

                                {index < files.length - 1 && <Divider sx={{ my: 1 }} />}
                            </React.Fragment>
                        ))
                    )}
                </List>
            </Drawer>
        </>
    );
};

export default FileDrawer;