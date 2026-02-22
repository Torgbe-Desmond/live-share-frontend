import { useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";


export default function ActionMenu({ setSelectedFiles }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const fileInputRef = useRef(null);
  const open = Boolean(anchorEl);

  const openFilePicker = () => {
    handleCloseMenu();
    fileInputRef.current?.click();
  };

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

 
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const roomName = localStorage.getItem("roomName");

    // 1️⃣ Get file buffer
    const arrayBuffer = await file.arrayBuffer();

    // 2️⃣ Hash it (SHA-256)
    const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const publicId = `${roomName}/${hashHex}`;

    // 3️⃣ Create enriched file object
    const enrichedFile = {
      file,
      type: file.type,
      originalname: file.name,
      name: file.name,
      size: file.size,
      local: true,
      isSuccess: false,
      isFailed: false,
      publicId,
      viewOnce:false,
      buffer: arrayBuffer, 
    };

    // 4️⃣ Add to Set (avoid duplicates)
    setSelectedFiles((prev) => {
      const newSet = new Set(prev);
      const exists = [...newSet].some((f) => f.publicId === publicId);
      if (!exists) newSet.add(enrichedFile);
      return newSet;
    });

    // reset input
    e.target.value = null;
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        elevation={0}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {/* <MenuItem onClick={handleOpenDrawer} disableRipple>
          <VolumeUpIcon />
          Sound Effects...
        </MenuItem> */}
        <MenuItem onClick={openFilePicker} disableRipple>
          <AttachFileIcon />
          Add File
        </MenuItem>
      </Menu>

      <input
        type="file"
        ref={fileInputRef}
        hidden
        onChange={handleFileChange}
      />

      {/* <SoundDrawer open={drawerOpen} setOpen={setDrawerOpen} /> */}
   
    </>
  );
}
