import {
  Typography,
  Divider,
  TextField,
  Box,
  Switch,
  Button,
} from "@mui/material";
import { useUser } from "../setup/app-context-manager/UserContext";

const SettingsPage = () => {
  const context = useUser();
  const { session } = context;

  return (
    <Box sx={{ p: { xs: 1, lg: 3 } }}>
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
      <Divider sx={{ my: 2 }} />
      <Typography
        component="h2"
        variant="h6"
        sx={{
          fontWeight: "bold",
        }}
      >
        Calendar Sync Settings
      </Typography>
      <Button variant="contained" color="primary">
        Load Calendars
      </Button>
      <Divider sx={{ my: 2 }} />
      <Typography
        component="h2"
        variant="h6"
        sx={{
          fontWeight: "bold",
        }}
      >
        Tag Management
      </Typography>
      <Divider sx={{ my: 2 }} />
      <Typography
        component="h2"
        variant="h6"
        sx={{
          fontWeight: "bold",
        }}
      >
        Account Management
      </Typography>
    </Box>
  );
};

export default SettingsPage;
