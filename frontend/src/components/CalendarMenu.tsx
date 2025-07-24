import { useState } from "react";
import { IconButton } from "@mui/material";
import ReusableMenu from "./ReusableMenu";
import { useMenu } from "../hooks/useMenu";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SyncSettingsModal from "./SyncSettingsModal";
import DisplaySettingsModal from "./DisplaySettingsModal";

const UserMenu = () => {
  const { anchorEl, open, handleOpen, handleClose } = useMenu();

  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const [isDisplayModalOpen, setIsDisplayModalOpen] = useState<boolean>(false);

  const openSyncModal = () => {
    setIsSyncModalOpen(true);
  };

  const closeSyncModal = () => {
    setIsSyncModalOpen(false);
  };

  const openDisplayModal = () => {
    setIsDisplayModalOpen(true);
  };

  const closeDisplayModal = () => {
    setIsDisplayModalOpen(false);
  };

  const menuItems = [
    {
      label: "Display Settings",
      onClick: () => {
        openDisplayModal();
        handleClose();
      },
    },
    {
      label: "Sync Settings",
      onClick: () => {
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
      {isSyncModalOpen && <SyncSettingsModal handleClose={closeSyncModal} />}
      {isDisplayModalOpen && (
        <DisplaySettingsModal handleClose={closeDisplayModal} />
      )}
    </>
  );
};

export default UserMenu;
