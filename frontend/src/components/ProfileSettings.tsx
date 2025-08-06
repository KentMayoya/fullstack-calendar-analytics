import { Typography, TextField, Box, Switch, Button } from "@mui/material";
import { useUser } from "../setup/app-context-manager/UserContext";

const ProfileSettings = () => {
  const { session } = useUser();

  return (
    <>
      <Typography
        component="h2"
        variant="h6"
        sx={{
          fontWeight: "bold",
        }}
      >
        Profile and Preferences
      </Typography>
      <Typography sx={{ my: 2 }}>Email: {session?.profile?.email}</Typography>
      <TextField
        label="Display Name"
        variant="outlined"
        defaultValue={session?.profile?.fullName}
        fullWidth
        sx={{
          maxWidth: { xs: "95%", lg: "20%" },
        }}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          my: 2,
        }}
      >
        <Typography>Dark Mode</Typography>
        <Switch />
      </Box>
      <Button variant="contained" color="primary">
        Save
      </Button>
    </>
  );
};

export default ProfileSettings;
