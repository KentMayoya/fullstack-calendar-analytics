import { useState } from "react";
import { IconButton } from "@mui/material";
import ReusableMenu from "./ReusableMenu";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const UserMenu = () => {
  // The HTML element the menu will anchor to (the calendar icon)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // If anchorEl is null, open is false, otherwise is true. When anchorEl's
  // state changes, this component re-renders, setting open to its updated value
  const open = Boolean(anchorEl);

  // Stores the HTMLElement into anchorEl
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Sets anchorEl to null, therefore closing the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    {
      label: "Display Settings",
      onClick: () => {
        console.log("display settings clicked");
      },
    },
    {
      label: "Sync Settings",
      onClick: () => {
        console.log("sync settings clicked");
      },
    },
  ];

  return (
    <>
      <IconButton
        onClick={handleOpen}
        color="inherit"
        sx={{ marginLeft: "auto" }}
      >
        <CalendarMonthIcon />
      </IconButton>
      <ReusableMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        menuItems={menuItems}
      />
    </>
  );
};

export default UserMenu;
