import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import { useUser } from "../setup/app-context-manager/UserContext";
import { useTags } from "../hooks/useTags";

const TagManagementSettings = () => {
  const { session } = useUser();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // Controls the visibility of the Tag Info Dialog
  const [isTagInfoDialogOpen, setIsTagInfoDialogOpen] =
    useState<boolean>(false);

  // fetchTags: Retrieves Tags from the database
  // tags: Stores the Tags retrieved from the database
  // isLoadingTags: Boolean value. If true, is currently loading tags.
  // Otherwise, is false.
  const { fetchTags, tags, isLoadingTags } = useTags();

  // Boolean flag to display textbox
  const [isAddingTag, setIsAddingTag] = useState<boolean>(false);

  // Value used to send to endpoints
  const [newTagName, setNewTagName] = useState<string>("");

  // Stores the id of the tag being edited.
  const [editingTagId, setEditingTagId] = useState<string | null>(null);

  // Temporarily stores the edited tags name before saving.
  const [editedTagName, setEditedTagName] = useState<string>("");

  // The message that is displayed upon tag creation error
  const [tagUpsertError, setTagUpsertError] = useState<string>("");

  // Updates the selected tag's name in the database.
  const handleUpdateTag = async () => {
    if (!session?.access_token || !editingTagId) {
      return;
    }
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/v1/tags/${editingTagId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ name: editedTagName }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      fetchTags();
      handleCancelEdit();
    } catch (error: any) {
      console.error(error);
      setTagUpsertError(error.message);
    }
  };

  // Calls /api/v1/tags endpoint to create a tag
  const handleCreateTag = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ name: newTagName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      fetchTags();
      setNewTagName("");
      setIsAddingTag(false);
    } catch (error: any) {
      setTagUpsertError(error.message);
    }
  };

  // Sets useState to display editing view
  const handleEditClick = (tag: { id: string; name: string }) => {
    setEditingTagId(tag.id);
    setEditedTagName(tag.name);
  };

  // Deletes the selected tag from the database.
  const handleDeleteClick = async (id: string) => {
    if (!session?.access_token) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/tags/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
      fetchTags();
    } catch (error: any) {
      console.error(error);
    }
  };

  // Sets useState to display normal view
  const handleCancelEdit = () => {
    setEditingTagId(null);
    setEditedTagName("");
  };

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          component="h2"
          variant="h6"
          sx={{
            fontWeight: "bold",
          }}
        >
          Tag Management
        </Typography>
        <IconButton
          onClick={() => setIsTagInfoDialogOpen(true)}
          aria-label="info"
        >
          <InfoOutlineIcon />
        </IconButton>
      </Box>
      <Dialog
        open={isTagInfoDialogOpen}
        onClose={() => setIsTagInfoDialogOpen(false)}
      >
        <DialogTitle>Managing Tags</DialogTitle>
        <DialogContent>
          <Typography>
            Tags allow you to categorize your events. By adding tags to your
            events, you can view your calendar and tag analytics on the
            Dashboard page.
          </Typography>
        </DialogContent>
      </Dialog>
      {isLoadingTags && (
        <Box>
          <CircularProgress />
        </Box>
      )}
      {!isLoadingTags && (
        <List>
          {tags.map((tag) => (
            <ListItem
              key={tag.id}
              sx={{ py: 0 }}
              secondaryAction={
                editingTagId === tag.id ? (
                  // Icons for the editing view
                  <>
                    <IconButton
                      onClick={handleUpdateTag}
                      color="primary"
                      edge="end"
                    >
                      <CheckIcon />
                    </IconButton>
                    <IconButton onClick={handleCancelEdit} edge="end">
                      <CloseIcon />
                    </IconButton>
                  </>
                ) : (
                  // Icons for the normal view
                  <>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEditClick(tag)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteClick(tag.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )
              }
            >
              {editingTagId === tag.id ? (
                // TextField for the editing view
                <TextField
                  value={editedTagName}
                  onChange={(e) => {
                    setEditedTagName(e.target.value);
                    setTagUpsertError("");
                  }}
                  variant="standard"
                  size="small"
                  autoFocus
                  slotProps={{
                    input: {
                      inputProps: {
                        maxLength: 50,
                      },
                    },
                  }}
                  error={!!tagUpsertError}
                  helperText={tagUpsertError || `${editedTagName.length} / 50`}
                />
              ) : (
                // Regular display text for normal view
                <ListItemText primary={tag.name} />
              )}
            </ListItem>
          ))}
          {isAddingTag && (
            <ListItem
              secondaryAction={
                <>
                  <IconButton
                    color="primary"
                    edge="end"
                    aria-label="save"
                    onClick={handleCreateTag}
                  >
                    <CheckIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="cancel"
                    onClick={() => {
                      setIsAddingTag(false);
                      setNewTagName("");
                      setTagUpsertError("");
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </>
              }
            >
              <TextField
                value={newTagName}
                onChange={(e) => {
                  setNewTagName(e.target.value);
                  setTagUpsertError("");
                }}
                label="New Tag Name"
                variant="standard"
                size="small"
                autoFocus
                slotProps={{
                  input: {
                    inputProps: {
                      maxLength: 50,
                    },
                  },
                }}
                error={!!tagUpsertError}
                helperText={tagUpsertError || `${newTagName.length} / 50`}
              ></TextField>
            </ListItem>
          )}
        </List>
      )}
      <Button
        variant="contained"
        color="primary"
        onClick={() => setIsAddingTag(true)}
        disabled={isAddingTag}
      >
        Add New Tag
      </Button>
    </>
  );
};

export default TagManagementSettings;
