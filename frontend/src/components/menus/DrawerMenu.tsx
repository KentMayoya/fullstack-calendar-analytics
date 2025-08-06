import { NavLink, useLocation } from "react-router-dom";
import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { useUser } from "../../setup/app-context-manager/UserContext";

type DrawerMenuProps = {
  open: boolean;
  onClose: () => void;
};

const menuItems = [
  { text: "Home", path: "/" },
  { text: "About", path: "/about" },
  { text: "Privacy Policy", path: "/privacy" },
];

const authMenuItems = [
  { text: "Calendar", path: "/calendar" },
  { text: "Dashboard", path: "/dashboard" },
  { text: "Settings", path: "/settings" },
];

const DrawerMenu = ({ open, onClose }: DrawerMenuProps) => {
  const { session } = useUser();
  const location = useLocation();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 240,
        },
      }}
    >
      <List>
        {menuItems.map(({ text, path }) => (
          <ListItemButton
            key={path}
            component={NavLink}
            to={path}
            onClick={onClose}
            selected={location.pathname === path}
          >
            <ListItemText primary={text}></ListItemText>
          </ListItemButton>
        ))}
        {session &&
          authMenuItems.map(({ text, path }) => (
            <ListItemButton
              key={path}
              component={NavLink}
              to={path}
              onClick={onClose}
              selected={location.pathname === path}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          ))}
      </List>
    </Drawer>
  );
};

export default DrawerMenu;
