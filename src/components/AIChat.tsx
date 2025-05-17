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
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { Toast } from "./Toast";
import SyntaxHighlighter from "react-syntax-highlighter";
import tomorrow from "react-syntax-highlighter/dist/esm/styles/hljs/tomorrow";
import { StoreMallDirectory } from "@mui/icons-material";

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

export const AIChat = ({ video }: { video: any }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleCloseToast = () => {
    setShowToast(false);
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
    if (!input.trim()) return;

    const userMessage: Message = {
      content: input,
      role: "user",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Keep the input focused after sending
    setTimeout(() => {
      const inputElement = document.querySelector(
        'input[placeholder="Type your message..."]'
      );
      if (inputElement) {
        (inputElement as HTMLInputElement).focus();
      }
    }, 0);

    setLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          history: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          message: input,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setToastMessage("Failed to get response from AI");
        setShowToast(true);
      }

      const aiMessage: Message = {
        content: data.response,
        role: "model",
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      setToastMessage(error.message || "Failed to get response from AI");
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 1,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Toast
        show={showToast}
        message={toastMessage}
        onClose={handleCloseToast}
      />

      <Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          Chat with AI about the current video
        </Typography>
      </Box>

      {/* Main chat area with proper scrolling */}
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          minHeight: 0, // Important for flex children to respect overflow
        }}
      >
        {/* Messages container with scroll */}
        <Box
          sx={{
            flexGrow: 1,
            overflow: "auto",
            mb: 7, // Leave space for the fixed input area
            px: 1,
          }}
        >
          <List>
            {messages.map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  bgcolor:
                    message.role === "user"
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.2)",
                  borderRadius: 2,
                  mb: 1,
                  p: 2,
                }}
              >
                <ListItemText
                  primary={
                    message.role === "user"
                      ? message.content
                      : parseContent(message.content)
                  }
                  primaryTypographyProps={{
                    color: message.role === "user" ? "primary" : "textPrimary",
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* TODO : fix the paper component at the bottom */}

        <Paper
          elevation={3}
          sx={{
            position: "relative",
            bottom: 0,
            left: 0,
            right: 0,
            p: 1,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            zIndex: 9999,
          }}
        >
          <TextField
            fullWidth
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={loading}
            size="small"
          />
          <IconButton
            color="primary"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            size="small"
          >
            {loading ? <CircularProgress size={16} /> : <SendIcon />}
          </IconButton>
        </Paper>
      </Box>
    </Box>
  );
};
