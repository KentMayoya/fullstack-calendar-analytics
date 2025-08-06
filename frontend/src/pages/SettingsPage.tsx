import { Divider, Box } from "@mui/material";
import { useUser } from "../setup/app-context-manager/UserContext";
import { Navigate } from "react-router-dom";
import ProfileSettings from "../components/ProfileSettings";
import CalendarSyncSettings from "../components/CalendarSyncSettings";
import TagManagementSettings from "../components/TagManagementSettings";
import AccountManagementSettings from "../components/AccountManagementSettings";

const SettingsPage = () => {
  const { session } = useUser();

  // If the user does not have a valid session, redirect to the home page
  if (!session?.auth) {
    return <Navigate to="/" replace />;
  }

  return (
    <Box sx={{ p: { xs: 1, lg: 3 } }}>
      <ProfileSettings />
      <Divider sx={{ my: 2 }} />
      <CalendarSyncSettings />
      <Divider sx={{ my: 2 }} />
      <TagManagementSettings />
      <Divider sx={{ my: 2 }} />
      <AccountManagementSettings />
    </Box>
  );
};

export default SettingsPage;
