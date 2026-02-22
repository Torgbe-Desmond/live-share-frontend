import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CloseIcon from "@mui/icons-material/Close";

const soundOptions = [
  { name: "Beep", url: "/sounds/beep.mp3" },
  { name: "Ding", url: "/sounds/ding.mp3" },
  // add more as needed
];

export default function SoundDrawer({ open, setOpen }) {
  const handleClose = () => setOpen(false);

  const playSound = (url) => {
    if (!url) return;
    const audio = new Audio(url);
    audio.play().catch((err) => console.warn("Audio play failed:", err));
  };

  return (
    <Drawer anchor="right" open={open} onClose={handleClose}>
      <div style={{ width: 320, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0 }}>Sound Effects</h3>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {soundOptions.map((sound, index) => (
            <ListItem key={index} disablePadding>
              <ListItemButton onClick={() => playSound(sound.url)}>
                <ListItemIcon>
                  <VolumeUpIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={sound.name} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </div>
    </Drawer>
  );
}