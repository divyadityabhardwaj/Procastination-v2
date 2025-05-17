// Notepad.tsx
import dynamic from "next/dynamic";
import { Box, Typography, Tabs, Tab, styled, Stack } from "@mui/material";
import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { AIChat } from "./AIChat";

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

export const Notepad = ({ video }: any) => {
  const [content, setContent] = useState("<p>Start writing...</p>");
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ p: 3, height: "100vh", overflow: "hidden" }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography variant="h6" gutterBottom>
          {video?.name || "No video selected"}
        </Typography>
        <StyledTabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Notepad" />
          <Tab label="AI Chat" />
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
        ) : (
          <Box sx={{ p: 2 }}>
            <AIChat video={video} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Notepad;
