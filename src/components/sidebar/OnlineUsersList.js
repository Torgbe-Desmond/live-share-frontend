import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Avatar,
  alpha,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";

export default function OnlineUsersList({ users, currentUsername, setOpen }) {
  return (
    <Box sx={{ flex: 1, overflowY: "auto", p: 2 }}>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{
          mb: 1.5,
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <PeopleIcon fontSize="small" /> Online ({users.size})
      </Typography>

      <List disablePadding>
        {currentUsername && (
          <ListItem
            sx={{ borderRadius: 1, bgcolor: alpha("#1976d2", 0.08), mb: 0.5 }}
          >
            <ListItemAvatar>
              <Avatar
                src={`https://robohash.org/${currentUsername}?set=set4`}
                sx={{ bgcolor: "primary.dark" }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={currentUsername}
              primaryTypographyProps={{ fontWeight: 600 }}
              secondary="You"
            />
          </ListItem>
        )}

        {[...users]
          .filter((user) => user !== currentUsername)
          .map((user) => (
            <ListItem key={user} sx={{ borderRadius: 1 }}>
              <ListItemAvatar>
                <Avatar src={`https://robohash.org/${user}?set=set4`} />
              </ListItemAvatar>
              <ListItemText primary={user} />
            </ListItem>
          ))}
      </List>
    </Box>
  );
}