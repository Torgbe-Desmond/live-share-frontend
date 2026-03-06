import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import MoreVertIcon from '@mui/icons-material/MoreVert';


const soundOptions = [
  { name: "FAHHHHHHHHHHHHHH", url: "https://www.myinstants.com/media/sounds/fahhhhhhhhhhhhhh.mp3" },
  { name: "VINE BOOM SOUND", url: "https://www.myinstants.com/media/sounds/vine-boom-sound.mp3" },
  { name: "a few moments later sponge bob sfx fun", url: "https://www.myinstants.com/media/sounds/a-few-moments-later-sponge-bob-sfx-fun.mp3" },
  { name: "Laughing dog meme", url: "https://www.myinstants.com/media/sounds/laughing-dog-meme.mp3" },
  { name: "akrobeto", url: "https://www.myinstants.com/media/sounds/akrobeto.mp3" },
  { name: "rizz sound effect", url: "https://www.myinstants.com/media/sounds/rizz-sound-effect.mp3" },
  { name: "indian song", url: "https://www.myinstants.com/media/sounds/indian-song.mp3" },
  { name: "baby laughing meme", url: "https://www.myinstants.com/media/sounds/baby-laughing-meme.mp3" },
  { name: "Among Us role reveal sound", url: "https://www.myinstants.com/media/sounds/among-us-role-reveal-sound.mp3" },
  { name: "YOURE PHONE IS RINGING", url: "https://www.myinstants.com/media/sounds/youre-phone-is-ringing.mp3" },
  { name: "Chicken on tree screaming", url: "https://www.myinstants.com/media/sounds/chicken-on-tree-screaming.mp3" },
  { name: "Wetin be this sound comedy by kenny", url: "https://www.myinstants.com/media/sounds/wetin-be-this-sound-comedy-by-kenny.mp3" },
  { name: "romanceeeeeeeeeeeeee", url: "https://www.myinstants.com/media/sounds/romanceeeeeeeeeeeeee.mp3" },
  { name: "oh my god bro oh hell nah man", url: "https://www.myinstants.com/media/sounds/oh-my-god-bro-oh-hell-nah-man.mp3" },
  { name: "Let's have it let's have it", url: "https://www.myinstants.com/media/sounds/lets-have-it-lets-have-it.mp3" },
  { name: "Aww", url: "https://www.myinstants.com/media/sounds/aww.mp3" },
  { name: "Anime Wow", url: "https://www.myinstants.com/media/sounds/anime-wow.mp3" },
  { name: "spiderman meme song", url: "https://www.myinstants.com/media/sounds/spiderman-meme-song.mp3" },
  { name: "Emotional Damage Meme", url: "https://www.myinstants.com/media/sounds/emotional-damage-meme.mp3" },
  { name: "dun dun dunnnnnnnn", url: "https://www.myinstants.com/media/sounds/dun-dun-dunnnnnnnn.mp3" },
  { name: "I don't want peace. I want problems, always.", url: "https://www.myinstants.com/media/sounds/i-dont-want-peace-i-want-problems-always.mp3" },
  { name: "Yep That's me you...", url: "https://www.myinstants.com/media/sounds/yep-thats-me-youre-probably-wondering.mp3" },
  { name: "Shocked sound", url: "https://www.myinstants.com/media/sounds/shocked-sound.mp3" },
  { name: "oh no no no laugh", url: "https://www.myinstants.com/media/sounds/oh-no-no-no-laugh.mp3" },
  { name: "Apple Pay", url: "https://www.myinstants.com/media/sounds/apple-pay.mp3" },
  { name: "Fahhh", url: "https://www.myinstants.com/media/sounds/fahhh.mp3" },
  { name: "sad meow song", url: "https://www.myinstants.com/media/sounds/sad-meow-song.mp3" },
  { name: "The Undertaker Bell", url: "https://www.myinstants.com/media/sounds/the-undertaker-bell.mp3" },
  { name: "Go and ask your grandfather", url: "https://www.myinstants.com/media/sounds/go-and-ask-your-grandfather.mp3" },
  { name: "you are a mumu man", url: "https://www.myinstants.com/media/sounds/you-are-a-mumu-man.mp3" },
  { name: "Sad Violin (the meme one)", url: "https://www.myinstants.com/media/sounds/sad-violin-the-meme-one.mp3" },
  { name: "BRUH", url: "https://www.myinstants.com/media/sounds/bruh.mp3" },
  { name: "Awkward cricket", url: "https://www.myinstants.com/media/sounds/awkward-cricket.mp3" },
  { name: "Buzzer", url: "https://www.myinstants.com/media/sounds/buzzer.mp3" },
  { name: "Hub Intro Sound", url: "https://www.myinstants.com/media/sounds/hub-intro-sound.mp3" },
  { name: "Yep, That's Me You're Probably Wondering...", url: "https://www.myinstants.com/media/sounds/yep-thats-me-youre-probably-wondering.mp3" },
];




const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

export default function ActionMenuWithSoundDrawer() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenDrawer = () => {
    handleMenuClose();
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  // Audio playback (stops any previous sound)
  const audioRef = React.useRef(null);

  const playSound = (url) => {
    if (!url) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play().catch((err) => console.warn('Audio play failed:', err));
  };

  return (
    <>
      <IconButton
        id="action-menu-button"
        aria-controls={open ? 'action-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
      >
        <MoreVertIcon/>
      </IconButton>

      <StyledMenu
        id="action-menu"
        MenuListProps={{ 'aria-labelledby': 'action-menu-button' }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
      >
        {/* This is now a simple list — add more MenuItems here anytime */}
        <MenuItem onClick={handleOpenDrawer} disableRipple>
          <VolumeUpIcon />
          Sound Effects...
        </MenuItem>

        {/* Example: easy to add more actions later */}
        {/* 
        <MenuItem onClick={() => { handleMenuClose(); alert('Settings clicked'); }} disableRipple>
          <SettingsIcon />
          Settings
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleMenuClose(); alert('Delete clicked'); }} disableRipple>
          <DeleteIcon color="error" />
          Delete
        </MenuItem>
        */}
      </StyledMenu>

      {/* Drawer remains the same */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
      >
        <div style={{ width: 320, padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0 }}>Shocked / Surprise Sounds</h3>
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon />
            </IconButton>
          </div>

          <Divider />

          <List>
            {soundOptions.map((sound, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton
                  onClick={() => {
                    playSound(sound.url);
                    // Optional: close drawer after play, or add feedback
                    // handleDrawerClose();
                  }}
                >
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
    </>
  );
}