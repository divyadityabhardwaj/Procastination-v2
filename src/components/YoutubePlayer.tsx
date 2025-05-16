import { useRef } from "react";
import { Box } from "@mui/material";

interface YouTubePlayerProps {
  videoUrl: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export const YouTubePlayer = ({
  videoUrl,
  autoPlay = false,
  muted = false,
  loop = false,
  controls = true,
}: YouTubePlayerProps) => {
  const playerRef = useRef<HTMLIFrameElement>(null);

  const extractVideoId = (url: string) => {
    // Handle both full URLs and just video IDs
    if (url.length === 11 && !url.includes("/") && !url.includes("=")) {
      return url;
    }

    const regExp =
      /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = extractVideoId(videoUrl);

  if (!videoId) {
    console.error("Invalid YouTube URL");
    return null;
  }

  // Construct the embed URL with parameters
  const embedUrl = new URL(`https://www.youtube.com/embed/${videoId}`);
  const params = new URLSearchParams();

  if (autoPlay) params.append("autoplay", "1");
  if (muted) params.append("mute", "1");
  if (loop) params.append("loop", "1");
  if (!controls) params.append("controls", "0");

  embedUrl.search = params.toString();

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        position: "relative",
        paddingTop: "56.25%", // 16:9 aspect ratio
        overflow: "hidden",
        borderRadius: "4px",
      }}
    >
      <iframe
        ref={playerRef}
        src={embedUrl.toString()}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: "none",
        }}
        loading="lazy"
      />
    </Box>
  );
};
