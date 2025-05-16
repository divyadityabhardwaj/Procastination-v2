// Notepad.tsx
import dynamic from "next/dynamic";
import { Box, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import "react-quill/dist/quill.snow.css";

// Custom scrollbar styles
const customScrollbarStyles = `
  /* WebKit browsers */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  /* Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
  }
`;

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

export const Notepad = ({ video }: any) => {
  const [content, setContent] = useState("<p>Start writing...</p>");

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = customScrollbarStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <Box sx={{ p: 3, height: "100vh", overflow: "hidden" }}>
      <Typography variant="h6" gutterBottom>
        {video?.name || "No video selected"}
      </Typography>
      <Box
        sx={{
          mt: 2,
          border: "none",
          borderRadius: "4px",
          bgcolor: "rgba(255,255,255,0.1)",
          height: "calc(100vh - 100px)",
          overflow: "auto",
          // Apply scrollbar styles
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "rgba(255, 255, 255, 0.3)",
          },
          // Firefox scrollbar
          "&::-moz-scrollbar": {
            width: "8px",
          },
          "&::-moz-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.05)",
            borderRadius: "4px",
          },
          "&::-moz-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.2)",
            borderRadius: "4px",
          },
        }}
      >
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
          style={{ height: "100%" }}
        />
      </Box>
    </Box>
  );
};

export default Notepad;
