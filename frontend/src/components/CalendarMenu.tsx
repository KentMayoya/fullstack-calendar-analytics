import { IconButton } from "@mui/material";
import ReusableMenu from "./ReusableMenu";
import { useMenu } from "../hooks/useMenu";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const UserMenu = () => {
  const { anchorEl, open, handleOpen, handleClose } = useMenu();

  const menuItems = [
    {
      label: "Display Settings",
      onClick: () => {
        console.log("display settings clicked");
        handleClose();
      },
    },
    {
      label: "Sync Settings",
      onClick: () => {
        console.log("sync settings clicked");
        handleClose();
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
