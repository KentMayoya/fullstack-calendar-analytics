import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Box,
} from "@mui/material";
import { useState } from "react";
import { useUser } from "../../setup/app-context-manager/UserContext";

const AccountManagementSettings = () => {
  const { session, supabase } = useUser();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Controls the visibility of the DeleteAccountDialog Dialog
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] =
    useState<boolean>(false);

  // The value the user types into the TextField
  const [confirmInput, setConfirmInput] = useState<string>("");

  // Deletes the user account, including all related calendars, events, and
  // tags and ends the user's session.
  const handleDeleteAccount = async () => {
    if (confirmInput.toLowerCase() !== "confirm") {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error deleting user account");
      }
      // This produces an error because the user was deleted. However, this
      // clears session data from the user's local device
      await supabase.auth.signOut();
      // Closing the modal and clearing the useState is handled by the log out
      // redirect
    } catch (error: any) {
      console.error(error);
    }
  };

  return (
    <>
      <Typography
        component="h2"
        variant="h6"
        sx={{
          fontWeight: "bold",
        }}
        gutterBottom
      >
        Account Management
      </Typography>
      <Button
        variant="contained"
        color="error"
        onClick={() => setIsDeleteAccountDialogOpen(true)}
      >
        Delete Account
      </Button>
      <Dialog
        open={isDeleteAccountDialogOpen}
        onClose={() => {
          setIsDeleteAccountDialogOpen(false);
          setConfirmInput("");
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            color: "error.main",
          }}
        >
          Are you Sure?
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Deleting your account will delete all your calendars, events, tags,
            and all analytics. This action cannot be reversed. Type confirm
            below to delete your account.
          </Typography>
          <TextField
            onChange={(e) => {
              setConfirmInput(e.target.value);
            }}
            label="Type Confirm"
            variant="standard"
            size="small"
            autoFocus
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: "flex", justifyContent: "space-between", p: 1 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsDeleteAccountDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAccount}
            >
              Delete
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AccountManagementSettings;
