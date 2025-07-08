import { useState } from "react";
import { AppBar, Toolbar, IconButton, Avatar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import DrawerMenu from "./DrawerMenu";
import { useUser } from "../setup/app-context-manager/UserContext";

const Header = () => {
  const { session } = useUser();

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={() => setIsDrawerOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            color="inherit"
            sx={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {session && (
              <Avatar src={session?.auth?.user_metadata?.avatar_url}> </Avatar>
            )}
            {!session && (
              <>
                <Typography>Sign in</Typography>
                <LoginIcon />
              </>
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
      <DrawerMenu
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      ></DrawerMenu>
    </>
  );
};

export default Header;
