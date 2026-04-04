import { useRef, useState } from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import CloseIcon from "@mui/icons-material/Close";
import MusicNoteIcon from "@mui/icons-material/MusicNote";

const SOUND_OPTIONS = [
  { name: "FAHHHHHHHHHHHHHH", url: "https://www.myinstants.com/media/sounds/fahhhhhhhhhhhhhh.mp3" },
  { name: "VINE BOOM SOUND", url: "https://www.myinstants.com/media/sounds/vine-boom-sound.mp3" },
  { name: "A Few Moments Later", url: "https://www.myinstants.com/media/sounds/a-few-moments-later-sponge-bob-sfx-fun.mp3" },
  { name: "Laughing Dog Meme", url: "https://www.myinstants.com/media/sounds/laughing-dog-meme.mp3" },
  { name: "Akrobeto", url: "https://www.myinstants.com/media/sounds/akrobeto.mp3" },
  { name: "Rizz Sound Effect", url: "https://www.myinstants.com/media/sounds/rizz-sound-effect.mp3" },
  { name: "Indian Song", url: "https://www.myinstants.com/media/sounds/indian-song.mp3" },
  { name: "Baby Laughing Meme", url: "https://www.myinstants.com/media/sounds/baby-laughing-meme.mp3" },
  { name: "Among Us Role Reveal", url: "https://www.myinstants.com/media/sounds/among-us-role-reveal-sound.mp3" },
  { name: "YOU'RE PHONE IS RINGING", url: "https://www.myinstants.com/media/sounds/youre-phone-is-ringing.mp3" },
  { name: "Chicken Screaming", url: "https://www.myinstants.com/media/sounds/chicken-on-tree-screaming.mp3" },
  { name: "Wetin Be This", url: "https://www.myinstants.com/media/sounds/wetin-be-this-sound-comedy-by-kenny.mp3" },
  { name: "Romanceeeeee", url: "https://www.myinstants.com/media/sounds/romanceeeeeeeeeeeeee.mp3" },
  { name: "Oh My God Bro", url: "https://www.myinstants.com/media/sounds/oh-my-god-bro-oh-hell-nah-man.mp3" },
  { name: "Let's Have It", url: "https://www.myinstants.com/media/sounds/lets-have-it-lets-have-it.mp3" },
  { name: "Aww", url: "https://www.myinstants.com/media/sounds/aww.mp3" },
  { name: "Anime Wow", url: "https://www.myinstants.com/media/sounds/anime-wow.mp3" },
  { name: "Spiderman Meme Song", url: "https://www.myinstants.com/media/sounds/spiderman-meme-song.mp3" },
  { name: "Emotional Damage", url: "https://www.myinstants.com/media/sounds/emotional-damage-meme.mp3" },
  { name: "Dun Dun Dunnnnn", url: "https://www.myinstants.com/media/sounds/dun-dun-dunnnnnnnn.mp3" },
  { name: "I Want Problems Always", url: "https://www.myinstants.com/media/sounds/i-dont-want-peace-i-want-problems-always.mp3" },
  { name: "Yep That's Me", url: "https://www.myinstants.com/media/sounds/yep-thats-me-youre-probably-wondering.mp3" },
  { name: "Shocked Sound", url: "https://www.myinstants.com/media/sounds/shocked-sound.mp3" },
  { name: "Oh No No No", url: "https://www.myinstants.com/media/sounds/oh-no-no-no-laugh.mp3" },
  { name: "Apple Pay", url: "https://www.myinstants.com/media/sounds/apple-pay.mp3" },
  { name: "Fahhh", url: "https://www.myinstants.com/media/sounds/fahhh.mp3" },
  { name: "Sad Meow Song", url: "https://www.myinstants.com/media/sounds/sad-meow-song.mp3" },
  { name: "Undertaker Bell", url: "https://www.myinstants.com/media/sounds/the-undertaker-bell.mp3" },
  { name: "Go Ask Your Grandfather", url: "https://www.myinstants.com/media/sounds/go-and-ask-your-grandfather.mp3" },
  { name: "You Are A Mumu Man", url: "https://www.myinstants.com/media/sounds/you-are-a-mumu-man.mp3" },
  { name: "Sad Violin", url: "https://www.myinstants.com/media/sounds/sad-violin-the-meme-one.mp3" },
  { name: "BRUH", url: "https://www.myinstants.com/media/sounds/bruh.mp3" },
  { name: "Awkward Cricket", url: "https://www.myinstants.com/media/sounds/awkward-cricket.mp3" },
  { name: "Buzzer", url: "https://www.myinstants.com/media/sounds/buzzer.mp3" },
  { name: "Hub Intro Sound", url: "https://www.myinstants.com/media/sounds/hub-intro-sound.mp3" },
];

export default function SoundMenu() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const audioRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [playing, setPlaying] = useState(null);

  const menuOpen = Boolean(anchorEl);

  const playSound = (url, name) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlaying(name);
    audio.play().catch((e) => console.warn("Audio failed:", e));
    audio.onended = () => setPlaying(null);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          color: "text.secondary",
          borderRadius: "8px",
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          p: 0.6,
          "&:hover": {
            color: "primary.main",
            bgcolor: alpha(theme.palette.primary.main, 0.07),
            borderColor: alpha(theme.palette.primary.main, 0.3),
          },
        }}
      >
        <MoreVertIcon sx={{ fontSize: 18 }} />
      </IconButton>

      {/* Dropdown menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={() => setAnchorEl(null)}
        elevation={0}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        transformOrigin={{ vertical: "bottom", horizontal: "right" }}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
            boxShadow: `0 8px 24px ${alpha("#000", isDark ? 0.5 : 0.12)}`,
            bgcolor: isDark ? alpha(theme.palette.background.paper, 0.97) : "#fff",
            minWidth: 180,
            "& .MuiMenuItem-root": {
              fontSize: "0.85rem",
              borderRadius: "8px",
              mx: 0.5,
              gap: 1,
            },
          },
        }}
      >
        <MenuItem
          onClick={() => { setAnchorEl(null); setDrawerOpen(true); }}
        >
          <VolumeUpIcon sx={{ fontSize: 17, color: "primary.main" }} />
          Sound Effects
        </MenuItem>
      </Menu>

      {/* Sound drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            bgcolor: "background.paper",
            borderLeft: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          },
        }}
      >
        {/* Drawer header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2.5,
            py: 2,
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MusicNoteIcon sx={{ fontSize: 18, color: "primary.main" }} />
            <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>
              Sound Effects
            </Typography>
          </Box>
          <IconButton
            size="small"
            onClick={() => setDrawerOpen(false)}
            sx={{ color: "text.secondary", borderRadius: "8px" }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Sound list */}
        <List sx={{ px: 1, py: 1, overflowY: "auto" }}>
          {SOUND_OPTIONS.map((sound) => {
            const isPlaying = playing === sound.name;
            return (
              <ListItem key={sound.name} disablePadding sx={{ mb: 0.25 }}>
                <ListItemButton
                  onClick={() => playSound(sound.url, sound.name)}
                  sx={{
                    borderRadius: "10px",
                    py: 0.75,
                    bgcolor: isPlaying
                      ? alpha(theme.palette.primary.main, 0.08)
                      : "transparent",
                    "&:hover": {
                      bgcolor: isPlaying
                        ? alpha(theme.palette.primary.main, 0.12)
                        : alpha(theme.palette.action.hover, 0.5),
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 34 }}>
                    <VolumeUpIcon
                      sx={{
                        fontSize: 16,
                        color: isPlaying ? "primary.main" : "text.disabled",
                        transition: "color 0.2s",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={sound.name}
                    primaryTypographyProps={{
                      fontSize: "0.82rem",
                      fontWeight: isPlaying ? 600 : 400,
                      color: isPlaying ? "primary.main" : "text.primary",
                      noWrap: true,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </>
  );
}
