import {
  Avatar,
  Box,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tooltip,
  useTheme,
  IconButton
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LeaveRoomButton from "./LeaveRoomButton";

export default function SidebarContent({
  open,
  users = [],
  username,
  roomName,
  onLeave,
}) {
  const theme = useTheme();
  const userList = Array.isArray(users) ? users : Array.from(users);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      {/* --- TOP SECTION: ONLINE USERS --- */}
      <Box sx={{ flex: 1, overflowY: "auto", overflowX: "hidden" }}>
        <List sx={{ pt: 1 }}>
          {userList
            .filter((user) => user !== username)
            .map((user) => (
              <ListItem key={user} disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                    // Subtle Twitter-style hover
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 0.03)" }, 
                  }}
                >
                  <ListItemAvatar
                    sx={{
                      minWidth: 0,
                      mr: open ? 2 : "auto",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Avatar
                      src={`https://robohash.org/${user}?set=set4`}
                      sx={{ 
                        width: 34, 
                        height: 34,
                        border: `1px solid ${theme.palette.divider}` 
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user}
                    sx={{
                      opacity: open ? 1 : 0,
                      display: open ? "block" : "none",
                    }}
                    primaryTypographyProps={{
                      noWrap: true,
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "text.primary"
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Box>

      {/* --- BOTTOM SECTION: ACTIONS & PROFILE --- */}
      <Box sx={{ pb: 2, mt: "auto" }}>
        <Divider sx={{ mb: 2, borderColor: "divider" }} />

        {/* Current User Profile */}
        {username && (
          <ListItem disablePadding sx={{ display: "block", mb: 1 }}>
            <ListItemButton
              disabled
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                "&.Mui-disabled": { opacity: 1 },
              }}
            >
              <ListItemAvatar
                sx={{
                  minWidth: 0,
                  mr: open ? 2 : "auto",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Avatar
                  src={`https://robohash.org/${username}?set=set4`}
                  sx={{
                    width: 38,
                    height: 38,
                    bgcolor: "primary.main",
                    border: `2px solid ${theme.palette.primary.main}`,
                  }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={username}
                secondary={open ? "@you" : null}
                sx={{
                  opacity: open ? 1 : 0,
                  display: open ? "block" : "none",
                }}
                primaryTypographyProps={{
                  fontWeight: 700,
                  noWrap: true,
                  fontSize: "15px",
                  color: "text.primary"
                }}
                secondaryTypographyProps={{ 
                  fontSize: "13px",
                  color: "text.secondary" // Twitter Muted Gray
                }}
              />
            </ListItemButton>
          </ListItem>
        )}

        {/* Leave Button */}
        <Box sx={{ display: "flex", justifyContent: "center", px: open ? 2 : 0 }}>
          {open ? (
            <Box sx={{ width: "100%" }}>
              <LeaveRoomButton onLeave={onLeave} />
            </Box>
          ) : (
            <Tooltip title="Leave Room" placement="right" arrow>
              <IconButton
                onClick={onLeave}
                sx={{
                  width: 45,
                  height: 45,
                  color: "error.main",
                  "&:hover": { bgcolor: "rgba(244, 33, 46, 0.1)" },
                }}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
    </Box>
  );
}