import {
  AppBar,
  Autocomplete,
  Box,
  Divider,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Toolbar,
  Typography,
  TextField,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";
import {
  useCalendar,
  type Calendar,
} from "../../setup/app-context-manager/CalendarContext";
import { type Tag, useTags } from "../../hooks/useTags";

interface DashboardToolbarProps {
  title: string;
  view: string;
  setView: (newView: string) => void;
  onPrevClick: () => void;
  onTodayClick: () => void;
  onNextClick: () => void;
  selectedCalendars: Calendar[];
  setSelectedCalendars: (calendar: Calendar[]) => void;
  selectedTag: Tag | null;
  setSelectedTag: (tag: Tag | null) => void;
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
  onTodayClick,
  onNextClick,
  selectedCalendars,
  setSelectedCalendars,
  selectedTag,
  setSelectedTag,
}: DashboardToolbarProps) => {
  const { syncedCalendars } = useCalendar();
  const { tags } = useTags();

  // Updates the view state when a new view is selected
  const handleViewChange = (
    _event: React.MouseEvent<HTMLElement>,
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
        <Toolbar>
          <Box />
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
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
          <Box sx={{ ml: "auto" }}>
            <IconButton onClick={onTodayClick}>
              <TodayIcon />
            </IconButton>
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
      <Box sx={{ p: 1 }}>
        <Autocomplete
          sx={{
            mt: selectedCalendars.length === 0 ? 0 : 1,
          }}
          multiple
          options={syncedCalendars}
          getOptionLabel={(option) => option.name}
          value={selectedCalendars}
          onChange={(_event, newValue) => {
            setSelectedCalendars(newValue);
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label="Calendars" />
          )}
        />
        <Autocomplete
          sx={{
            mt: selectedTag === null ? 0 : 2,
          }}
          options={tags}
          getOptionLabel={(option) => option.name}
          value={selectedTag}
          onChange={(_event, newValue) => {
            setSelectedTag(newValue);
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => (
            <TextField {...params} variant="standard" label="Tag" />
          )}
        />
      </Box>
    </>
  );
};

export default DashboardToolbar;
