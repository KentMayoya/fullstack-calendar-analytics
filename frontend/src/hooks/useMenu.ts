import { useState } from "react";

export const useMenu = () => {
  // The HTML element the menu will anchor to
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // If anchorEl is null, open is false, otherwise is true
  const open = Boolean(anchorEl);

  // Stores the HTMLElement into anchorEl
  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  // Sets anchorEl to null, closing the menu
  const handleClose = () => {
    setAnchorEl(null);
  };

  return { anchorEl, open, handleOpen, handleClose };
};