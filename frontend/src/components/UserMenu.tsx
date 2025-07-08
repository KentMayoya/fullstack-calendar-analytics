import { useUser } from "../setup/app-context-manager/UserContext";
import { useState } from "react";
import { IconButton, Avatar, Typography, Menu, MenuItem } from "@mui/material";
import { NavLink } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";

const UserMenu = () => {
  const { session, handleLogin, handleLogout } = useUser();

  // The HTML element the menu will anchor to (the profile picture)
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

  if (!session) {
    // User is not authenticated. Provide the user with the option to log in.
    return (
      <IconButton
        color="inherit"
        onClick={handleLogin}
        sx={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography>Sign in</Typography>
        <LoginIcon />
      </IconButton>
    );
  }

  return (
    // User is authenticated. Provide the user with the option to navigate to
    // settings or to sign out. Clicking on the profile picture causes anchorEl
    // to be set with a value, thereby setting open to true, and then renders
    // the Menu.
    <>
      <IconButton
        onClick={handleOpen}
        color="inherit"
        sx={{ marginLeft: "auto" }}
      >
        <Avatar src={session.auth.user_metadata.avatar_url} alt="User avatar" />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          component={NavLink}
          to="/settings"
          onClick={() => {
            handleClose();
          }}
        >
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleLogout();
            handleClose();
          }}
        >
          Sign out
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
