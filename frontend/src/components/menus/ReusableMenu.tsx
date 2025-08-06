import { Menu, MenuItem } from "@mui/material";

interface MenuItemData {
  label: string;
  onClick: () => void;
}

interface ReusableMenuProps {
  anchorEl: null | HTMLElement;
  open: boolean;
  onClose: () => void;
  menuItems: MenuItemData[];
}

const ReusableMenu = ({
  anchorEl,
  open,
  onClose,
  menuItems,
}: ReusableMenuProps) => {
  return (
    <Menu anchorEl={anchorEl} open={open} onClose={onClose}>
      {menuItems.map((item) => (
        <MenuItem key={item.label} onClick={item.onClick}>
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default ReusableMenu;
