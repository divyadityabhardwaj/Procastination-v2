import { useEffect, useState, useMemo, useRef } from "react";
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
  Tooltip,
  CircularProgress,
  Tabs,
  Tab,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  DragIndicator as DragIcon,
  Chat as ChatIcon,
  VideoLibrary as VideoIcon,
  Note as NoteIcon,
  PlayArrow as PlayIcon,
  List as ListIcon,
} from "@mui/icons-material";
import { Notepad } from "@/components/Notepad";
import { YouTubePlayer } from "@/components/YoutubePlayer";
import { AIChat } from "@/components/AIChat";
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

type LeftTabType = "notes" | "ai";
type CenterTabType = "video" | "videoList";

export default function SessionPage() {
  const router = useRouter();
  const { sessionId } = router.query;
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [createNoteOpen, setCreateNoteOpen] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState("");

  // Tab management
  const [leftTab, setLeftTab] = useState<LeftTabType>("notes");
  const [centerTab, setCenterTab] = useState<CenterTabType>("video");

  // Resizable layout state
  const [centerPanelWidth, setCenterPanelWidth] = useState(50); // percentage
  const [isResizing, setIsResizing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const resizeRef = useRef<HTMLDivElement>(null);

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

  // Resizing functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const containerWidth = window.innerWidth;
      const sidebarWidth = isSidebarOpen ? 20 : 5;
      const sidebarPixels = (sidebarWidth / 100) * containerWidth;
      const availableWidth = containerWidth - sidebarPixels;
      const newWidth = ((e.clientX - sidebarPixels) / availableWidth) * 100;

      if (newWidth > 30 && newWidth < 70) {
        setCenterPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      // Re-enable pointer events after a short delay
      setTimeout(() => {
        // This ensures smooth transition back to normal interaction
      }, 100);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      // Prevent text selection during resize
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      // Restore normal cursor and selection
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [isResizing, isSidebarOpen]);

  if (notesLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
        }}
      >
        <CircularProgress sx={{ color: "#ffd54f" }} />
        <Typography sx={{ color: "#fff", ml: 2 }}>
          Loading session...
        </Typography>
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
          background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
        }}
      >
        <Typography color="error">
          Error loading session: {notesError.message}
        </Typography>
        <Button
          onClick={() => router.back()}
          sx={{
            bgcolor: "#ffd54f",
            color: "#121212",
            "&:hover": { bgcolor: "#ffb300" },
          }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  const renderLeftTabContent = (tab: LeftTabType) => {
    switch (tab) {
      case "notes":
        return (
          <Box sx={{ height: "100%", overflow: "hidden" }}>
            <Notepad
              note={selectedNote}
              onAddVideo={handleAddVideo}
              onVideoSelect={handleVideoSelect}
              videos={videos}
            />
          </Box>
        );

      case "ai":
        return (
          <Box sx={{ height: "100%", overflow: "hidden" }}>
            <AIChat videos={videos} />
          </Box>
        );

      default:
        return null;
    }
  };

  const renderCenterTabContent = (tab: CenterTabType) => {
    switch (tab) {
      case "video":
        return (
          <Box sx={{ height: "100%", overflow: "hidden", background: "#000" }}>
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
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
                }}
              >
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "1.1rem",
                  }}
                >
                  No video selected
                </Typography>
                {selectedNote && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      const url = prompt("Enter YouTube URL:");
                      if (url) handleAddVideo(url);
                    }}
                    disabled={createVideoMutation.isPending}
                    sx={{
                      bgcolor: "#ffd54f",
                      color: "#121212",
                      fontWeight: 600,
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow: "0 4px 12px rgba(255, 213, 79, 0.3)",
                      "&:hover": {
                        bgcolor: "#ffb300",
                        boxShadow: "0 6px 16px rgba(255, 213, 79, 0.4)",
                      },
                    }}
                  >
                    {createVideoMutation.isPending ? "Adding..." : "Add Video"}
                  </Button>
                )}
              </Box>
            )}
          </Box>
        );

      case "videoList":
        return (
          <Box sx={{ height: "100%", overflow: "auto", p: 2 }}>
            <Typography
              variant="h6"
              sx={{
                color: "#ffd54f",
                fontWeight: 600,
                mb: 2,
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              Video List
            </Typography>
            <Box sx={{ height: "100%", overflow: "auto" }}>
              {videos.map((video: Video) => (
                <Card
                  key={video.id}
                  sx={{
                    mb: 1,
                    cursor: "pointer",
                    background:
                      selectedVideo?.id === video.id
                        ? "linear-gradient(135deg, rgba(255, 213, 79, 0.2) 0%, rgba(255, 213, 79, 0.1) 100%)"
                        : "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                    backdropFilter: "blur(10px)",
                    border:
                      selectedVideo?.id === video.id
                        ? "1px solid rgba(255, 213, 79, 0.3)"
                        : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 2,
                    boxShadow:
                      selectedVideo?.id === video.id
                        ? "0 4px 12px rgba(255, 213, 79, 0.2)"
                        : "0 2px 8px rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(255, 213, 79, 0.3)",
                      border: "1px solid rgba(255, 213, 79, 0.4)",
                    },
                  }}
                  onClick={() => handleVideoSelect(video)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          selectedVideo?.id === video.id ? "#ffd54f" : "#fff",
                        fontWeight: selectedVideo?.id === video.id ? 600 : 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {video.title || video.youtube_url}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          selectedVideo?.id === video.id
                            ? "rgba(255, 213, 79, 0.8)"
                            : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {new Date(video.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
              {selectedNote && (
                <Button
                  variant="contained"
                  onClick={() => {
                    const url = prompt("Enter YouTube URL:");
                    if (url) handleAddVideo(url);
                  }}
                  disabled={createVideoMutation.isPending}
                  sx={{
                    bgcolor: "#ffd54f",
                    color: "#121212",
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: "0 4px 12px rgba(255, 213, 79, 0.3)",
                    "&:hover": {
                      bgcolor: "#ffb300",
                      boxShadow: "0 6px 16px rgba(255, 213, 79, 0.4)",
                    },
                  }}
                >
                  {createVideoMutation.isPending ? "Adding..." : "Add Video"}
                </Button>
              )}
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
        background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
      }}
    >
      {/* Top Navigation Bar */}
      <Box
        sx={{
          height: 60,
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          zIndex: 100,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Tooltip title="Back to Dashboard">
            <IconButton
              onClick={() => router.push("/dashboard")}
              sx={{
                color: "#ffd54f",
                "&:hover": { bgcolor: "rgba(255, 213, 79, 0.1)" },
              }}
            >
              <ArrowBackIcon />
            </IconButton>
          </Tooltip>
          <Typography
            variant="h6"
            sx={{
              color: "#fff",
              fontWeight: 600,
              ml: 1,
            }}
          >
            Session
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Empty space to keep layout balanced */}
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Left Sidebar - All Notes */}
        <Box
          sx={{
            width: isSidebarOpen ? "20%" : "60px",
            transition: "width 0.3s ease-in-out",
            overflow: "hidden",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            background: "linear-gradient(180deg, #121212 0%, #1e1e1e 100%)",
            boxShadow: "2px 0 8px rgba(0,0,0,0.3)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Sidebar Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              minHeight: 60,
            }}
          >
            {isSidebarOpen ? (
              <>
                <Typography
                  variant="h6"
                  sx={{
                    color: "#ffd54f",
                    fontWeight: 600,
                    fontSize: "1rem",
                  }}
                >
                  All Notes
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title="Toggle Sidebar">
                    <IconButton
                      onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                      sx={{
                        color: "#ffd54f",
                        bgcolor: "rgba(255, 213, 79, 0.1)",
                        "&:hover": {
                          bgcolor: "rgba(255, 213, 79, 0.2)",
                        },
                      }}
                    >
                      <MenuIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton
                    onClick={() => setCreateNoteOpen(true)}
                    sx={{
                      color: "#ffd54f",
                      bgcolor: "rgba(255, 213, 79, 0.1)",
                      "&:hover": {
                        bgcolor: "rgba(255, 213, 79, 0.2)",
                      },
                    }}
                    disabled={createNoteMutation.isPending}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Tooltip title="Toggle Sidebar">
                  <IconButton
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    sx={{
                      color: "#ffd54f",
                      bgcolor: "rgba(255, 213, 79, 0.1)",
                      "&:hover": {
                        bgcolor: "rgba(255, 213, 79, 0.2)",
                      },
                    }}
                  >
                    <MenuIcon />
                  </IconButton>
                </Tooltip>
                <IconButton
                  onClick={() => setCreateNoteOpen(true)}
                  sx={{
                    color: "#ffd54f",
                    bgcolor: "rgba(255, 213, 79, 0.1)",
                    "&:hover": {
                      bgcolor: "rgba(255, 213, 79, 0.2)",
                    },
                  }}
                  disabled={createNoteMutation.isPending}
                >
                  <AddIcon />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#ffd54f",
                    fontSize: "0.7rem",
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                  }}
                >
                  Notes
                </Typography>
              </Box>
            )}
          </Box>

          {/* Notes List */}
          {isSidebarOpen && (
            <Box sx={{ flex: 1, overflow: "auto", p: 1 }}>
              {notes.map((note: Note) => (
                <Card
                  key={note.id}
                  sx={{
                    mb: 1,
                    cursor: "pointer",
                    background:
                      selectedNote?.id === note.id
                        ? "linear-gradient(135deg, rgba(255, 213, 79, 0.2) 0%, rgba(255, 213, 79, 0.1) 100%)"
                        : "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                    backdropFilter: "blur(10px)",
                    border:
                      selectedNote?.id === note.id
                        ? "1px solid rgba(255, 213, 79, 0.3)"
                        : "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 2,
                    boxShadow:
                      selectedNote?.id === note.id
                        ? "0 4px 12px rgba(255, 213, 79, 0.2)"
                        : "0 2px 8px rgba(0,0,0,0.2)",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(255, 213, 79, 0.3)",
                      border: "1px solid rgba(255, 213, 79, 0.4)",
                    },
                  }}
                  onClick={() => setSelectedNote(note)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{
                        color:
                          selectedNote?.id === note.id ? "#ffd54f" : "#fff",
                        fontWeight: selectedNote?.id === note.id ? 600 : 400,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        fontSize: "0.875rem",
                      }}
                    >
                      {note.content.replace(/<[^>]*>/g, "").substring(0, 80)}...
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color:
                          selectedNote?.id === note.id
                            ? "rgba(255, 213, 79, 0.8)"
                            : "rgba(255,255,255,0.6)",
                        fontSize: "0.7rem",
                        mt: 1,
                        display: "block",
                      }}
                    >
                      {new Date(note.created_at).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Box>

        {/* Center Panel - Notes/AI */}
        <Box
          sx={{
            width: `${centerPanelWidth}%`,
            transition: isResizing ? "none" : "width 0.3s ease-in-out",
            borderRight: "1px solid rgba(255,255,255,0.1)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Center Tab Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: "rgba(255,255,255,0.1)" }}>
            <Tabs
              value={leftTab}
              onChange={(e, newValue) => setLeftTab(newValue)}
              sx={{
                "& .MuiTab-root": {
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 500,
                  textTransform: "none",
                  minHeight: 48,
                  "&.Mui-selected": {
                    color: "#ffd54f",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#ffd54f",
                },
              }}
            >
              <Tab
                value="notes"
                label="Notes"
                icon={<NoteIcon />}
                iconPosition="start"
              />
              <Tab
                value="ai"
                label="AI Chat"
                icon={<ChatIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Center Tab Content */}
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            {renderLeftTabContent(leftTab)}
          </Box>
        </Box>

        {/* Resize Handle */}
        <Box
          ref={resizeRef}
          onMouseDown={handleMouseDown}
          sx={{
            width: 8,
            background: "rgba(255, 213, 79, 0.3)",
            cursor: "col-resize",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 1000,
            "&:hover": {
              background: "rgba(255, 213, 79, 0.6)",
            },
            "&:active": {
              background: "#ffd54f",
            },
            "&::before": {
              content: '""',
              position: "absolute",
              left: -2,
              right: -2,
              top: 0,
              bottom: 0,
              cursor: "col-resize",
            },
          }}
        >
          <DragIcon sx={{ fontSize: 16, color: "rgba(255, 213, 79, 0.8)" }} />
        </Box>

        {/* Right Panel - Video/Video List */}
        <Box
          sx={{
            width: `${100 - centerPanelWidth}%`,
            transition: isResizing ? "none" : "width 0.3s ease-in-out",
            display: "flex",
            flexDirection: "column",
            pointerEvents: isResizing ? "none" : "auto",
          }}
        >
          {/* Right Tab Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: "rgba(255,255,255,0.1)" }}>
            <Tabs
              value={centerTab}
              onChange={(e, newValue) => setCenterTab(newValue)}
              sx={{
                "& .MuiTab-root": {
                  color: "rgba(255,255,255,0.7)",
                  fontWeight: 500,
                  textTransform: "none",
                  minHeight: 48,
                  "&.Mui-selected": {
                    color: "#ffd54f",
                  },
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#ffd54f",
                },
              }}
            >
              <Tab
                value="video"
                label="Video Player"
                icon={<PlayIcon />}
                iconPosition="start"
              />
              <Tab
                value="videoList"
                label="Video List"
                icon={<ListIcon />}
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {/* Right Tab Content */}
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            {renderCenterTabContent(centerTab)}
          </Box>
        </Box>
      </Box>

      {/* Create Note Dialog */}
      <Dialog
        open={createNoteOpen}
        onClose={() => setCreateNoteOpen(false)}
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
            borderRadius: 4,
            boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            color: "#ffd54f",
            fontSize: "1.25rem",
            pb: 0,
            letterSpacing: 1,
            background: "transparent",
            textAlign: "center",
          }}
        >
          Create New Note
        </DialogTitle>
        <DialogContent
          sx={{
            mt: 2,
            background: "transparent",
          }}
        >
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
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgba(255,255,255,0.1)",
                borderRadius: 2,
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.2)",
                },
                "&:hover fieldset": {
                  borderColor: "#ffd54f",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#ffd54f",
                },
              },
              "& .MuiInputBase-input": {
                color: "#fff",
                fontWeight: 500,
                "&::placeholder": {
                  color: "rgba(255,255,255,0.6)",
                  opacity: 1,
                },
              },
              "& .MuiInputLabel-root": {
                color: "rgba(255,255,255,0.7)",
                "&.Mui-focused": {
                  color: "#ffd54f",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions
          sx={{
            px: 3,
            pb: 2,
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            background: "transparent",
          }}
        >
          <Button
            onClick={() => setCreateNoteOpen(false)}
            disabled={createNoteMutation.isPending}
            sx={{
              color: "rgba(255,255,255,0.7)",
              fontWeight: 600,
              borderRadius: 2,
              px: 2.5,
              py: 1,
              background: "rgba(255,255,255,0.1)",
              "&:hover": {
                background: "rgba(255,255,255,0.2)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateNote}
            variant="contained"
            disabled={createNoteMutation.isPending || !newNoteContent.trim()}
            sx={{
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              py: 1.2,
              maxHeight: 40,
              bgcolor: "#ffd54f",
              color: "#121212",
              boxShadow: "0 4px 12px rgba(255, 213, 79, 0.3)",
              textTransform: "none",
              fontSize: "1.05rem",
              "&:hover": {
                bgcolor: "#ffb300",
                boxShadow: "0 6px 16px rgba(255, 213, 79, 0.4)",
              },
            }}
          >
            {createNoteMutation.isPending ? (
              <CircularProgress size={24} sx={{ color: "#121212" }} />
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
