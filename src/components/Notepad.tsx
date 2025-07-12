// Notepad.tsx
import dynamic from "next/dynamic";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  styled,
  Stack,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import { AIChat } from "./AIChat";
import { Add as AddIcon, PlayArrow as PlayIcon } from "@mui/icons-material";
import { useUpdateNote } from "@/hooks/useApi";

// Create a dynamic import for ReactQuill that disables SSR
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video"],
    ["code-block"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
  "video",
  "code-block",
];

const StyledTabs = styled(Tabs)({
  "& .MuiTabs-flexContainer": {
    justifyContent: "center",
  },
  "& .MuiTab-root": {
    minWidth: "120px",
    textTransform: "none",
  },
});

interface Note {
  id: string;
  title: string;
  content: string;
  session_id: string;
  user_id: string;
  created_at: string;
  video_id?: string;
}

interface Video {
  id: string;
  youtube_url: string;
  title: string;
  note_id: string;
  created_at: string;
}

interface NotepadProps {
  note: Note | null;
  onAddVideo: (videoUrl: string) => void;
  onVideoSelect: (video: Video) => void;
  videos: Video[];
}

export const Notepad = ({
  note,
  onAddVideo,
  onVideoSelect,
  videos,
}: NotepadProps) => {
  const [content, setContent] = useState("<p>Start writing...</p>");
  const [activeTab, setActiveTab] = useState(0);

  // React Query hook
  const updateNoteMutation = useUpdateNote();

  // Update content when note changes
  useEffect(() => {
    if (note) {
      setContent(note.content || "<p>Start writing...</p>");
    } else {
      setContent("<p>Select a note to start writing...</p>");
    }
  }, [note]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSaveNote = async () => {
    if (!note) {
      console.log("No note selected, cannot save");
      return;
    }

    console.log("Saving note:", note.id, content);
    try {
      await updateNoteMutation.mutateAsync({
        noteId: note.id,
        content: content,
      });
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleAddVideo = () => {
    const url = prompt("Enter YouTube URL:");
    if (url) {
      onAddVideo(url);
    }
  };

  const handleVideoSelect = (video: Video) => {
    onVideoSelect(video);
  };

  if (!note) {
    return (
      <Box
        sx={{
          p: 3,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Select a note to start writing
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, height: "100vh", overflow: "hidden" }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ flex: 1 }}>
          {note.title}
        </Typography>
        <Button
          variant="outlined"
          size="small"
          onClick={handleSaveNote}
          disabled={updateNoteMutation.isPending}
        >
          {updateNoteMutation.isPending ? "Saving..." : "Save"}
        </Button>
        <StyledTabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Notepad" />
          {/* <Tab label="Videos" />
          <Tab label="AI Chat" /> */}
        </StyledTabs>
      </Stack>

      <Box
        sx={{
          mt: 2,
          border: "none",
          borderRadius: "4px",
          bgcolor: "rgba(255,255,255,0.1)",
          height: "calc(100vh - 150px)",
          overflow: "auto",
        }}
      >
        {activeTab === 0 ? (
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            style={{ height: "100%" }}
          />
        ) : activeTab === 1 ? (
          <Box sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">Videos</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddVideo}
                variant="contained"
                size="small"
              >
                Add Video
              </Button>
            </Box>

            {videos.length === 0 ? (
              <Typography
                color="text.secondary"
                sx={{ textAlign: "center", mt: 4 }}
              >
                No videos added to this note yet.
                <br />
                Click &quot;Add Video&quot; to get started.
              </Typography>
            ) : (
              <List>
                {videos.map((video) => (
                  <ListItem
                    key={video.id}
                    sx={{
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 1,
                      mb: 1,
                      "&:hover": {
                        backgroundColor: "rgba(255,255,255,0.05)",
                      },
                    }}
                  >
                    <ListItemText
                      primary={video.title}
                      secondary={video.youtube_url}
                    />
                    <IconButton
                      onClick={() => handleVideoSelect(video)}
                      sx={{ color: "primary.main" }}
                    >
                      <PlayIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        ) : (
          <Box sx={{ p: 2 }}>
            <AIChat videos={videos} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Notepad;
