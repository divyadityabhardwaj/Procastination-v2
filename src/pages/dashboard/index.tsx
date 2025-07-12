import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSessions, useCreateSession } from "@/hooks/useApi";
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
import { useRouter } from "next/router";
import Link from "next/link";

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
  const [search, setSearch] = useState("");
  const router = useRouter();

  // Add this useEffect to handle session_id query param redirect
  useEffect(() => {
    if (router.query.session_id) {
      router.replace(`/dashboard/${router.query.session_id}`);
    }
  }, [router.query.session_id, router]);

  const { accessToken, isLoading: authLoading } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState("");

  // Check if user is authenticated
  useEffect(() => {
    if (!authLoading && !accessToken) {
      router.push("/");
    }
  }, [accessToken, authLoading, router]);

  // React Query hooks - only run if user is authenticated
  const { data: sessionsData, isLoading, error } = useSessions();
  const createSessionMutation = useCreateSession();

  const sessions = useMemo(
    () => sessionsData?.sessions || [],
    [sessionsData?.sessions]
  );

  const handleCreateSession = async () => {
    if (!newSessionName.trim()) {
      return;
    }

    try {
      await createSessionMutation.mutateAsync(newSessionName);
      setCreateOpen(false);
      setNewSessionName("");
    } catch (error) {
      console.error("Error creating session:", error);
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

  const handleSessionClick = (sessionId: string) => {
    router.push(`/dashboard/${sessionId}`);
  };

  // Show loading or redirect if not authenticated
  if (authLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <CircularProgress color="primary" />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Loading...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!accessToken) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Please log in to access your dashboard
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/")}
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box
          sx={{
            mb: 6,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "#ffd54f",
              fontWeight: 700,
              mb: 2,
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            Your Dashboard
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.8)",
              fontWeight: 400,
            }}
          >
            Manage your learning sessions and track your progress
          </Typography>
        </Box>

        {/* Controls Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "stretch", sm: "center" },
            mb: 6,
            gap: 3,
          }}
        >
          <Button
            variant="contained"
            onClick={() => setCreateOpen(true)}
            sx={{
              bgcolor: "#ffd54f",
              color: "#121212",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: "1.1rem",
              boxShadow: "0 4px 12px rgba(255, 213, 79, 0.3)",
              "&:hover": {
                bgcolor: "#ffb300",
                boxShadow: "0 6px 16px rgba(255, 213, 79, 0.4)",
              },
            }}
          >
            + New Session
          </Button>

          <TextField
            label="Search sessions"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#ffd54f" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", sm: 340 },
              "& .MuiOutlinedInput-root": {
                bgcolor: "rgba(255,255,255,0.1)",
                borderRadius: 3,
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
          {isLoading ? (
            <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 6 }}>
              <CircularProgress color="primary" sx={{ mt: 8 }} />
              <Typography variant="h6" color="text.secondary">
                Wait, your data is loading...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ gridColumn: "1 / -1", textAlign: "center", py: 6 }}>
              <Typography variant="h6" color="error">
                Error loading sessions: {error.message}
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
                  animate={{ opacity: 1, scale: 1.1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    type: "spring",
                    stiffness: 120,
                  }}
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
                      boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                      position: "relative",
                      overflow: "hidden",
                      cursor: "pointer",
                      transition: "all 0.3s ease-in-out",
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      "&:hover": {
                        transform: "translateY(-8px) scale(1.02)",
                        boxShadow: "0 16px 48px rgba(255, 213, 79, 0.2)",
                        border: "1px solid rgba(255, 213, 79, 0.3)",
                      },
                    }}
                    onClick={() => handleSessionClick(session.id)}
                  >
                    <CardContent
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        gap: 2,
                        p: 3,
                      }}
                    >
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{
                          color: "#fff",
                          fontWeight: 600,
                          fontSize: "1.25rem",
                          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                        }}
                      >
                        {session.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: "rgba(255,255,255,0.7)",
                          fontSize: "0.875rem",
                        }}
                      >
                        Click to open session
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
              background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
              borderRadius: 4,
              boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
              p: 2,
              minWidth: { xs: "90vw", sm: 400 },
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
            Create New Session
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
              label="Session Name"
              fullWidth
              value={newSessionName}
              onChange={(e) => setNewSessionName(e.target.value)}
              disabled={createSessionMutation.isPending}
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
              onClick={() => setCreateOpen(false)}
              disabled={createSessionMutation.isPending}
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
              onClick={handleCreateSession}
              variant="contained"
              disabled={
                createSessionMutation.isPending || !newSessionName.trim()
              }
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
              {createSessionMutation.isPending ? (
                <CircularProgress size={24} sx={{ color: "#121212" }} />
              ) : (
                "Create"
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
