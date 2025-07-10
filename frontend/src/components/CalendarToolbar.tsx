import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarMenu from "./CalendarMenu";

interface CalendarToolbarProps {
  title: string;
  onPrevClick: () => void;
  onTodayClick: () => void;
  onNextClick: () => void;
}

const CalendarToolbar = ({
  title,
  onPrevClick,
  onTodayClick,
  onNextClick,
}: CalendarToolbarProps) => {
  return (
    <>
      <AppBar
        position="fixed"
        color="secondary"
        sx={{ top: (theme) => theme.mixins.toolbar.minHeight }}
      >
        <Toolbar>
          <IconButton
            onClick={onPrevClick}
            sx={{
              border: "2px solid",
              borderColor: "black",
              borderRadius: 2,
              px: 0.5,
              py: 0.5,
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Button
            onClick={onTodayClick}
            sx={{
              color: "black",
              border: "2px solid black",
              borderRadius: "2",
              px: 0.5,
              py: 0.5,
              m: 0.5,
            }}
          >
            Today
          </Button>
          <IconButton
            onClick={onNextClick}
            sx={{
              border: "2px solid",
              borderColor: "black",
              borderRadius: 2,
              px: 0.5,
              py: 0.5,
            }}
          >
            <ChevronRightIcon />
          </IconButton>
          <Typography sx={{ mx: "auto" }}>{title}</Typography>
          <CalendarMenu />
        </Toolbar>
      </AppBar>
    </>
  );
};

export default CalendarToolbar;
