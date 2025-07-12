// In src/components/AIChat.tsx
import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  styled,
  Button,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DescriptionIcon from "@mui/icons-material/Description";
import { Toast } from "./Toast";
import SyntaxHighlighter from "react-syntax-highlighter";
import tomorrow from "react-syntax-highlighter/dist/esm/styles/hljs/tomorrow";
import { StoreMallDirectory } from "@mui/icons-material";
import { useVideoSummary, useChat } from "@/hooks/useApi";

// Create a styled component for code blocks
const CodeBlock = styled(Typography)({
  variant: "code",
  backgroundColor: "#282c34",
  color: "white",
  padding: "16px",
  borderRadius: "4px",
  fontFamily: "monospace",
  fontSize: "14px",
});

interface Message {
  content: string;
  role: "user" | "model";
  createdAt: string;
}

interface Video {
  id: string;
  youtube_url: string;
  title: string;
  note_id: string;
  created_at: string;
}

export const AIChat = ({ videos }: { videos: Video[] }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // React Query hooks
  const videoSummaryMutation = useVideoSummary();
  const chatMutation = useChat();

  const handleCloseToast = () => {
    setShowToast(false);
  };

  const fetchVideoSummary = async (videoId: string) => {
    if (!videoId || videoId.trim().length === 0) {
      setToastMessage("Invalid video ID");
      setShowToast(true);
      return;
    }

    try {
      console.log("Fetching summary for video ID:", videoId);

      // Add the summary request to messages
      const userMessage: Message = {
        content: `Please tell me the video summary for video ID: ${videoId}`,
        role: "user",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);

      const data = await videoSummaryMutation.mutateAsync(videoId);

      // Add the summary response to messages with source information
      const sourceInfo =
        data.source === "metadata"
          ? "\n\n*Note: This summary was generated from the video's title and description since no transcript was available.*"
          : "\n\n*Note: This summary was generated from the video's transcript.*";

      const aiMessage: Message = {
        content: data.response + sourceInfo,
        role: "model",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error fetching video summary:", error);

      // Add error message to chat
      const errorMessage: Message = {
        content: `Error: ${error.message || "Failed to get video summary"}`,
        role: "model",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
      setToastMessage(error.message || "Failed to get video summary");
      setShowToast(true);
    }
  };

  // Function to parse content with markdown-like formatting
  const parseContent = (content: string) => {
    // Split content into parts with different formatting
    const parts = content.split(/(```[\s\S]*?```|`[^`]*`|\*\*[^*]*\*\*|\n)/g);

    return parts.map((part, index) => {
      if (!part) return null;

      // Handle code blocks
      if (part.startsWith("```") && part.endsWith("```")) {
        const codeBlock = part.slice(3, -3).trim();
        const [language, ...codeLines] = codeBlock.split("\n");
        const code = codeLines.join("\n").trim();

        return (
          <SyntaxHighlighter
            key={index}
            language={language || "javascript"}
            style={tomorrow}
            showLineNumbers
            customStyle={{
              backgroundColor: "#121212",
              color: "#ffffff",
              borderRadius: 8,
              padding: "1rem",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {code}
          </SyntaxHighlighter>
        );
      }

      // Handle inline code
      if (part.startsWith("`") && part.endsWith("`")) {
        const code = part.slice(1, -1);
        return (
          <Typography
            key={index}
            component="span"
            sx={{
              backgroundColor: "#282c34",
              p: 0.5,
              borderRadius: 1,
              fontFamily: "monospace",
              fontSize: "0.875rem",
            }}
          >
            {code}
          </Typography>
        );
      }

      // Handle bold text
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2);
        return (
          <Typography key={index} component="span" fontWeight="bold">
            {boldText}
          </Typography>
        );
      }

      // Handle line breaks
      if (part === "\n") {
        return <br key={index} />;
      }

      // Handle multiple consecutive spaces
      if (part.includes("  ")) {
        const spacedParts = part.split(/(  +)/g);
        return (
          <span key={index}>
            {spacedParts.map((spacedPart, spacedIndex) =>
              spacedPart.match(/  +/) ? (
                <span key={spacedIndex} style={{ whiteSpace: "pre" }}>
                  {spacedPart}
                </span>
              ) : (
                <span key={spacedIndex}>{spacedPart}</span>
              )
            )}
          </span>
        );
      }

      // Regular text
      return (
        <Typography key={index} component="span" variant="body2">
          {part}
        </Typography>
      );
    });
  };

  const sendMessage = async () => {
    if (!input.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      content: input,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const data = await chatMutation.mutateAsync({
        message: input,
        history: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        // Include video context if available
        videoContext:
          videos.length > 0
            ? videos.map((v) => ({
                id: v.id,
                title: v.title,
                url: v.youtube_url,
              }))
            : undefined,
      });

      const aiMessage: Message = {
        content: data.response,
        role: "model",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      setToastMessage(error.message || "Failed to send message");
      setShowToast(true);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Video Summary Section */}
      {videos.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Videos in this note:
          </Typography>
          <List dense>
            {videos.map((video) => {
              let videoId: string | null = null;
              try {
                const urlObj = new URL(video.youtube_url);
                videoId = urlObj.searchParams.get("v");
              } catch (error) {
                console.error(
                  "Error parsing YouTube URL:",
                  video.youtube_url,
                  error
                );
              }

              return (
                <ListItem
                  key={video.id}
                  sx={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={video.title}
                    secondary={video.youtube_url}
                  />
                  <Button
                    size="small"
                    onClick={() => {
                      if (videoId) {
                        fetchVideoSummary(videoId);
                      } else {
                        setToastMessage("Invalid YouTube URL format");
                        setShowToast(true);
                      }
                    }}
                    disabled={videoSummaryMutation.isPending || !videoId}
                    startIcon={<DescriptionIcon />}
                  >
                    Summary
                  </Button>
                </ListItem>
              );
            })}
          </List>
        </Box>
      )}

      {/* Chat Messages */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          mb: 2,
          p: 2,
          backgroundColor: "rgba(255,255,255,0.05)",
          borderRadius: 1,
        }}
      >
        {messages.length === 0 ? (
          <Typography
            color="text.secondary"
            sx={{ textAlign: "center", mt: 4 }}
          >
            {videos.length > 0
              ? "Ask me about the videos in this note or request a summary!"
              : "Start a conversation with AI about your notes!"}
          </Typography>
        ) : (
          messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                display: "flex",
                justifyContent:
                  message.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: "80%",
                  backgroundColor:
                    message.role === "user"
                      ? "primary.main"
                      : "rgba(255,255,255,0.1)",
                  color: message.role === "user" ? "white" : "text.primary",
                }}
              >
                <Box>{parseContent(message.content)}</Box>
                <Typography variant="caption" sx={{ mt: 1, opacity: 0.7 }}>
                  {new Date(message.createdAt).toLocaleTimeString()}
                </Typography>
              </Paper>
            </Box>
          ))
        )}
        {(chatMutation.isPending || videoSummaryMutation.isPending) && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>

      {/* Input Section */}
      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about your notes or videos..."
          disabled={chatMutation.isPending}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "rgba(255,255,255,0.05)",
            },
          }}
        />
        <IconButton
          onClick={sendMessage}
          disabled={chatMutation.isPending || !input.trim()}
          sx={{ alignSelf: "flex-end" }}
        >
          <SendIcon />
        </IconButton>
      </Box>

      <Toast
        open={showToast}
        message={toastMessage}
        onClose={handleCloseToast}
        severity="error"
      />
    </Box>
  );
};
