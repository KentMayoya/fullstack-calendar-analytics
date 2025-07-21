import ReusableModal from "./ReusableModal";

type DisplaySettingsModalProps = {
  handleClose: () => void;
};

const DisplaySettingsModal = ({ handleClose }: DisplaySettingsModalProps) => {
  return (
    <ReusableModal isOpen={true} handleClose={handleClose}>
      <h1>test</h1>
    </ReusableModal>
  );
};

export default DisplaySettingsModal;
