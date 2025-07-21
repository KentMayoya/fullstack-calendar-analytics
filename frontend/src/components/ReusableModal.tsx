import { Modal, Box } from "@mui/material";
import type { ReactNode } from "react";

type ReusableModalProps = {
  isOpen: boolean;
  handleClose: () => void;
  children: ReactNode;
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: {
    xs: "60%",
    lg: "30%",
  },
  minHeight: 100,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ReusableModal = ({
  isOpen,
  handleClose,
  children,
}: ReusableModalProps) => {
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box sx={style}>{children}</Box>
    </Modal>
  );
};

export default ReusableModal;
