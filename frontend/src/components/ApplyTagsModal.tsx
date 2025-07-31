import {
  Box,
  Typography,
  Button,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import ReusableModal from "./ReusableModal";
import { useUser } from "../setup/app-context-manager/UserContext";
import { useTags, type Tag } from "../hooks/useTags";
import { useEffect, useState } from "react";

type ApplyTagsModalProps = {
  eventId: string | undefined;
  title: string | undefined;
  handleClose: () => void;
};

const ApplyTagsModal = ({
  eventId,
  title,
  handleClose,
}: ApplyTagsModalProps) => {
  const { session } = useUser();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { tags: allTags } = useTags();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [isLoadingSelectedTags, setIsLoadingSelectedTags] =
    useState<boolean>(true);

  // Loads all the tags related to the specific eventId
  useEffect(() => {
    if (!eventId || !session?.access_token) {
      return;
    }
    const fetchAppliedTags = async () => {
      try {
        setIsLoadingSelectedTags(true);
        const response = await fetch(
          `${API_BASE_URL}/api/v1/events/${eventId}/tags`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );
        const data = await response.json();
        setSelectedTags(data);
      } catch (error: any) {
        console.error("Failed to fetch the applied tags", error);
      } finally {
        setIsLoadingSelectedTags(false);
      }
    };

    fetchAppliedTags();
  }, [eventId, session?.access_token, API_BASE_URL]);

  // Saves the selected tags to the event
  const handleSave = async () => {
    if (!session?.access_token) {
      return;
    }
    const tagIds = selectedTags.map((tag) => tag.id);
    try {
      await fetch(`${API_BASE_URL}/api/v1/events/${eventId}/tags`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ tagIds: tagIds }),
      });
      handleClose();
    } catch (error: any) {
      console.error("Failed to update tags", error);
    }
  };

  return (
    <ReusableModal isOpen={true} handleClose={handleClose}>
      <Typography
        component="h2"
        variant="h6"
        sx={{
          fontWeight: "bold",
        }}
      >
        Modify Tags
      </Typography>
      <Typography>{title}</Typography>
      <Box sx={{ p: 1 }}>
        {isLoadingSelectedTags ? (
          <CircularProgress />
        ) : (
          <Autocomplete
            multiple
            options={allTags}
            getOptionLabel={(option) => option.name}
            value={selectedTags}
            onChange={(event, newValue) => {
              setSelectedTags(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
              <TextField {...params} variant="standard" label="Tags" />
            )}
          />
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 2,
        }}
      >
        <Button variant="contained" color="primary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
      </Box>
    </ReusableModal>
  );
};

export default ApplyTagsModal;
