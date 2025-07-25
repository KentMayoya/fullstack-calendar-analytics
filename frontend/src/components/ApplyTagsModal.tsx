import { Box, Typography, Button } from "@mui/material";
import ReusableModal from "./ReusableModal";

type ApplyTagsModalProps = {
  handleClose: () => void;
};

const ApplyTagsModal = ({ handleClose }: ApplyTagsModalProps) => {
  return (
    <ReusableModal isOpen={true} handleClose={handleClose}>
      <Typography
        component="h2"
        variant="h6"
        sx={{
          fontWeight: "bold",
        }}
      >
        Modify Tags
      </Typography>{" "}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
        }}
      >
        <Button variant="contained" color="primary" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log("Save was clicked!")}
        >
          Save
        </Button>
      </Box>
    </ReusableModal>
  );
};

export default ApplyTagsModal;
