import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Notepad } from "@/components/Notepad";
import { YouTubePlayer } from "@/components/YoutubePlayer";
import { VideoSidebar } from "@/components/VideoSidebar";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  useNotes,
  useCreateNote,
  useVideos,
  useCreateVideo,
} from "@/hooks/useApi";

interface Note {
  id: string;
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

export default function SessionPage() {
  const router = useRouter();
  const { sessionId } = router.query;
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [createNoteOpen, setCreateNoteOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");

  // React Query hooks
  const {
    data: notesData,
    isLoading: notesLoading,
    error: notesError,
  } = useNotes(sessionId as string);
  const { data: videosData, isLoading: videosLoading } = useVideos(
    selectedNote?.id || ""
  );
  const createNoteMutation = useCreateNote();
  const createVideoMutation = useCreateVideo();

  const notes = useMemo(() => notesData?.notes || [], [notesData?.notes]);
  const videos = useMemo(() => videosData?.videos || [], [videosData?.videos]);

  // Set first note as selected when notes load
  useEffect(() => {
    if (notes.length > 0 && !selectedNote) {
      setSelectedNote(notes[0]);
    }
  }, [notes, selectedNote]);

  // Set first video as selected when videos load
  useEffect(() => {
    if (videos.length > 0 && !selectedVideo) {
      setSelectedVideo(videos[0]);
    } else if (videos.length === 0) {
      setSelectedVideo(null);
    }
  }, [videos, selectedVideo]);

  const handleCreateNote = async () => {
    if (!newNoteContent.trim() || !sessionId) return;

    try {
      const newNote = (await createNoteMutation.mutateAsync({
        sessionId: sessionId as string,
        content: newNoteContent,
      })) as { note: Note };
      setSelectedNote(newNote.note);
      setCreateNoteOpen(false);
      setNewNoteContent("");
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleAddVideo = async (videoUrl: string) => {
    if (!selectedNote) return;

    try {
      const result = (await createVideoMutation.mutateAsync({
        noteId: selectedNote.id,
        videoUrl,
      })) as { videos: Video[] };

      if (result.videos && result.videos.length > 0 && !selectedVideo) {
        setSelectedVideo(result.videos[0]);
      }
    } catch (error) {
      console.error("Error adding video:", error);
    }
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
  };

  if (notesLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography>Loading session...</Typography>
      </Box>
    );
  }

  if (notesError) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography color="error">
          Error loading session: {notesError.message}
        </Typography>
        <Button onClick={() => router.back()}>Go Back</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Notes Sidebar */}
      <Box
        sx={{
          width: isSidebarOpen ? 300 : 50,
          transition: "width 0.3s ease-in-out",
          overflow: "hidden",
          borderRight: isSidebarOpen
            ? "1px solid rgba(255,255,255,0.1)"
            : "none",
          position: "relative",
          backgroundColor: "#121212",
        }}
      >
        {/* Toggle Button */}
        <Box
          sx={{
            position: "absolute",
            right: isSidebarOpen ? "-50px" : "0",
            top: "50%",
            transform: isSidebarOpen
              ? "translateY(-50%)"
              : "translateY(-50%) rotate(180deg)",
            transition: "all ease-in-out",
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: "8px",
            borderRadius: "8px",
            cursor: "pointer",
            zIndex: 1,
            color: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.2)",
            },
          }}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <ChevronLeft sx={{ fontSize: 20 }} />
        </Box>

        {isSidebarOpen && (
          <Box sx={{ p: 2, height: "100%", overflow: "auto" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" color="white">
                Notes
              </Typography>
              <IconButton
                onClick={() => setCreateNoteOpen(true)}
                sx={{ color: "white" }}
                disabled={createNoteMutation.isPending}
              >
                <AddIcon />
              </IconButton>
            </Box>

            {notes.map((note: Note) => (
              <Card
                key={note.id}
                sx={{
                  mb: 1,
                  cursor: "pointer",
                  backgroundColor:
                    selectedNote?.id === note.id
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(255,255,255,0.05)",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.15)",
                  },
                }}
                onClick={() => setSelectedNote(note)}
              >
                <CardContent sx={{ p: 2 }}>
                  <Typography
                    variant="body2"
                    color="white"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {note.content.replace(/<[^>]*>/g, "").substring(0, 100)}...
                  </Typography>
                  <Typography variant="caption" color="rgba(255,255,255,0.6)">
                    {new Date(note.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: "flex" }}>
        {/* Notepad - 50% width */}
        <Box
          sx={{
            width: "50%",
            height: "100%",
            overflow: "auto",
            borderRight: "1px solid #ddd",
          }}
        >
          <Notepad
            note={selectedNote}
            onAddVideo={handleAddVideo}
            onVideoSelect={handleVideoSelect}
            videos={videos}
          />
        </Box>

        {/* Video Player - 50% width */}
        <Box
          sx={{
            width: "50%",
            height: "100%",
            overflow: "hidden",
            backgroundColor: "#000",
          }}
        >
          {selectedVideo ? (
            <YouTubePlayer videoUrl={selectedVideo.youtube_url} />
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                color: "#fff",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Typography>No video selected</Typography>
              {selectedNote && (
                <Button
                  variant="contained"
                  onClick={() => {
                    const url = prompt("Enter YouTube URL:");
                    if (url) handleAddVideo(url);
                  }}
                  disabled={createVideoMutation.isPending}
                >
                  {createVideoMutation.isPending
                    ? "Adding..."
                    : "Add Video to Note"}
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Create Note Dialog */}
      <Dialog open={createNoteOpen} onClose={() => setCreateNoteOpen(false)}>
        <DialogTitle>Create New Note</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Note content"
            fullWidth
            multiline
            rows={4}
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            disabled={createNoteMutation.isPending}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCreateNoteOpen(false)}
            disabled={createNoteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateNote}
            disabled={createNoteMutation.isPending || !newNoteContent.trim()}
          >
            {createNoteMutation.isPending ? "Creating..." : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
