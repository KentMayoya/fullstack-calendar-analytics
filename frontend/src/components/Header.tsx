import { useState } from "react";
import { AppBar, Toolbar, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DrawerMenu from "./DrawerMenu";
import UserMenu from "./UserMenu";

const Header = () => {
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
          <UserMenu />
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
