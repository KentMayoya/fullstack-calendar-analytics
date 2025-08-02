import { Box, List, ListItem, Link, Typography } from "@mui/material";

const AboutPage = () => {
  const learningObjectives = [
    "Create responsive web pages using the React and Material UI.",
    "Gain familiarity with popular JavaScript libraries like Recharts and FullCalendar.",
    "Create a well-organized project structure.",
    "Connect the frontend UI to a backend database.",
    "Learn synchronization techniques like pushing and polling.",
    "Basic understanding of protecting sensitive information across the internet.",
    "Learn how to deploy a website onto the internet.",
  ];

  return (
    <Box
      sx={{
        p: 2,
      }}
    >
      <Typography
        component="h1"
        variant="h4"
        sx={{
          fontWeight: "bold",
        }}
        gutterBottom
      >
        About
      </Typography>
      <Typography sx={{ mb: 2 }}>
        This is a student project created for educational purposes. It is
        provided "as-is" without any warranty. While I have made every effort to
        ensure the security and functionality of the application, please use it
        at your own discretion. The source code is publicly available on{" "}
        <Link
          href="https://github.com/KentMayoya/fullstack-calendar-analytics"
          target="_blank"
          rel="noopener"
        >
          GitHub
        </Link>
        .
      </Typography>
      <Typography sx={{ mb: 2 }}>
        This website is intended to be used on mobile devices. The layout for
        users on larger devices may not display as intended.
      </Typography>
      <Typography
        component="h2"
        variant="h5"
        sx={{
          fontWeight: "bold",
        }}
        gutterBottom
      >
        The Developer
      </Typography>
      <Typography sx={{ mb: 2 }}>
        At the time of writing, I am senior at the University of Washington,
        Bothell majoring in Computer Science and Software Engineering. This
        website was created for an Independent Studies class offered at my
        university. Most of the website was created by applying what I have
        learned through the following classes: Database Systems, Web Programming
        & Applications, Multithreading in GUI Applications, and Software
        Engineering Analysis & Design. I will graduate in June 2026.
      </Typography>
      <Typography>
        <Link
          href="https://github.com/KentMayoya"
          target="_blank"
          rel="noopener"
        >
          GitHub
        </Link>
      </Typography>
      <Typography sx={{ mb: 2 }}>
        <Link
          href="https://www.linkedin.com/in/kent-mayoya"
          target="_blank"
          rel="noopener"
        >
          LinkedIn
        </Link>
      </Typography>
      <Typography
        component="h2"
        variant="h5"
        sx={{
          fontWeight: "bold",
        }}
        gutterBottom
      >
        Learning Objectives
      </Typography>
      <List>
        {learningObjectives.map((text, index) => (
          <ListItem
            key={index}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              py: 0.5,
            }}
          >
            <Typography sx={{ mr: 2, fontWeight: "bold" }}>
              {`${index + 1}.`}
            </Typography>
            <Typography>{text}</Typography>
          </ListItem>
        ))}
      </List>
      <Typography
        component="h2"
        variant="h5"
        sx={{
          fontWeight: "bold",
        }}
        gutterBottom
      >
        Documentation
      </Typography>
      <Typography sx={{ mb: 2 }}>
        The development journey for this web application is extensively
        documented. If you are interested, you can read the documentation{" "}
        <Link
          href="https://docs.google.com/document/d/1uAhBEbnVo524cUPpnkbll7U3qjt4Nu-vk5zrtT3WKsg"
          target="_blank"
          rel="noopener"
        >
          here
        </Link>
        .
      </Typography>
    </Box>
  );
};

export default AboutPage;
