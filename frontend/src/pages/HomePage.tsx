import { Box, Divider, Typography } from "@mui/material";
import googleCalendarIcon from "../assets/google-calendar-icon.png";

const HomePage = () => {
  return (
    <>
      <Box
        sx={{
          p: 1,
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          align="center"
          sx={{
            fontWeight: "bold",
          }}
        >
          Analytics for Your Google Calendar
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          <Box
            component="img"
            src={googleCalendarIcon}
            alt="Google Calendar"
            sx={{ width: 32, height: 32, mr: 2 }}
          />
          <Typography>Built for Google Calendar™ only</Typography>
        </Box>
        <Typography gutterBottom>
          Securely connect your Google Calendar with a few clicks. Our
          application syncs your calendars and events, providing an analysis of
          how you spend your time. Your data is protected with secure
          authentication and encrypted storage.
        </Typography>
        <Typography
          component="h2"
          variant="h5"
          sx={{
            fontWeight: "bold",
          }}
          gutterBottom
        >
          Tag Everything
        </Typography>
        <Typography gutterBottom>
          Create custom tags for all the areas of your life—Work, Study,
          Exercise, Family. Apply one or more tags to any event to categorize
          your time and unlock insights.
        </Typography>
        <Typography
          component="h2"
          variant="h5"
          sx={{
            fontWeight: "bold",
          }}
          gutterBottom
        >
          Visualize Your Time
        </Typography>
        <Typography gutterBottom>
          Go beyond just looking at your schedule. With interactive charts and
          clear summaries, you can see exactly how many hours you're dedicating
          to each project, hobby, or goal, broken down by day, week, month, or
          year.
        </Typography>
        <Typography
          component="h2"
          variant="h5"
          sx={{
            fontWeight: "bold",
          }}
          gutterBottom
        >
          Access Anywhere
        </Typography>
        <Typography gutterBottom>
          No downloads or installations required. This app runs entirely in your
          browser and is designed for mobile devices. Just open the website on
          your phone and start analyzing your calendar.
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Google Calendar™ is a trademark of Google LLC. This application is not
          affiliated with or endorsed by Google LLC.
        </Typography>
      </Box>
    </>
  );
};

export default HomePage;
