import { Box, IconButton, AppBar, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function ChatHeader({
  roomName,
  usersCount,
  isMobile,
  onMenuClick,
  isActive,
}) {
  return (
    <AppBar
      position="static"
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

        {/* <Typography
          variant="h6"
          color="text.secondary"
          fontWeight={700}
          noWrap
          sx={{ letterSpacing: "-0.02em" }}
        >
          Playground
        </Typography> */}

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
              width: 12,
              height: 12,
              borderRadius: "50%",
              bgcolor: isActive ? "success.main" : "error.light",
              boxShadow: isActive
                ? "0 0 0 4px alpha('success.main', 0.24)"
                : "0 0 0 4px alpha('error.main', 0.16)",
            }}
          />
          <Typography variant="body2" fontWeight={500}>
            {isActive ? "online" : "offline"}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
