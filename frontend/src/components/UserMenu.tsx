import { useUser } from "../setup/app-context-manager/UserContext";
import { IconButton, Avatar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import ReusableMenu from "./ReusableMenu";
import { useMenu } from "../hooks/useMenu";

const UserMenu = () => {
  const { session, handleLogin, handleLogout } = useUser();

  const navigate = useNavigate();

  const { anchorEl, open, handleOpen, handleClose } = useMenu();

  // Closes the profile menu and redirects the user to the home page
  const handleLogoutClick = async () => {
    await handleLogout();
    handleClose();
    navigate("/");
  };

  const menuItems = [
    {
      label: "Settings",
      onClick: () => {
        navigate("/settings");
        handleClose();
      },
    },
    {
      label: "Sign out",
      onClick: handleLogoutClick,
    },
  ];

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
