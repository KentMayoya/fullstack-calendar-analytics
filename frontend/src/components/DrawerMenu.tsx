import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { useUser } from "../setup/app-context-manager/UserContext";

type DrawerMenuProps = {
  open: boolean;
  onClose: () => void;
};

const DrawerMenu = ({ open, onClose }: DrawerMenuProps) => {
  const context = useUser();
  const { session } = context;

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
        <ListItem>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem>
          <ListItemText primary="About" />
        </ListItem>
        {session && (
          <>
            <ListItem>
              <ListItemText primary="Calendar" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Settings" />
            </ListItem>
          </>
        )}
      </List>
    </Drawer>
  );
};

export default DrawerMenu;
