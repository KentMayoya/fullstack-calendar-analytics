import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

interface DashboardToolbarProps {
  title: string;
  view: string;
  setView: (newView: string) => void;
  onPrevClick: () => void;
  onNextClick: () => void;
}

const iconStyle = {
  border: "2px solid black",
  borderRadius: 2,
  px: 0.5,
  py: 0.5,
};

const DashboardToolbar = ({
  title,
  view,
  setView,
  onPrevClick,
  onNextClick,
}: DashboardToolbarProps) => {
  const handleViewChange = (
    event: React.MouseEvent<HTMLElement>,
    newView: string | null
  ) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <>
      <AppBar
        position="fixed"
        color="default"
        sx={{
          top: (theme) => theme.mixins.toolbar.minHeight,
          boxShadow: "none",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box />
          <Box>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              aria-label="date range"
            >
              <ToggleButton value="day" aria-label="day">
                Day
              </ToggleButton>
              <ToggleButton value="week" aria-label="week">
                Week
              </ToggleButton>
              <ToggleButton value="month" aria-label="month">
                Month
              </ToggleButton>
              <ToggleButton value="year" aria-label="year">
                Year
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
          <Box />
        </Toolbar>
        <Divider />
      </AppBar>
      <Toolbar />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton sx={iconStyle} onClick={onPrevClick}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography sx={{ mx: "auto" }}>{title}</Typography>
        <IconButton sx={iconStyle} onClick={onNextClick}>
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </>
  );
};

type ReusableButtonProps = {
  text: string;
  onClick: () => void;
};

const ReusableButton = ({ text, onClick }: ReusableButtonProps) => {
  return (
    <Button
      sx={{
        color: "white",
        border: "2px solid white",
        borderRadius: "2",
        px: 0.5,
        py: 0.5,
        m: 0.5,
      }}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default DashboardToolbar;
