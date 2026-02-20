import {
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function ChatHeader({
  roomName,
  usersCount,
  isMobile,
  onMenuClick,
}) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Toolbar
        variant="dense"
        sx={{ minHeight: 56, px: { xs: 2, sm: 3 }, gap: 2 }}
      >
        {isMobile && (
          <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 1 }}>
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          color="text.secondary"
          fontWeight={700}
          noWrap
          sx={{ letterSpacing: "-0.02em" }}
        >
          Playground
        </Typography>

        {roomName && (
          <Box
            component="span"
            sx={{
              px: 1.5,
              py: 0.4,
              borderRadius: 10,
              bgcolor: "action.hover",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "text.secondary",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            @{roomName}
          </Box>
        )}

        <Box sx={{ flex: 1 }} />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: "text.secondary",
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: "success.main",
              boxShadow: "0 0 0 3px rgba(76,175,80,0.2)",
            }}
          />
          <Typography variant="body2" fontWeight={500}>
            {usersCount} active
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
