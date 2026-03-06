import { useRef, useState } from "react";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { buildSelectedFile } from "../../../utils/buildSelectedFile";
import { addFileToSelection } from "../../../utils/addFileToSelection";


export default function ActionMenu({ setSelectedFiles }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const fileInputRef = useRef(null);

  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);

  const openFilePicker = () => {
    handleCloseMenu();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const enrichedFile = await buildSelectedFile(file, {
      viewOnce: false, // optional now
    });

    addFileToSelection(enrichedFile, setSelectedFiles);

    e.target.value = null;
  };

  return (
    <>
      <IconButton sx={{ border: "1px solid divider" }} onClick={handleClick}>
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
    </>
  );
}