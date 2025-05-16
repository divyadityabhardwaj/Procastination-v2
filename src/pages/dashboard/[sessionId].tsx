import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import { supabase } from "@/lib/supabase";
import { Notepad } from "@/components/Notepad";
import { YouTubePlayer } from "@/components/YoutubePlayer";
import { VideoSidebar } from "@/components/VideoSidebar";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

export default function SessionPage() {
  const router = useRouter();
  const { sessionId } = router.query;
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null);
  const [videos, setVideos] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Fetch videos for the session
  useEffect(() => {
    const fetchVideos = async () => {
      if (!sessionId) return;

      try {
        const { data, error } = await supabase
          .from("videos")
          .select("*")
          .eq("session_id", sessionId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setVideos(data || []);
        if (data && data.length > 0) setSelectedVideo(data[0]);
      } catch (error) {
        console.error("Error fetching videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [sessionId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography>Loading videos...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Video Sidebar */}
      <Box
        sx={{
          width: isSidebarOpen ? 250 : 50,
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
          <VideoSidebar
            videos={videos}
            onVideoSelect={(video) => setSelectedVideo(video)}
            onClose={() => setIsSidebarOpen(false)}
          />
        )}
      </Box>

      {/* Main Content Area - Fixed 50/50 Split */}
      <Box sx={{ flex: 1, display: "flex" }}>
        {/* Notepad - Fixed 50% width */}
        <Box
          sx={{
            width: "50%",
            height: "100%",
            overflow: "auto",
            borderRight: "1px solid #ddd",
          }}
        >
          <Notepad video={selectedVideo} />
        </Box>

        {/* Video Player - Fixed 50% width */}
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
              }}
            >
              <Typography>Select a video to play</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
