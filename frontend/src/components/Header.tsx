import { useState } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Button,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DrawerMenu from "./DrawerMenu";
import UserMenu from "./UserMenu";
import { Link } from "react-router-dom";

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
          <Box sx={{ flexGrow: 1 }}>
            <Button
              component={Link}
              to="/"
              sx={{
                color: "inherit",
                textTransform: "none",
                "&:focus, &:active, &:hover": {
                  color: "inherit",
                },
              }}
            >
              <Typography variant="h6">Calendar Analytics</Typography>
            </Button>
          </Box>
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
