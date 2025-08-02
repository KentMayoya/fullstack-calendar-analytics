import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const PrivacyPolicyPage = () => {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1">
        Privacy Policy
      </Typography>
      <Box sx={{ my: 2 }}>
        <Typography>
          This Privacy Policy describes how Calendar Analytics ("we," "us," or
          "our") collects, uses, and protects your information when you use our
          web application.
        </Typography>
      </Box>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        1. Information We Collect
      </Typography>
      <Typography>
        To provide our service, we securely access information from your Google
        Account with your explicit consent. We collect two types of information:
      </Typography>
      <List>
        <ListItem>
          <ListItemText
            primary="User Account Information"
            secondary="When you sign up using your Google Account, we collect
            your basic profile information, including your full name and email
            address."
          />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText
            primary="Google Calendar Data"
            secondary="To provide analytics, we access and store information from
            your Google Calendars, including calendar and event details.
            We only access events from the calendar you explicitly choose to sync."
          />
        </ListItem>
      </List>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        2. How We Use Your Information
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText
            primary="To Provide the Service: To display your 
          calendar events and generate analytics about them."
          />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText
            primary="To Authenticate You: To securely log you into
          our application and verify your identity."
          />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText
            primary="To Maintain a Connection to Google: We store a
          Google OAuth Refresh Token to securely perform periodic background
          syncs on your behalf."
          />
        </ListItem>
      </List>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        3. How We Store and Secure Your Information
      </Typography>
      <Typography>
        Data security is a top priority. Your information is stored and secured
        as follows:
      </Typography>
      <List sx={{ listStyleType: "disc", pl: 4 }}>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText
            primary="Database: All your data is stored in a secure
          PostgreSQL database, hosted by Supabase."
          />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText
            primary="Encryption of Sensitive Tokens: Your Google OAuth Refresh
            Token is always encrypted using a strong AES-256 standard before it
            is stored in our database. The secret encryption key is stored
            securely on our hosting platform and is never saved in our main
            database. It is used at runtime to encrypt and decrypt your token
            used to access the Google Calendar API."
          />
        </ListItem>
        <ListItem sx={{ display: "list-item" }}>
          <ListItemText
            primary="Row Level Security (RLS): We have enabled RLS on our
            database to ensure that you are the only person who can access
            your own data through the API."
          />
        </ListItem>
      </List>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        4. Data Sharing
      </Typography>
      <Typography>
        We do not sell, trade, or share your personal information or calendar
        data with any third parties.
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        5. Your Rights and Data Deletion
      </Typography>
      <Typography>
        You can revoke our access to your Google Account at any time from your
        Google Account security settings page. You can delete your account and
        all associated data by contacting us at kentmay@uw.edu.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        6. Changes to This Privacy Policy
      </Typography>
      <Typography>
        We may update this Privacy Policy from time to time. We will notify you
        of any changes by posting the new policy on this page.
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        7. Contact Us
      </Typography>
      <Typography>
        If you have any questions about this Privacy Policy, please contact us
        at: kentmay@uw.edu.
      </Typography>
    </Container>
  );
};

export default PrivacyPolicyPage;
