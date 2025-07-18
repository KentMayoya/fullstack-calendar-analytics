import { useState } from "react";
import { IconButton } from "@mui/material";
import ReusableMenu from "./ReusableMenu";
import { useMenu } from "../hooks/useMenu";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SyncSettingsModal from "./SyncSettingsModal";

const UserMenu = () => {
  const { anchorEl, open, handleOpen, handleClose } = useMenu();

  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);

  const openSyncModal = () => {
    setIsSyncModalOpen(true);
  };

  const closeSyncModal = () => {
    setIsSyncModalOpen(false);
  };

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
        openSyncModal();
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
      {isSyncModalOpen && (
        <SyncSettingsModal
          isOpen={isSyncModalOpen}
          handleClose={closeSyncModal}
        />
      )}
    </>
  );
};

export default UserMenu;
