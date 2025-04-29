import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import {
  Container,
  Box,
  TextField,
  Card,
  CardContent,
  Typography,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AnimatePresence, motion } from "framer-motion";

interface Session {
  id: string;
  name: string;
}

function getCardPattern(index: number) {
  const patterns = [
    // Subtle diagonal dark gradient
    "linear-gradient(135deg, #121212 0%, rgba(66,66,66,0.95) 100%)",
    // Subtle stripes using background and primary
    "repeating-linear-gradient(45deg, #121212 0px, #121212 6px, rgba(255,255,255,0.08) 6px, rgba(255,255,255,0.08) 12px)",
    // Grid lines with background and paper
    "linear-gradient(#232323 1px, transparent 1px), linear-gradient(90deg, #232323 1px, transparent 1px)",
    // Radial highlight with primary
    // "radial-gradient(circle at center, rgba(255,255,255,0.10) 0%, #121212 80%)",
    // Subtle vertical stripes
    "repeating-linear-gradient(0deg, #232323 0px, #232323 2px, #121212 2px, #121212 4px)",
    // Diagonal checkerboard with primary tint
    // "linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.05) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.05) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.05) 75%)",
  ];
  return {
    backgroundImage: patterns[index % patterns.length],
    backgroundSize: patterns[index % patterns.length].includes("repeating")
      ? "auto"
      : "cover",
  };
}

export default function Dashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const user = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.user?.id) return;
    setLoading(true);
    fetch(`/api/session/getAllSession?userId=${user?.user?.id}`)
      .then((res) => res.json())
      .then((data) => setSessions(data.sessions || []))
      .finally(() => setLoading(false));
  }, [user]);
  const handleCreateSession = async () => {
    if (!newSessionName.trim()) {
      setCreateError("Session name cannot be empty.");
      return;
    }
    setCreating(true);
    setCreateError("");
    try {
      const res = await fetch("/api/session/createSession", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSessionName, userId: user?.user?.id }),
      });
      if (!res.ok) {
        throw new Error("Failed to create session");
      }
      setCreateOpen(false);
      setNewSessionName("");
      setLoading(true);
      fetch(`/api/session/getAllSession?userId=${user?.user?.id}`)
        .then((res) => res.json())
        .then((data) => setSessions(data.sessions || []))
        .finally(() => setLoading(false));
    } catch (err) {
      setCreateError("Error creating session. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  const sortedSessions = useMemo(() => {
    if (!search)
      return [...sessions].sort((a, b) => a.name.localeCompare(b.name));
    return [...sessions]
      .sort((a, b) => a.name.localeCompare(b.name))
      .sort((a, b) => {
        const aMatch = a.name.toLowerCase().indexOf(search.toLowerCase());
        const bMatch = b.name.toLowerCase().indexOf(search.toLowerCase());
        if (aMatch === -1 && bMatch === -1) return 0;
        if (aMatch === -1) return 1;
        if (bMatch === -1) return -1;
        return aMatch - bMatch;
      });
  }, [sessions, search]);

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          px: { xs: 2, sm: 0 },
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreateOpen(true)}
          sx={{ fontWeight: 600 }}
        >
          + New Session
        </Button>

        <TextField
          label="Search sessions"
          variant="standard"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            disableUnderline: false,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
            sx: {
              fontWeight: 600,
              fontFamily: "'Montserrat', sans-serif",
              fontSize: "1.15rem",
            },
          }}
          sx={{
            width: { xs: "100%", sm: 340 },
            "& .MuiInputBase-root": {
              borderBottom: "2px solid #1976d2",
              borderRadius: 0,
            },
            "& .MuiInputBase-input": {
              color: "text.primary",
              fontWeight: 600,
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: 1,
              px: 0,
              py: 1,
            },
            "& .MuiInput-underline:before, & .MuiInput-underline:after": {
              borderBottom: "2px solid #1976d2",
            },
            "& .MuiInputLabel-root": {
              fontWeight: 500,
              fontFamily: "'Montserrat', sans-serif",
              color: "#1976d2",
              letterSpacing: 1,
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 4,
          width: "100%",
        }}
      >
        {loading ? (
          <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 6 }}>
            <CircularProgress color="primary" sx={{ mt: 8 }} />
            <Typography variant="h6" color="text.secondary">
              Wait, your data is loading...
            </Typography>
          </Box>
        ) : sortedSessions.length === 0 ? (
          <Box
            sx={{
              gridColumn: "1 / -1",
              textAlign: "center",
              color: "text.secondary",
              py: 6,
            }}
          >
            <Typography variant="h6" fontWeight={500}>
              No sessions found.
            </Typography>
          </Box>
        ) : (
          <AnimatePresence>
            {sortedSessions.map((session, idx) => (
              <motion.div
                key={session.id}
                layout
                // initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1.1, y: 0 }}
                // exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.25, type: "spring", stiffness: 120 }}
                style={{ width: "100%" }}
              >
                <Card
                  key={session.id}
                  sx={{
                    width: "100%",
                    height: 200,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    borderRadius: 4,
                    boxShadow: 4,
                    position: "relative",
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "box-shadow 0.2s, transform 0.2s",
                    ...getCardPattern(idx),
                    "&:hover": {
                      boxShadow: 8,
                      transform: "translateY(-4px)",
                    },
                  }}
                  onClick={() => {
                    // handle card click if needed
                  }}
                >
                  <CardContent
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      borderRadius: 3,
                      px: 3,
                      py: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      fontFamily="'Montserrat', sans-serif"
                      color="primary"
                      gutterBottom
                      sx={{
                        mb: 0.5,
                        wordBreak: "break-word",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {session.name}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </Box>
      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        PaperProps={{
          sx: {
            background: "rgba(18, 18, 18, 0.98)",
            borderRadius: 4,
            boxShadow: 12,
            p: 2,
            minWidth: { xs: "90vw", sm: 400 },
            fontFamily: "'Montserrat', sans-serif",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 500,
            fontFamily: "'Montserrat', sans-serif",
            color: "primary.main",
            fontSize: "1rem",
            pb: 0,
            letterSpacing: 1,
            background: "transparent",
          }}
        >
          Create New Session
        </DialogTitle>
        <DialogContent
          sx={{
            mt: 1,
            background: "transparent",
            fontFamily: "'Montserrat', sans-serif",
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            label="Session Name"
            fullWidth
            value={newSessionName}
            onChange={(e) => setNewSessionName(e.target.value)}
            disabled={creating}
            error={!!createError}
            helperText={createError}
            variant="standard"
            sx={{
              color: "#1976d2",
              fontWeight: 500,
              fontFamily: "'Montserrat', sans-serif",
              letterSpacing: 1,
              "& .MuiInput-underline:before, & .MuiInput-underline:after": {
                borderBottom: "2px solid #1976d2",
              },

              fontSize: "1.1rem",
              "& .MuiInputBase-input": {
                color: "text.primary",
                fontWeight: 600,
                fontFamily: "'Montserrat', sans-serif",
                letterSpacing: 1,
              },
              mb: 1,
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
            onClick={() => setCreateOpen(false)}
            disabled={creating}
            sx={{
              fontFamily: "'Montserrat', sans-serif",
              color: "text.secondary",
              fontWeight: 600,
              borderRadius: 2,
              px: 2.5,
              py: 1,
              background: "rgba(25, 118, 210, 0.07)",
              "&:hover": {
                background: "rgba(25, 118, 210, 0.15)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateSession}
            variant="contained"
            disabled={creating}
            sx={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 700,
              borderRadius: 2,
              px: 3,
              py: 1.2,
              maxHeight: 40,
              background: "linear-gradient(90deg,rgb(0, 116, 232) 60%,rgb(0, 117, 212) 100%)",
              color: "#fff",
              boxShadow: 3,
              textTransform: "none",
              fontSize: "1.05rem",
              "&:hover": {
                background: "linear-gradient(90deg,rgb(57, 120, 168) 100%)",
              },
            }}
          >
            {creating ? (
              <CircularProgress size={24} sx={{ color: "#fff" }} />
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
