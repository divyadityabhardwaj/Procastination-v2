import { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItemText,
  ListItemButton,
  IconButton,
  Typography,
} from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";
import { supabase } from "@/lib/supabase";

interface Video {
  id: string;
  name: string;
  youtube_url: string;
  sessionId: string;
  created_at: string;
}

interface VideoSidebarProps {
  videos: Video[];
  onVideoSelect: (video: Video) => void;
  onClose: () => void;
}

export const VideoSidebar = ({
  videos,
  onVideoSelect,
  onClose,
}: VideoSidebarProps) => {
  return (
    <Box
      sx={{
        p: 2,
        height: "100%",
        overflowY: "auto",
        bgcolor: "#121212",
        color: "#fff",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <IconButton onClick={onClose} size="small" sx={{ color: "#fff" }}>
          <ChevronLeft sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
      <Typography variant="h6" gutterBottom sx={{ color: "#fff" }}>
        Videos in Session
      </Typography>
      <List>
        {videos.map((video) => (
          <ListItemButton
            sx={{
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.1)",
              },
              color: "#fff",
            }}
            key={video.id}
            onClick={() => onVideoSelect(video)}
          >
            <ListItemText
              sx={{
                fontWeight: 600,
                color: "#fff",
              }}
              primary={video.name}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
};
